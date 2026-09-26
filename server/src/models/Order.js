const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  specialInstructions: { type: String, default: '' },
});

const timelineSchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String, default: '' },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    deliveryPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [orderItemSchema],
    address: {
      name: String,
      phone: String,
      houseNo: String,
      street: String,
      area: String,
      city: String,
      state: String,
      pincode: String,
      landmark: String,
    },
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    coupon: {
      code: String,
      discountAmount: Number,
    },
    paymentMethod: {
      type: String,
      enum: ['RAZORPAY', 'COD'],
      default: 'COD',
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
    },
    orderStatus: {
      type: String,
      enum: [
        'PLACED',
        'CONFIRMED',
        'PREPARING',
        'READY_FOR_PICKUP',
        'PICKED_UP',
        'OUT_FOR_DELIVERY',
        'DELIVERED',
        'CANCELLED',
      ],
      default: 'PLACED',
    },
    cancellationReason: { type: String, default: '' },
    specialInstructions: { type: String, default: '' },
    timeline: [timelineSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
