import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

import Offer from '../models/Offer.js';
import legacyOffers from '../data/seedOffers.js';

const DEFAULT_MONGODB_URI = 'mongodb://127.0.0.1:27017/lotsofoffers';

const getMongoUri = () => {
  if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('YOUR_USER')) {
    return DEFAULT_MONGODB_URI;
  }
  return process.env.MONGODB_URI;
};

const inferNetwork = (link = '') => {
  const value = link.toLowerCase();
  if (value.includes('booking.com')) return 'booking_com';
  if (value.includes('amazon.')) return 'amazon';
  if (value.includes('flipkart.')) return 'flipkart';
  if (value.includes('zomato.')) return 'zomato';
  return 'direct';
};

const getBrandName = (title = '') => title.split(' - ')[0].trim();

const toCoordinates = (coordinates) => {
  if (!coordinates || !Number.isFinite(coordinates.lat) || !Number.isFinite(coordinates.lng)) {
    return undefined;
  }

  return {
    lat: coordinates.lat,
    lng: coordinates.lng,
    type: 'Point',
    coordinates: [coordinates.lng, coordinates.lat]
  };
};

const transformOffer = (offer) => {
  const network = inferNetwork(offer.affiliateLink);
  return {
    title: offer.title,
    description: offer.description,
    category: offer.category,
    brand: {
      name: getBrandName(offer.title),
      logo: '',
      affiliateNetwork: network
    },
    pricing: {
      originalPrice: offer.originalPrice,
      discountedPrice: offer.discountedPrice,
      discountPercent: offer.discountPercent,
      currency: 'INR'
    },
    affiliate: {
      link: offer.affiliateLink,
      network,
      trackingCode: ''
    },
    location: {
      type: offer.location && offer.location.city === 'All' ? 'online' : 'both',
      cities: offer.location ? [offer.location.city] : ['All'],
      states: offer.location ? [offer.location.state] : ['All'],
      areas: offer.location ? [offer.location.area] : ['All'],
      coordinates: offer.location ? toCoordinates(offer.location.coordinates) : undefined,
      geo: offer.location && offer.location.coordinates
        ? {
            type: 'Point',
            coordinates: [offer.location.coordinates.lng, offer.location.coordinates.lat]
          }
        : undefined
    },
    validity: {
      startDate: new Date(),
      endDate: new Date(offer.expirationDate),
      isActive: true
    },
    meta: {
      tags: [offer.category, getBrandName(offer.title)].filter(Boolean),
      imageUrl: offer.imageUrl,
      featured: offer.id <= 5,
      clicks: 0
    },
    sequence: offer.id
  };
};

const seed = async () => {
  const mongoUri = getMongoUri();
  console.log(`Connecting to MongoDB at ${mongoUri}`);
  await mongoose.connect(mongoUri, { dbName: 'buyoffer', serverSelectionTimeoutMS: 5000 });
  await Offer.deleteMany({});
  await Offer.insertMany(legacyOffers.map(transformOffer));
  const count = await Offer.countDocuments();
  console.log(`Seeded ${count} offers into MongoDB.`);
  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error('Seed failed:', error.message);
  if (error.name === 'MongooseServerSelectionError' || error.message.includes('ECONNREFUSED')) {
    console.error('Start MongoDB locally or set a reachable MONGODB_URI in backend/.env, then rerun: node backend/scripts/seed.js');
  }
  await mongoose.disconnect();
  process.exit(1);
});
