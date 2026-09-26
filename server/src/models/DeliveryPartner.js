const mongoose = require('mongoose');

const deliveryPartnerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    vehicleType: { type: String, enum: ['Bike', 'Scooter', 'Bicycle', 'EV'], default: 'Bike' },
    vehicleNumber: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    status: { type: String, enum: ['ONLINE', 'OFFLINE', 'BUSY'], default: 'OFFLINE' },
    isApproved: { type: Boolean, default: true },
    isSuspended: { type: Boolean, default: false },
    currentOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    totalEarnings: { type: Number, default: 0 },
    rating: { type: Number, default: 4.8 },
    totalDeliveries: { type: Number, default: 0 },
    kycStatus: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED'], default: 'VERIFIED' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DeliveryPartner', deliveryPartnerSchema);
