const Order = require('../models/Order');
const Payment = require('../models/Payment');
const { createRazorpayOrder, verifyRazorpaySignature } = require('../services/paymentService');
const { updateOrderStatus } = require('../services/orderService');

// @desc    Create Razorpay Payment Order
// @route   POST /api/payment/create
// @access  Private
const createPaymentOrder = async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  const razorpayOrder = await createRazorpayOrder(order.total, `rcpt_${order.orderId}`);

  await Payment.create({
    order: order._id,
    user: req.user._id,
    razorpayOrderId: razorpayOrder.id,
    amount: order.total,
    status: 'CREATED',
  });

  res.json({
    success: true,
    data: {
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency || 'INR',
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_foodexpress123',
    },
  });
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = async (req, res) => {
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  const isValid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

  if (!isValid) {
    await Payment.findOneAndUpdate(
      { razorpayOrderId },
      { status: 'FAILED' }
    );
    return res.status(400).json({ success: false, message: 'Invalid payment signature' });
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  order.paymentStatus = 'COMPLETED';
  order.paymentMethod = 'RAZORPAY';
  order.orderStatus = 'CONFIRMED';
  order.timeline.push({
    status: 'CONFIRMED',
    timestamp: new Date(),
    note: `Online payment verified (${razorpayPaymentId})`,
  });

  await order.save();

  await Payment.findOneAndUpdate(
    { razorpayOrderId },
    {
      razorpayPaymentId,
      razorpaySignature,
      status: 'SUCCESS',
    }
  );

  res.json({
    success: true,
    message: 'Payment verified and order confirmed',
    data: order,
  });
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
};
