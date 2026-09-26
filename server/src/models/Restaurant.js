const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    logo: {
      type: String,
      default: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
    },
    banner: {
      type: String,
      default: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    },
    cuisine: [{ type: String }],
    address: {
      street: { type: String, required: true },
      area: { type: String, default: '' },
      city: { type: String, required: true },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
      landmark: { type: String, default: '' },
    },
    location: {
      lat: { type: Number, default: 28.6139 },
      lng: { type: Number, default: 77.209 },
    },
    rating: { type: Number, default: 4.5 },
    numReviews: { type: Number, default: 0 },
    deliveryTime: { type: String, default: '25-35 min' },
    deliveryFee: { type: Number, default: 40 },
    minimumOrder: { type: Number, default: 150 },
    isOpen: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: true },
    isSuspended: { type: Boolean, default: false },
    openingTime: { type: String, default: '09:00 AM' },
    closingTime: { type: String, default: '11:00 PM' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
