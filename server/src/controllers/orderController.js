const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Restaurant = require('../models/Restaurant');
const generateOrderId = require('../utils/generateOrderId');
const { calculateOrderTotals, updateOrderStatus } = require('../services/orderService');
const { createNotification } = require('../services/notificationService');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (CUSTOMER)
const createOrder = async (req, res) => {
  const { restaurantId, items, address, paymentMethod, couponCode, specialInstructions } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'No order items provided' });
  }

  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    return res.status(404).json({ success: false, message: 'Restaurant not found' });
  }

  const { subtotal, tax, deliveryFee, discount, total, appliedCoupon } = await calculateOrderTotals(
    items,
    restaurant.deliveryFee || 40,
    couponCode
  );

  const newOrderId = generateOrderId();

  const order = await Order.create({
    orderId: newOrderId,
    customer: req.user._id,
    restaurant: restaurantId,
    items,
    address,
    subtotal,
    tax,
    deliveryFee,
    discount,
    total,
    coupon: appliedCoupon,
    paymentMethod: paymentMethod || 'COD',
    paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
    orderStatus: 'PLACED',
    specialInstructions: specialInstructions || '',
    timeline: [
      {
        status: 'PLACED',
        timestamp: new Date(),
        note: 'Order successfully placed',
      },
    ],
  });

  // Clear user's cart
  await Cart.findOneAndUpdate(
    { user: req.user._id },
    { items: [], restaurant: undefined, subtotal: 0, discount: 0 }
  );

  // Send notification to restaurant owner & customer
  await createNotification({
    userId: req.user._id,
    title: 'Order Placed!',
    message: `Your order #${order.orderId} from ${restaurant.name} has been placed.`,
    type: 'ORDER',
    link: `/orders/${order._id}`,
  });

  if (restaurant.owner) {
    await createNotification({
      userId: restaurant.owner,
      title: 'New Order Received!',
      message: `New order #${order.orderId} received for ₹${order.total}.`,
      type: 'ORDER',
      link: `/restaurant/orders`,
    });
  }

  const populatedOrder = await Order.findById(order._id)
    .populate('customer', 'name email phone')
    .populate('restaurant', 'name logo address phone');

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: populatedOrder,
  });
};

// @desc    Get order details by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('customer', 'name email phone profileImage')
    .populate('restaurant', 'name logo banner address phone rating')
    .populate('deliveryPartner', 'name phone profileImage');

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  // Authorization check
  const isCustomer = order.customer._id.toString() === req.user._id.toString();
  const isOwner = order.restaurant.owner && order.restaurant.owner.toString() === req.user._id.toString();
  const isDelivery = order.deliveryPartner && order.deliveryPartner._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'ADMIN';

  if (!isCustomer && !isOwner && !isDelivery && !isAdmin) {
    return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
  }

  res.json({ success: true, data: order });
};

// @desc    Get all orders (Filtered for Customer, Restaurant Owner, Delivery Partner, or Admin)
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
  let query = {};

  if (req.user.role === 'CUSTOMER') {
    query.customer = req.user._id;
  } else if (req.user.role === 'RESTAURANT') {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (restaurant) {
      query.restaurant = restaurant._id;
    } else {
      return res.json({ success: true, data: [] });
    }
  } else if (req.user.role === 'DELIVERY') {
    query.deliveryPartner = req.user._id;
  }

  const orders = await Order.find(query)
    .populate('customer', 'name phone')
    .populate('restaurant', 'name logo address')
    .populate('deliveryPartner', 'name phone')
    .sort({ createdAt: -1 });

  res.json({ success: true, count: orders.length, data: orders });
};

// @desc    Update order status (CONFIRMED, PREPARING, READY_FOR_PICKUP, PICKED_UP, OUT_FOR_DELIVERY, DELIVERED)
// @route   PUT /api/orders/:id/status
// @access  Private (RESTAURANT / DELIVERY / ADMIN)
const updateStatus = async (req, res) => {
  const { status, note } = req.body;

  try {
    const order = await updateOrderStatus(req.params.id, status, note);
    res.json({ success: true, message: `Order status updated to ${status}`, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Cancel order according to business rules
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  const { reason } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  // Cancel rule: customers can cancel before PREPARING status
  if (req.user.role === 'CUSTOMER') {
    if (['PREPARING', 'READY_FOR_PICKUP', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled once preparation or delivery has started',
      });
    }
  }

  order.orderStatus = 'CANCELLED';
  order.cancellationReason = reason || 'Cancelled by user';
  order.timeline.push({
    status: 'CANCELLED',
    timestamp: new Date(),
    note: order.cancellationReason,
  });

  await order.save();

  await createNotification({
    userId: order.customer,
    title: 'Order Cancelled',
    message: `Your order #${order.orderId} was cancelled.`,
    type: 'ORDER',
    link: `/orders/${order._id}`,
  });

  res.json({ success: true, message: 'Order cancelled successfully', data: order });
};

module.exports = {
  createOrder,
  getOrderById,
  getOrders,
  updateStatus,
  cancelOrder,
};
