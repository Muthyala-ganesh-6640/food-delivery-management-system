const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const { getIO } = require('../socket/socket');
const { createNotification } = require('./notificationService');

const calculateOrderTotals = async (items, deliveryFee = 40, couponCode = null) => {
  let subtotal = 0;
  for (const item of items) {
    subtotal += item.price * item.quantity;
  }

  const tax = Math.round(subtotal * 0.05); // 5% GST tax
  let discount = 0;
  let appliedCoupon = null;

  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
    if (coupon && new Date() < new Date(coupon.expiryDate) && subtotal >= coupon.minOrderValue) {
      if (coupon.discountType === 'PERCENTAGE') {
        discount = Math.min((subtotal * coupon.discountAmount) / 100, coupon.maxDiscount || 500);
      } else {
        discount = coupon.discountAmount;
      }
      appliedCoupon = { code: coupon.code, discountAmount: discount };
    }
  }

  const total = Math.max(0, subtotal + tax + deliveryFee - discount);

  return {
    subtotal,
    tax,
    deliveryFee,
    discount,
    total,
    appliedCoupon,
  };
};

const updateOrderStatus = async (orderId, newStatus, note = '') => {
  const order = await Order.findById(orderId).populate('customer restaurant deliveryPartner');
  if (!order) throw new Error('Order not found');

  order.orderStatus = newStatus;
  order.timeline.push({
    status: newStatus,
    timestamp: new Date(),
    note: note || `Order status updated to ${newStatus}`,
  });

  await order.save();

  const io = getIO();
  if (io) {
    // Emit to order room & specific user rooms
    io.to(`order_${order._id}`).emit('order_status_updated', order);
    if (order.customer) {
      io.to(order.customer._id.toString()).emit('order_status_updated', order);
      await createNotification({
        userId: order.customer._id,
        title: `Order Update: ${newStatus}`,
        message: `Your order #${order.orderId} status is now: ${newStatus.replace(/_/g, ' ')}`,
        type: 'ORDER',
        link: `/orders/${order._id}`,
      });
    }
    if (order.restaurant && order.restaurant.owner) {
      io.to(order.restaurant.owner.toString()).emit('restaurant_order_updated', order);
    }
    if (order.deliveryPartner) {
      io.to(order.deliveryPartner._id.toString()).emit('delivery_order_updated', order);
    }
  }

  return order;
};

module.exports = {
  calculateOrderTotals,
  updateOrderStatus,
};
