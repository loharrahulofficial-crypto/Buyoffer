const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
  offerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer' },
  category: String,
  affiliateLink: String,
  affiliateNetwork: String,
  userMeta: {
    city: String,
    device: String
  },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Click', clickSchema);
