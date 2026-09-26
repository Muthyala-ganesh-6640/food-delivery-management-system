const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const DeliveryPartner = require('../models/DeliveryPartner');
const Food = require('../models/Food');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/dashboard
// @access  Private (ADMIN)
const getAdminDashboard = async (req, res) => {
  const totalUsers = await User.countDocuments({ role: 'CUSTOMER' });
  const totalRestaurants = await Restaurant.countDocuments();
  const totalDeliveryPartners = await DeliveryPartner.countDocuments();
  const totalOrders = await Order.countDocuments();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayOrders = await Order.countDocuments({ createdAt: { $gte: today } });
  const pendingOrders = await Order.countDocuments({ orderStatus: { $in: ['PLACED', 'CONFIRMED', 'PREPARING'] } });
  const cancelledOrders = await Order.countDocuments({ orderStatus: 'CANCELLED' });
  const activeDeliveryPartners = await DeliveryPartner.countDocuments({ status: 'ONLINE' });

  const deliveredOrders = await Order.find({ orderStatus: 'DELIVERED' });
  const totalRevenue = deliveredOrders.reduce((acc, order) => acc + order.total, 0);

  // Recent 5 orders
  const recentOrders = await Order.find()
    .populate('customer', 'name email')
    .populate('restaurant', 'name')
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    success: true,
    data: {
      totalUsers,
      totalRestaurants,
      totalDeliveryPartners,
      totalOrders,
      todayOrders,
      totalRevenue,
      pendingOrders,
      cancelledOrders,
      activeDeliveryPartners,
      recentOrders,
    },
  });
};

// @desc    Get all users with search
// @route   GET /api/admin/users
// @access  Private (ADMIN)
const getUsers = async (req, res) => {
  const { role, search } = req.query;
  let query = {};
  if (role) query.role = role;
  if (search) {
    query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
  }

  const users = await User.find(query).select('-password').sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, data: users });
};

// @desc    Block or Unblock User
// @route   PUT /api/admin/users/:id/block
// @access  Private (ADMIN)
const toggleBlockUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  user.isBlocked = !user.isBlocked;
  await user.save();

  res.json({
    success: true,
    message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
    data: user,
  });
};

// @desc    Approve/Reject Restaurant
// @route   PUT /api/admin/restaurants/:id/approve
// @access  Private (ADMIN)
const approveRestaurant = async (req, res) => {
  const { isApproved } = req.body;
  const restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    { isApproved: isApproved !== undefined ? isApproved : true },
    { new: true }
  );

  res.json({ success: true, message: 'Restaurant approval status updated', data: restaurant });
};

// @desc    Suspend/Activate Restaurant
// @route   PUT /api/admin/restaurants/:id/suspend
// @access  Private (ADMIN)
const suspendRestaurant = async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    return res.status(404).json({ success: false, message: 'Restaurant not found' });
  }

  restaurant.isSuspended = !restaurant.isSuspended;
  await restaurant.save();

  res.json({
    success: true,
    message: `Restaurant ${restaurant.isSuspended ? 'suspended' : 'activated'}`,
    data: restaurant,
  });
};

// @desc    Get all delivery partners
// @route   GET /api/admin/delivery-partners
// @access  Private (ADMIN)
const getAdminDeliveryPartners = async (req, res) => {
  const partners = await DeliveryPartner.find().populate('user', 'name email phone profileImage');
  res.json({ success: true, count: partners.length, data: partners });
};

// @desc    Approve delivery partner KYC
// @route   PUT /api/admin/delivery-partners/:id/approve
// @access  Private (ADMIN)
const approveDeliveryPartner = async (req, res) => {
  const partner = await DeliveryPartner.findByIdAndUpdate(
    req.params.id,
    { isApproved: true, kycStatus: 'VERIFIED' },
    { new: true }
  ).populate('user', 'name email');

  res.json({ success: true, message: 'Delivery partner approved', data: partner });
};

// @desc    Get Sales & Analytics Reports
// @route   GET /api/admin/reports
// @access  Private (ADMIN)
const getAdminReports = async (req, res) => {
  const orders = await Order.find({ orderStatus: 'DELIVERED' });

  // Monthly Sales Aggregation
  const monthlySalesMap = {};
  orders.forEach((o) => {
    const month = new Date(o.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
    monthlySalesMap[month] = (monthlySalesMap[month] || 0) + o.total;
  });

  const monthlySales = Object.keys(monthlySalesMap).map((key) => ({
    month: key,
    revenue: monthlySalesMap[key],
  }));

  const topRestaurants = await Restaurant.find().sort({ rating: -1 }).limit(5);

  res.json({
    success: true,
    data: {
      monthlySales,
      topRestaurants,
      totalOrdersDelivered: orders.length,
    },
  });
};

module.exports = {
  getAdminDashboard,
  getUsers,
  toggleBlockUser,
  approveRestaurant,
  suspendRestaurant,
  getAdminDeliveryPartners,
  approveDeliveryPartner,
  getAdminReports,
};
