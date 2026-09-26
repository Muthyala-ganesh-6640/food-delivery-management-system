const DeliveryPartner = require('../models/DeliveryPartner');
const Order = require('../models/Order');
const { updateOrderStatus } = require('../services/orderService');

// @desc    Get delivery partner profile
// @route   GET /api/delivery/profile
// @access  Private (DELIVERY)
const getDeliveryProfile = async (req, res) => {
  let partner = await DeliveryPartner.findOne({ user: req.user._id }).populate('user', 'name email phone profileImage');

  if (!partner) {
    partner = await DeliveryPartner.create({
      user: req.user._id,
      vehicleType: 'Bike',
      vehicleNumber: 'DL-01-EX-1234',
      licenseNumber: 'LIC-987654321',
      status: 'ONLINE',
    });
    partner = await DeliveryPartner.findById(partner._id).populate('user', 'name email phone profileImage');
  }

  res.json({ success: true, data: partner });
};

// @desc    Update online/offline status
// @route   PUT /api/delivery/status
// @access  Private (DELIVERY)
const updateDeliveryStatus = async (req, res) => {
  const { status } = req.body;
  const partner = await DeliveryPartner.findOne({ user: req.user._id });

  if (!partner) {
    return res.status(404).json({ success: false, message: 'Delivery partner profile not found' });
  }

  partner.status = status;
  await partner.save();

  res.json({ success: true, message: `Status updated to ${status}`, data: partner });
};

// @desc    Get available orders ready for pickup
// @route   GET /api/delivery/orders/available
// @access  Private (DELIVERY)
const getAvailableOrders = async (req, res) => {
  const orders = await Order.find({
    orderStatus: { $in: ['CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP'] },
    deliveryPartner: { $exists: false },
  })
    .populate('restaurant', 'name address phone logo')
    .populate('customer', 'name phone')
    .sort({ createdAt: -1 });

  res.json({ success: true, count: orders.length, data: orders });
};

// @desc    Accept delivery order
// @route   PUT /api/delivery/orders/:id/accept
// @access  Private (DELIVERY)
const acceptDeliveryOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  if (order.deliveryPartner) {
    return res.status(400).json({ success: false, message: 'Order already assigned to another delivery partner' });
  }

  order.deliveryPartner = req.user._id;
  await order.save();

  await DeliveryPartner.findOneAndUpdate({ user: req.user._id }, { currentOrder: order._id, status: 'BUSY' });

  await updateOrderStatus(order._id, order.orderStatus, `Delivery partner assigned: ${req.user.name}`);

  const populatedOrder = await Order.findById(order._id)
    .populate('customer', 'name phone')
    .populate('restaurant', 'name address phone logo');

  res.json({ success: true, message: 'Delivery accepted', data: populatedOrder });
};

// @desc    Get delivery earnings & stats
// @route   GET /api/delivery/earnings
// @access  Private (DELIVERY)
const getDeliveryEarnings = async (req, res) => {
  const partner = await DeliveryPartner.findOne({ user: req.user._id });
  const completedOrders = await Order.find({
    deliveryPartner: req.user._id,
    orderStatus: 'DELIVERED',
  }).sort({ updatedAt: -1 });

  const totalEarnings = completedOrders.length * 50; // Flat ₹50 per delivery + tip
  const totalDeliveries = completedOrders.length;

  res.json({
    success: true,
    data: {
      totalEarnings,
      totalDeliveries,
      rating: partner ? partner.rating : 4.8,
      completedOrders,
    },
  });
};

module.exports = {
  getDeliveryProfile,
  updateDeliveryStatus,
  getAvailableOrders,
  acceptDeliveryOrder,
  getDeliveryEarnings,
};
