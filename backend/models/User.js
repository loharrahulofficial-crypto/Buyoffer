import mongoose from 'mongoose';
import './Offer.js';

const userSchema = new mongoose.Schema({
  googleId: String,
  name: String,
  email: String,
  avatar: String,
  savedDeals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Offer' }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);