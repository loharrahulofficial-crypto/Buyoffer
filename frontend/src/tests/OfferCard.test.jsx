import { describe, test, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import { OfferCard } from '../App.jsx';

afterEach(() => {
  cleanup();
});

const mockOffer = {
  id: "d1",
  title: "50% Off Dominos Pizza",
  description: "Get flat 50% off on all pizzas up to ₹100",
  category: "food",
  brand: { name: "Dominos" },
  pricing: { originalPrice: 200, discountedPrice: 100, discountPercent: 50, currency: "INR" },
  affiliate: { link: "https://dominos.co.in", network: "direct" },
  location: { type: "online", cities: [], areas: [] },
  validity: { endDate: "2027-01-01", isActive: true },
  meta: { tags: ["Food"], rating: 4.5, openNow: true, couponCode: "PIZZA50" },
  source: "Dominos"
};

describe('Frontend OfferCard Tests', () => {
  test('renders offer card with title, brand, and inline elements', () => {
    render(
      <OfferCard
        offer={mockOffer}
        onDeal={() => {}}
        index={0}
        user={null}
        onSave={() => {}}
        onLogin={() => {}}
      />
    );

    // Verify title and brand name are displayed
    expect(screen.getByText("50% Off Dominos Pizza")).toBeTruthy();
    expect(screen.getByText("Dominos")).toBeTruthy();

    // Verify coupon code and source are displayed
    expect(screen.getByText("PIZZA50")).toBeTruthy();
    expect(screen.getByText("via Dominos")).toBeTruthy();
  });

  test('clicking on the card wrapper triggers onDeal', () => {
    const handleDeal = vi.fn();
    const { container } = render(
      <OfferCard
        offer={mockOffer}
        onDeal={handleDeal}
        index={0}
        user={null}
        onSave={() => {}}
        onLogin={() => {}}
      />
    );

    // Find the root card element and click it
    const card = container.querySelector('.offer-card');
    expect(card).toBeTruthy();
    fireEvent.click(card);

    expect(handleDeal).toHaveBeenCalledTimes(1);
    expect(handleDeal).toHaveBeenCalledWith(mockOffer);
  });

  test('clicking save-btn calls onSave/onLogin and stops propagation', () => {
    const handleDeal = vi.fn();
    const handleSave = vi.fn();
    const handleLogin = vi.fn();

    const mockUser = { id: 'u1', name: 'Test User', savedDeals: [] };

    const { container } = render(
      <OfferCard
        offer={mockOffer}
        onDeal={handleDeal}
        index={0}
        user={mockUser}
        onSave={handleSave}
        onLogin={handleLogin}
      />
    );

    const saveBtn = container.querySelector('.save-btn');
    expect(saveBtn).toBeTruthy();
    fireEvent.click(saveBtn);

    // onSave should be called, but handleDeal should NOT be called due to stopPropagation
    expect(handleSave).toHaveBeenCalledTimes(1);
    expect(handleSave).toHaveBeenCalledWith(mockOffer.id);
    expect(handleDeal).not.toHaveBeenCalled();
  });

  test('clicking copy button copies code and stops propagation', () => {
    const handleDeal = vi.fn();
    // Mock clipboard API
    const writeTextMock = vi.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(
      <OfferCard
        offer={mockOffer}
        onDeal={handleDeal}
        index={0}
        user={null}
        onSave={() => {}}
        onLogin={() => {}}
      />
    );

    const copyBtn = screen.getByText('Copy');
    expect(copyBtn).toBeTruthy();
    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalledWith('PIZZA50');
    expect(handleDeal).not.toHaveBeenCalled();
  });
});
