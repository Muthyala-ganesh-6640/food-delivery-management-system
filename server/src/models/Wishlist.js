const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    foods: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }],
    restaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Wishlist', wishlistSchema);
