const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 }, // Discount in percentage
    finalPrice: { type: Number },
    isVeg: { type: Boolean, default: true },
    rating: { type: Number, default: 4.5 },
    numReviews: { type: Number, default: 0 },
    preparationTime: { type: String, default: '15-20 min' },
    isAvailable: { type: Boolean, default: true },
    addOns: [
      {
        name: String,
        price: Number,
      },
    ],
  },
  { timestamps: true }
);

foodSchema.pre('save', function (next) {
  if (this.discount > 0) {
    this.finalPrice = Math.round(this.price - (this.price * this.discount) / 100);
  } else {
    this.finalPrice = this.price;
  }
  next();
});

module.exports = mongoose.model('Food', foodSchema);
