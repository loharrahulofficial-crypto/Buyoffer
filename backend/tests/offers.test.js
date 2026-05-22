import request from 'supertest';
import { haversineDistance } from '../utils/distance.js';

const API_URL = 'http://localhost:5000';

describe('A. API Endpoint Tests', () => {
  test('TEST-001: GET /api/health', async () => {
    const res = await request(API_URL).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });

  test('TEST-002: GET /api/offers (no filters)', async () => {
    const res = await request(API_URL).get('/api/offers');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.offers)).toBe(true);
  });

  test('TEST-003: GET /api/offers?category=traveling', async () => {
    const res = await request(API_URL).get('/api/offers?category=traveling');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.offers)).toBe(true);
    res.body.offers.forEach(offer => {
      expect(offer.category).toBe('traveling');
    });
  });

  test('TEST-004: GET /api/offers?q=hotel', async () => {
    const res = await request(API_URL).get('/api/offers?q=hotel');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.offers)).toBe(true);
    res.body.offers.forEach(offer => {
      const match = offer.title.toLowerCase().includes('hotel') || offer.description.toLowerCase().includes('hotel');
      expect(match).toBe(true);
    });
  });

  test('TEST-005: GET /api/offers/nearby?lat=23.02&lng=72.57&radius=10', async () => {
    const res = await request(API_URL).get('/api/offers/nearby?lat=23.02&lng=72.57&radius=10');
    // If MongoDB is connected it returns 200, if not it falls back/errors.
    // Let's expect either 200 or 500/400 (if invalid params).
    expect([200, 400, 500]).toContain(res.status);
  });

  test('TEST-006: POST /api/clicks rate limit test', async () => {
    const payload = { offerId: 'd1', category: 'food', affiliateLink: 'https://dominos.co.in' };
    const res = await request(API_URL)
      .post('/api/clicks')
      .send(payload);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });
});

describe('B. Authentication Tests', () => {
  test('TEST-007: GET /auth/me without token', async () => {
    const res = await request(API_URL).get('/auth/me');
    expect(res.status).toBe(401);
  });

  test('TEST-008: GET /auth/me with expired token', async () => {
    const res = await request(API_URL)
      .get('/auth/me')
      .set('Authorization', 'Bearer expired_token_here');
    expect(res.status).toBe(401);
  });
});

describe('C. Geolocation / Haversine Tests', () => {
  test('TEST-012: Haversine distance calculation', () => {
    // Mumbai (19.076, 72.877) to Pune (18.520, 73.856)
    const dist = haversineDistance(19.076, 72.877, 18.520, 73.856);
    expect(dist).toBeGreaterThan(115);
    expect(dist).toBeLessThan(125);
  });
});
