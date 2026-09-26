const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  price: { type: Number, required: true },
  specialInstructions: { type: String, default: '' },
  selectedAddOns: [
    {
      name: String,
      price: Number,
    },
  ],
});

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    items: [cartItemSchema],
    coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
    discount: { type: Number, default: 0 },
    subtotal: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);
