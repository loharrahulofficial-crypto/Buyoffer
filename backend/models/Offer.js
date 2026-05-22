import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    category: { type: String, enum: ['home', 'traveling', 'food', 'grocery', 'shopping'] },
    brand: {
      name: String,
      logo: String,
      affiliateNetwork: String
    },
    pricing: {
      originalPrice: Number,
      discountedPrice: Number,
      discountPercent: Number,
      currency: { type: String, default: 'INR' }
    },
    affiliate: {
      link: String,
      network: String,
      trackingCode: String
    },
    location: {
      type: { type: String, enum: ['online', 'offline', 'both'], default: 'online' },
      cities: [String],
      states: [String],
      areas: [String],
      coordinates: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: undefined },
        lat: Number,
        lng: Number
      },
      geo: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: undefined }
      }
    },
    validity: {
      startDate: Date,
      endDate: Date,
      isActive: { type: Boolean, default: true }
    },
    meta: {
      tags: [String],
      imageUrl: String,
      featured: { type: Boolean, default: false },
      clicks: { type: Number, default: 0 }
    },
    sequence: { type: Number, default: 0 }
  },
  { timestamps: true }
);

offerSchema.pre('validate', function setGeoPoint() {
  const coords = this.location && this.location.coordinates;
  if (coords && Number.isFinite(coords.lat) && Number.isFinite(coords.lng)) {
    coords.type = 'Point';
    coords.coordinates = [coords.lng, coords.lat];
    this.location.geo = {
      type: 'Point',
      coordinates: [coords.lng, coords.lat]
    };
  }
});

offerSchema.index({ category: 1 });
offerSchema.index({ 'validity.isActive': 1 });
offerSchema.index({ 'validity.endDate': 1 });
offerSchema.index({ 'location.coordinates': '2dsphere' });
offerSchema.index({ 'location.geo': '2dsphere' });
offerSchema.index({ '$**': 'text' });

export default mongoose.model('Offer', offerSchema);
