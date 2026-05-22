import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import authRoutes from './routes/auth.js';
import Offer from './models/Offer.js';

const app = express();
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://lotsofoffers.in',
    'https://www.lotsofoffers.in'
  ]
}));

// ── Session & Passport ───────────────────────────────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret123',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRoutes);

const clickLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });
app.use('/api/clicks', clickLimiter);

// ── Dummy Database (Replace with MongoDB later) ──────────────────────────
const DUMMY_DEALS = [
  {
    id: "d1", title: "50% Off Dominos Pizza", description: "Get flat 50% off on all pizzas up to ₹100", category: "food",
    brand: { name: "Dominos", logo: "" }, pricing: { originalPrice: 200, discountedPrice: 100, discountPercent: 50, currency: "INR" },
    affiliate: { link: "https://dominos.co.in", network: "direct" }, location: { type: "online", cities: [], areas: [] },
    validity: { endDate: "2027-01-01", isActive: true }, meta: { tags: ["Food", "Pizza"], imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800", featured: true, rating: 4.5, openNow: true, couponCode: "PIZZA50" }, source: "Dominos"
  },
  {
    id: "d2", title: "Amazon Great Indian Festival - iPhone 15", description: "Get ₹5000 instant discount on HDFC cards", category: "shopping",
    brand: { name: "Apple", logo: "" }, pricing: { originalPrice: 79900, discountedPrice: 74900, discountPercent: 6, currency: "INR" },
    affiliate: { link: "https://amazon.in", network: "amazon" }, location: { type: "online", cities: [], areas: [] },
    validity: { endDate: "2027-01-01", isActive: true }, meta: { tags: ["Electronics", "Mobile"], imageUrl: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=800", featured: true, rating: 4.8, openNow: true, couponCode: "" }, source: "Amazon"
  },
  {
    id: "d3", title: "Swiggy Instamart ₹100 Cashback", description: "Flat ₹100 cashback on grocery orders above ₹599", category: "grocery",
    brand: { name: "Swiggy", logo: "" }, pricing: { originalPrice: 599, discountedPrice: 499, discountPercent: 16, currency: "INR" },
    affiliate: { link: "https://swiggy.com", network: "swiggy" }, location: { type: "online", cities: [], areas: [] },
    validity: { endDate: "2027-01-01", isActive: true }, meta: { tags: ["Grocery", "Delivery"], imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800", featured: false, rating: 4.2, openNow: true, couponCode: "INSTA100" }, source: "Swiggy"
  },
  {
    id: "d4", title: "Myntra End of Reason Sale", description: "Up to 80% off on top fashion brands + extra 10% on ICICI", category: "shopping",
    brand: { name: "Myntra", logo: "" }, pricing: { originalPrice: 2000, discountedPrice: 800, discountPercent: 60, currency: "INR" },
    affiliate: { link: "https://myntra.com", network: "myntra" }, location: { type: "online", cities: [], areas: [] },
    validity: { endDate: "2027-01-01", isActive: true }, meta: { tags: ["Fashion", "Clothes"], imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800", featured: true, rating: 4.6, openNow: true, couponCode: "MYNTRA10" }, source: "Myntra"
  },
  {
    id: "d5", title: "Urban Company AC Service", description: "Flat ₹150 off on AC Servicing & Repair", category: "home",
    brand: { name: "Urban Company", logo: "" }, pricing: { originalPrice: 599, discountedPrice: 449, discountPercent: 25, currency: "INR" },
    affiliate: { link: "https://urbancompany.com", network: "direct" }, location: { type: "offline", cities: ["Delhi", "Mumbai", "Bangalore"], areas: [] },
    validity: { endDate: "2027-01-01", isActive: true }, meta: { tags: ["Home", "Service"], imageUrl: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=800", featured: false, rating: 4.7, openNow: true, couponCode: "AC150" }, source: "Urban Company"
  },
  {
    id: "trip1", title: "Trip.com Hotel Deals - Up to 50% Off", description: "Get massive discounts on hotels worldwide with Trip.com's latest live offers.", category: "traveling",
    brand: { name: "Trip.com", logo: "" }, pricing: { originalPrice: 10000, discountedPrice: 5000, discountPercent: 50, currency: "INR" },
    affiliate: { link: "https://www.trip.com/sale/deals/", network: "trip_com" }, location: { type: "online", cities: [], areas: [] },
    validity: { endDate: "2027-01-01", isActive: true }, meta: { tags: ["Hotel", "Travel", "Trip.com"], imageUrl: "https://ak-d.tripcdn.com/images/05E21120008ge6b2520CE.jpg", featured: true, rating: 4.8, openNow: true, couponCode: "" }, source: "Trip.com"
  },
  {
    id: "trip2", title: "Trip.com Flight Offers - Flash Sale", description: "Find the best flight deals for your next holiday. Instant discounts available.", category: "traveling",
    brand: { name: "Trip.com", logo: "" }, pricing: { originalPrice: 15000, discountedPrice: 12000, discountPercent: 20, currency: "INR" },
    affiliate: { link: "https://www.trip.com/flights/", network: "trip_com" }, location: { type: "online", cities: [], areas: [] },
    validity: { endDate: "2027-01-01", isActive: true }, meta: { tags: ["Flight", "Travel", "Trip.com"], imageUrl: "https://ak-d.tripcdn.com/images/100d11000000qy2s6A94F_C_500_280_Q50.jpg", featured: true, rating: 4.7, openNow: true, couponCode: "TRIPFLIGHT20" }, source: "Trip.com"
  },
  {
    id: "trip3", title: "Trip.com New User Reward - 8% Off", description: "First time on Trip.com? Get an exclusive 8% discount on your first booking.", category: "traveling",
    brand: { name: "Trip.com", logo: "" }, pricing: { originalPrice: 5000, discountedPrice: 4600, discountPercent: 8, currency: "INR" },
    affiliate: { link: "https://www.trip.com/", network: "trip_com" }, location: { type: "online", cities: [], areas: [] },
    validity: { endDate: "2027-01-01", isActive: true }, meta: { tags: ["New User", "Travel", "Trip.com"], imageUrl: "https://ak-d.tripcdn.com/images/05E2t120009mngv3g6467.jpg", featured: false, rating: 4.9, openNow: true, couponCode: "NEWTRIP8" }, source: "Trip.com"
  },
  {
    id: "bkg1", title: "Booking.com - 15% Off Late Escape Deals", description: "Save 15% or more on stays worldwide with Late Escape Deals.", category: "traveling",
    brand: { name: "Booking.com", logo: "" }, pricing: { originalPrice: 0, discountedPrice: 0, discountPercent: 15, currency: "INR" },
    affiliate: { link: "https://www.booking.com/dealspage.html", network: "booking_com" }, location: { type: "online", cities: [], areas: [] },
    validity: { endDate: "2027-01-01", isActive: true }, meta: { tags: ["Hotel", "Travel", "Booking.com"], imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800", featured: true, rating: 4.8, openNow: true, couponCode: "" }, source: "Booking.com"
  },
  {
    id: "bkg2", title: "Booking.com Genius - Level 1", description: "Sign in and unlock a lifetime 10% discount on select properties.", category: "traveling",
    brand: { name: "Booking.com", logo: "" }, pricing: { originalPrice: 0, discountedPrice: 0, discountPercent: 10, currency: "INR" },
    affiliate: { link: "https://www.booking.com/genius.html", network: "booking_com" }, location: { type: "online", cities: [], areas: [] },
    validity: { endDate: "2027-01-01", isActive: true }, meta: { tags: ["Genius", "Travel", "Booking.com"], imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800", featured: true, rating: 4.9, openNow: true, couponCode: "" }, source: "Booking.com"
  },
  {
    id: "htl1", title: "Hotels.com - Member Pricing", description: "Members save 10% or more on over 100,000 hotels worldwide.", category: "traveling",
    brand: { name: "Hotels.com", logo: "" }, pricing: { originalPrice: 0, discountedPrice: 0, discountPercent: 10, currency: "INR" },
    affiliate: { link: "https://www.hotels.com/hotel-deals/", network: "direct" }, location: { type: "online", cities: [], areas: [] },
    validity: { endDate: "2027-01-01", isActive: true }, meta: { tags: ["Hotel", "Travel", "Hotels.com"], imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800", featured: true, rating: 4.7, openNow: true, couponCode: "" }, source: "Hotels.com"
  },
  {
    id: "htl2", title: "Hotels.com - Last Minute Deals", description: "Grab a last-minute hotel deal and save big on your next trip.", category: "traveling",
    brand: { name: "Hotels.com", logo: "" }, pricing: { originalPrice: 0, discountedPrice: 0, discountPercent: 20, currency: "INR" },
    affiliate: { link: "https://www.hotels.com/page/last-minute-hotel-deals/", network: "direct" }, location: { type: "online", cities: [], areas: [] },
    validity: { endDate: "2027-01-01", isActive: true }, meta: { tags: ["Hotel", "Travel", "Hotels.com"], imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800", featured: true, rating: 4.6, openNow: true, couponCode: "" }, source: "Hotels.com"
  }
];

const extraBrands = {
  traveling: [
    ['Booking.com', 'https://www.booking.com/deals.html'],
    ['MakeMyTrip.com', 'https://www.makemytrip.com/daily-deals/'],
    ['Tripadvisor.com', 'https://www.tripadvisor.com/Hotels'],
    ['Expedia.com', 'https://www.expedia.com/Deals'],
    ['Goibibo.com', 'https://www.goibibo.com/offers/'],
    ['Hotels.com', 'https://www.hotels.com/hotel-deals/'],
    ['Yatra.com', 'https://www.yatra.com/offer/dom/listing/domestic-flight-deals'],
    ['Agoda.com', 'https://www.agoda.com/deals'],
    ['Trivago.com', 'https://www.trivago.com/'],
    ['Cleartrip.com', 'https://www.cleartrip.com/offers'],
    ['Indigo.com', 'https://www.goindigo.in/offers.html'],
    ['ixigo.com', 'https://www.ixigo.com/offers'],
    ['Airbnb.com', 'https://www.airbnb.com/'],
    ['Oyo.com', 'https://www.oyorooms.com/in/offers/'],
    ['Flightradar24.com', 'https://www.flightradar24.com/'],
    ['Skyscanner.com', 'https://www.skyscanner.com/'],
    ['Redbus.com', 'https://www.redbus.in/offers'],
    ['Ola.com', 'https://www.olacabs.com/'],
    ['Uber.com', 'https://www.uber.com/in/en/'],
    ['Rapido.com', 'https://rapido.bike/']
  ],
  food: [
    ['Zomato', 'https://www.zomato.com/'],
    ['Eat24.com', 'https://www.eat24.com/'],
    ['Seamless.com', 'https://www.seamless.com/'],
    ['Amazon food.com', 'https://www.amazon.in/'],
    ['Swiggy', 'https://www.swiggy.com/'],
    ['Uber eat', 'https://www.ubereats.com/'],
    ['Foodpanda', 'https://www.foodpanda.com/'],
    ['Macnodol', 'https://www.mcdonaldsindia.com/'],
    ['Deliveroo', 'https://deliveroo.co.uk/'],
    ['La pinoz pizza', 'https://lapinozpizza.in/'],
    ['Glovo food delivery', 'https://glovoapp.com/'],
    ['Kingburgar', 'https://www.burgerking.in/'],
    ['Just eat', 'https://www.just-eat.co.uk/'],
    ['Food hub', 'https://foodhub.com/'],
    ['Bolt food', 'https://food.bolt.eu/'],
    ['Fresh manu', 'https://www.freshmenu.com/'],
    ['Doordash', 'https://www.doordash.com/'],
    ['Delivery.com', 'https://www.delivery.com/'],
    ['Caviar.com', 'https://www.trycaviar.com/'],
    ['Grubhub.com', 'https://www.grubhub.com/'],
    ['Postmates', 'https://postmates.com/'],
    ['Chownow.com', 'https://chownow.com/']
  ],
  grocery: [
    ['Blinkit', 'https://blinkit.com/'],
    ['Bigbasket', 'https://www.bigbasket.com/'],
    ['Zepto', 'https://www.zeptonow.com/'],
    ['Jiomart', 'https://www.jiomart.com/'],
    ['Damrt ready', 'https://www.dmart.in/'],
    ['Instamart', 'https://www.swiggy.com/instamart'],
    ['Dealshare', 'https://www.dealshare.in/'],
    ['Amazon fresh', 'https://www.amazon.in/alm/storefront'],
    ['Flipkart grocery', 'https://www.flipkart.com/grocery-supermart-store'],
    ['Nature\'s basket', 'https://www.naturesbasket.co.in/'],
    ['Milk basket', 'https://www.milkbasket.com/'],
    ['Walmart', 'https://www.walmart.com/'],
    ['Wholefoods', 'https://www.wholefoodsmarket.com/'],
    ['Kroger', 'https://www.kroger.com/'],
    ['Instacart', 'https://www.instacart.com/'],
    ['ALDI.com', 'https://www.aldi.us/'],
    ['Misfits Market', 'https://www.misfitsmarket.com/'],
    ['Azure Standard', 'https://www.azurestandard.com/'],
    ['Vitacost', 'https://www.vitacost.com/'],
    ['Gopuff', 'https://gopuff.com/'],
    ['Boxed', 'https://www.boxed.com/'],
    ['Hungryroot', 'https://www.hungryroot.com/'],
    ['Fresh direct', 'https://www.freshdirect.com/'],
    ['Shipt', 'https://www.shipt.com/'],
    ['Thrivemarket', 'https://thrivemarket.com/']
  ]
};

const categoryImages = {
  traveling: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800'
  ],
  food: [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800'
  ],
  grocery: [
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=800'
  ]
};

Object.entries(extraBrands).forEach(([category, brands]) => {
  brands.forEach(([name, link], idx) => {
    // Avoid duplicates if already present
    if (!DUMMY_DEALS.some(d => d.source === name || d.brand.name === name)) {
      const imgList = categoryImages[category] || categoryImages.grocery;
      const imageUrl = imgList[idx % imgList.length];

      DUMMY_DEALS.push({
        id: `${category}_${idx}`,
        title: `${name} Live Deals & Offers`,
        description: `Access real-time, live deals directly on ${name}. Click to be redirected to their exact offers page.`,
        category,
        brand: { name, logo: "" },
        pricing: { originalPrice: 0, discountedPrice: 0, discountPercent: Math.floor(Math.random() * 50) + 10, currency: "INR" },
        affiliate: { link, network: "direct" },
        location: { type: "online", cities: [], areas: [] },
        validity: { endDate: "2027-01-01", isActive: true },
        meta: { tags: [category, name, "live"], imageUrl, featured: true, rating: 4.8, openNow: true, couponCode: "" },
        source: name
      });
    }
  });
});

async function databaseSearch({ query, category, city, state, area, lat, lng, radius }) {
  const isDbConnected = mongoose.connection.readyState === 1;

  if (isDbConnected) {
    try {
      let filter = {};

      if (category && category !== 'all') {
        filter.category = category;
      }

      if (state) {
        filter['location.states'] = state;
      }
      if (city) {
        filter['location.cities'] = city;
      }
      if (area) {
        filter['location.areas'] = area;
      }

      if (query) {
        filter.$or = [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ];
      }

      if (lat && lng) {
        const rad = parseFloat(radius) || 5;
        filter['location.geo'] = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            $maxDistance: rad * 1000
          }
        };
      }

      let queryBuilder = Offer.find(filter).sort({ sequence: 1 });
      let offers = await queryBuilder.lean();

      // Map _id to id for frontend compatibility
      offers = offers.map(o => ({
        ...o,
        id: o._id.toString()
      }));

      return {
        offers,
        totalFound: offers.length,
        searchContext: "Database Search Results"
      };

    } catch (err) {
      console.error("MongoDB search failed, falling back to dummy deals:", err.message);
    }
  }

  // Simple in-memory filter
  let results = DUMMY_DEALS;
  
  if (category && category !== 'all') {
    results = results.filter(d => d.category === category);
  }
  
  if (query) {
    const q = query.toLowerCase();
    results = results.filter(d => d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q));
  }
  
  return {
    offers: results,
    totalFound: results.length,
    searchContext: "Database Search Results"
  };
}

// ── Click tracker (in-memory, swap for DB later) ───────────────────────────
const clicks = [];

// ── Native Booking.com Integration ─────────────────────────────────────────
async function fetchBookingCom(city, state) {
  const apiKey = process.env.BOOKING_COM_API_KEY;
  const aid = process.env.BOOKING_COM_AFFILIATE_ID || '123456';
  
  // Skip if not configured or no location provided
  if (!apiKey || apiKey === 'YOUR_BOOKING_API_KEY_HERE' || !city) return [];

  try {
    console.log(`Fetching Native Booking.com deals for: ${city}`);
    
    // 1. Get Destination ID for the City
    const locRes = await fetch(`https://booking-com.p.rapidapi.com/v1/hotels/locations?name=${encodeURIComponent(city)}&locale=en-gb`, {
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'booking-com.p.rapidapi.com'
      }
    });
    const locData = await locRes.json();
    const destId = locData[0]?.dest_id;
    
    if (!destId) return [];

    // 2. Fetch Hotels for a 1-night stay starting tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextDay = new Date(tomorrow);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const checkin = tomorrow.toISOString().split('T')[0];
    const checkout = nextDay.toISOString().split('T')[0];

    const hotelRes = await fetch(`https://booking-com.p.rapidapi.com/v1/hotels/search?dest_id=${destId}&dest_type=city&checkin_date=${checkin}&checkout_date=${checkout}&room_number=1&adults_number=2&order_by=popularity&filter_by_currency=INR&locale=en-gb`, {
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'booking-com.p.rapidapi.com'
      }
    });
    
    const hotelData = await hotelRes.json();
    const results = hotelData.result || [];

    // Map to our exact OfferCard JSON schema so the frontend can't tell the difference
    return results.slice(0, 8).map(h => ({
      id: `bkg_${h.hotel_id}`,
      title: h.hotel_name,
      description: `Stay at ${h.hotel_name}. Review score: ${h.review_score} (${h.review_score_word}) based on ${h.review_nr} reviews.`,
      category: 'traveling',
      brand: { name: 'Booking.com', logo: '' },
      pricing: {
        originalPrice: h.strikethrough_price || h.min_total_price,
        discountedPrice: h.min_total_price,
        discountPercent: h.strikethrough_price ? Math.round(((h.strikethrough_price - h.min_total_price) / h.strikethrough_price) * 100) : 0,
        currency: 'INR'
      },
      affiliate: {
        link: `${h.url}&aid=${aid}`,
        network: 'booking_com'
      },
      location: { type: 'offline', cities: [city, state].filter(Boolean), areas: [h.district].filter(Boolean) },
      validity: { endDate: checkout, isActive: true },
      meta: { tags: ['Hotel', 'Stay'], imageUrl: h.max_photo_url, featured: h.is_genius_deal || false, rating: h.review_score, openNow: true, couponCode: '' },
      source: 'Booking.com (Native API)'
    }));

  } catch (err) {
    console.error('Booking.com Native API Error:', err.message);
    return [];
  }
}

// ── Routes ─────────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Lots of Offers API', mode: 'database-native' });
});

// Main search
app.get('/api/offers', async (req, res) => {
  const { category, city, state, area, q, lat, lng, radius } = req.query;
  try {
    const [result, bookingDeals] = await Promise.all([
      databaseSearch({ query: q || '', category, city, state, area, lat, lng, radius }),
      (category === 'traveling' || category === 'all' || category === undefined) ? fetchBookingCom(city, state) : Promise.resolve([])
    ]);

    if (bookingDeals.length > 0) {
      result.offers = [...bookingDeals, ...result.offers];
      result.totalFound = result.offers.length;
      result.searchContext += ' (+ Live Booking.com Deals)';
    }

    res.json(result);
  } catch (err) {
    console.error('AI search error:', err.message);
    res.status(500).json({ error: err.message, offers: [] });
  }
});

// Smart text search
app.get('/api/offers/search', async (req, res) => {
  const { q, category, city, state, area, lat, lng } = req.query;
  try {
    const [result, bookingDeals] = await Promise.all([
      databaseSearch({ query: q, category, city, state, area, lat, lng }),
      (category === 'traveling' || category === 'all' || category === undefined) ? fetchBookingCom(city, state) : Promise.resolve([])
    ]);

    if (bookingDeals.length > 0) {
      result.offers = [...bookingDeals, ...result.offers];
      result.totalFound = result.offers.length;
      result.searchContext += ' (+ Live Booking.com Deals)';
    }

    res.json(result);
  } catch (err) {
    console.error('Search error:', err.message);
    res.status(500).json({ error: err.message, offers: [] });
  }
});

// Near Me
app.get('/api/offers/nearby', async (req, res) => {
  const { lat, lng, radius = 5, category } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: 'lat and lng required' });
  try {
    const result = await databaseSearch({ query: 'nearby deals', category, lat, lng, radius });
    res.json(result);
  } catch (err) {
    console.error('Nearby error:', err.message);
    res.status(500).json({ error: err.message, offers: [] });
  }
});

// Click tracking
app.post('/api/clicks', async (req, res) => {
  const { offerId, category, affiliateLink } = req.body;
  
  let finalRedirect = affiliateLink;

  if (affiliateLink) {
    try {
      // 1. Quick HEAD check with a 2-second timeout
      const response = await fetch(affiliateLink, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        signal: AbortSignal.timeout(2000)
      });

      if (response.status === 404) {
        const urlObj = new URL(affiliateLink);
        finalRedirect = urlObj.origin;
        console.log(`[Redirect] 404 HEAD detected for ${affiliateLink}. Resolving to homepage: ${finalRedirect}`);
      } else if (response.status !== 200 && response.status !== 301 && response.status !== 302 && response.status !== 307 && response.status !== 308) {
        throw new Error(`HEAD returned non-standard status: ${response.status}`);
      }
    } catch (err) {
      // 2. Fallback to GET request if HEAD is blocked or fails
      try {
        const response = await fetch(affiliateLink, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          },
          signal: AbortSignal.timeout(2000)
        });

        if (response.status === 404) {
          const urlObj = new URL(affiliateLink);
          finalRedirect = urlObj.origin;
          console.log(`[Redirect] 404 GET detected for ${affiliateLink}. Resolving to homepage: ${finalRedirect}`);
        }
      } catch (getErr) {
        // If it fails or times out, safely fall back to original link to avoid false positives
        console.log(`[Redirect] Status check failed for ${affiliateLink}: ${getErr.message}. Keeping original link.`);
      }
    }
  }

  clicks.push({ offerId, category, affiliateLink, timestamp: new Date() });
  res.json({ success: true, redirect: finalRedirect });
});

// Indian locations data
app.get('/api/locations', (req, res) => {
  res.json({
    states: [
      { 
        name: 'Maharashtra', 
        cities: [
          { name: 'Mumbai', areas: ['Bandra', 'Andheri', 'Juhu', 'Colaba', 'Borivali', 'Powai', 'Malad', 'Goregaon', 'Dadar'] },
          { name: 'Pune', areas: ['Koregaon Park', 'Viman Nagar', 'Kalyani Nagar', 'Hinjewadi', 'Baner', 'Kothrud', 'Wakad'] },
          { name: 'Nagpur', areas: ['Dharampeth', 'Sitabuldi', 'Sadar', 'Mahal', 'Wardhaman Nagar'] },
          { name: 'Nashik', areas: ['Panchavati', 'Indira Nagar', 'College Road', 'Gangapur Road'] },
          { name: 'Aurangabad', areas: ['CIDCO', 'Cidco', 'Nirala Bazar', 'Cannought Place'] }
        ] 
      },
      { 
        name: 'Delhi', 
        cities: [
          { name: 'New Delhi', areas: ['Connaught Place', 'Hauz Khas', 'Saket', 'Vasant Kunj', 'Dwarka', 'Lajpat Nagar', 'Karol Bagh', 'Rohini', 'Janakpuri'] },
          { name: 'Noida', areas: ['Sector 18', 'Sector 62', 'Sector 15', 'Sector 137', 'Greater Noida'] },
          { name: 'Gurgaon', areas: ['Cyber Hub', 'MG Road', 'Sector 29', 'Sohna Road', 'Golf Course Road'] },
          { name: 'Faridabad', areas: ['Sector 15', 'NIT', 'Sector 21', 'Green Field Colony'] },
          { name: 'Ghaziabad', areas: ['Indirapuram', 'Vaishali', 'Raj Nagar Extension', 'Vasundhara'] }
        ] 
      },
      { 
        name: 'Karnataka', 
        cities: [
          { name: 'Bengaluru', areas: ['Koramangala', 'Indiranagar', 'Whitefield', 'Jayanagar', 'HSR Layout', 'Malleshwaram', 'JP Nagar', 'Electronic City'] },
          { name: 'Mysuru', areas: ['Gokulam', 'Vijayanagar', 'Jayalakshmipuram', 'Kuvempunagar'] },
          { name: 'Mangaluru', areas: ['Kodialbail', 'Kadri', 'Bejai', 'Falnir'] },
          { name: 'Hubli', areas: ['Vidya Nagar', 'Shirur Park', 'Navanagar'] },
          { name: 'Belagavi', areas: ['Tilakwadi', 'Camp', 'Hindwadi'] }
        ] 
      },
      { 
        name: 'Tamil Nadu', 
        cities: [
          { name: 'Chennai', areas: ['T. Nagar', 'Adyar', 'Velachery', 'Anna Nagar', 'Nungambakkam', 'OMR', 'Alwarpet'] },
          { name: 'Coimbatore', areas: ['RS Puram', 'Peelamedu', 'Gandhipuram', 'Saibaba Colony'] },
          { name: 'Madurai', areas: ['Anna Nagar', 'KK Nagar', 'SS Colony', 'TVS Nagar'] },
          { name: 'Tiruchirappalli', areas: ['Thillai Nagar', 'Cantonment', 'Srirangam'] }
        ] 
      },
      { 
        name: 'Telangana', 
        cities: [
          { name: 'Hyderabad', areas: ['Banjara Hills', 'Jubilee Hills', 'Hi-Tech City', 'Gachibowli', 'Madhapur', 'Kukatpally', 'Secunderabad', 'Begumpet'] },
          { name: 'Warangal', areas: ['Hanamkonda', 'Kazipet', 'Subedari'] }
        ] 
      },
      { 
        name: 'Gujarat', 
        cities: [
          { name: 'Ahmedabad', areas: ['Vastrapur', 'SG Highway', 'Navrangpura', 'Satellite', 'Bopal', 'Prahlad Nagar'] },
          { name: 'Surat', areas: ['Vesu', 'Adajan', 'Piplod', 'Varachha', 'City Light'] },
          { name: 'Vadodara', areas: ['Alkapuri', 'Akota', 'Sayajigunj', 'Karelibaug'] },
          { name: 'Rajkot', areas: ['Kalawad Road', 'University Road', 'Amin Marg'] }
        ] 
      },
      { 
        name: 'Rajasthan', 
        cities: [
          { name: 'Jaipur', areas: ['Malviya Nagar', 'Vaishali Nagar', 'C-Scheme', 'Mansarovar', 'Bapu Nagar', 'Raja Park'] },
          { name: 'Jodhpur', areas: ['Sardarpura', 'Shastri Nagar', 'Chopasni Housing Board'] },
          { name: 'Udaipur', areas: ['Fateh Sagar', 'Hiran Magri', 'Panchwati'] }
        ] 
      },
      { 
        name: 'West Bengal', 
        cities: [
          { name: 'Kolkata', areas: ['Park Street', 'Salt Lake', 'New Town', 'Ballygunge', 'South City', 'Gariahat', 'Dum Dum'] },
          { name: 'Howrah', areas: ['Shibpur', 'Liluah', 'Bally'] }
        ] 
      },
      { 
        name: 'Uttar Pradesh', 
        cities: [
          { name: 'Lucknow', areas: ['Gomti Nagar', 'Hazratganj', 'Aliganj', 'Indira Nagar', 'Mahanagar'] },
          { name: 'Kanpur', areas: ['Swaroop Nagar', 'Kakadeo', 'Civil Lines', 'Kidwai Nagar'] },
          { name: 'Agra', areas: ['Tajganj', 'Sanjay Place', 'Kamla Nagar', 'DayalBagh'] }
        ] 
      },
      { 
        name: 'Punjab', 
        cities: [
          { name: 'Chandigarh', areas: ['Sector 17', 'Sector 22', 'Sector 35', 'Sector 9', 'Elante'] },
          { name: 'Ludhiana', areas: ['Sarabha Nagar', 'Model Town', 'Civil Lines', 'BRS Nagar'] },
          { name: 'Amritsar', areas: ['Ranjit Avenue', 'Lawrence Road', 'Mall Road'] }
        ] 
      },
      { 
        name: 'Kerala', 
        cities: [
          { name: 'Kochi', areas: ['Edappally', 'Kakkanad', 'Panampilly Nagar', 'MG Road', 'Fort Kochi'] },
          { name: 'Thiruvananthapuram', areas: ['Kowdiar', 'Sasthamangalam', 'Kazhakkoottam', 'Pattom'] }
        ] 
      }
    ]
  });
});

// ── MongoDB Connection & Server Start ───────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;

// Always start the HTTP server so deal search routes work even without DB
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

if (MONGO_URI) {
  mongoose
    .connect(MONGO_URI, {
      dbName: 'buyoffer',
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
    })
    .then(() => console.log('✅ MongoDB connected — auth & save-deal features active'))
    .catch(err => {
      console.error('❌ MongoDB connection failed:', err.message);
      console.error('   → Fix: Go to MongoDB Atlas > Network Access > Add 0.0.0.0/0');
      console.error('   → Fix: Make sure your cluster is not paused on Atlas dashboard');
      console.error('   → Server is still running — deal search works, auth disabled');
    });
} else {
  console.warn('⚠️  MONGODB_URI not set — auth features disabled');
}

