const Restaurant = require('../models/Restaurant');
const Food = require('../models/Food');
const Order = require('../models/Order');

// @desc    Get all restaurants with search, filter, sort
// @route   GET /api/restaurants
// @access  Public
const getRestaurants = async (req, res) => {
  const { search, cuisine, rating, veg, sortBy, page = 1, limit = 12 } = req.query;

  let query = { isApproved: true, isSuspended: false };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { cuisine: { $in: [new RegExp(search, 'i')] } },
      { 'address.area': { $regex: search, $options: 'i' } },
      { 'address.city': { $regex: search, $options: 'i' } },
    ];
  }

  if (cuisine) {
    const cuisineList = cuisine.split(',');
    query.cuisine = { $in: cuisineList.map((c) => new RegExp(c, 'i')) };
  }

  if (rating) {
    query.rating = { $gte: Number(rating) };
  }

  let sort = { rating: -1 };
  if (sortBy === 'deliveryTime') sort = { deliveryTime: 1 };
  if (sortBy === 'minimumOrder') sort = { minimumOrder: 1 };
  if (sortBy === 'newest') sort = { createdAt: -1 };

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Restaurant.countDocuments(query);
  const restaurants = await Restaurant.find(query).sort(sort).skip(skip).limit(Number(limit));

  res.json({
    success: true,
    count: restaurants.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data: restaurants,
  });
};

// @desc    Get restaurant details by ID along with its foods
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurantById = async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id).populate('owner', 'name email phone');

  if (!restaurant) {
    return res.status(404).json({ success: false, message: 'Restaurant not found' });
  }

  const foods = await Food.find({ restaurant: restaurant._id, isAvailable: true });

  res.json({
    success: true,
    data: {
      ...restaurant.toObject(),
      foods,
    },
  });
};

// @desc    Create new restaurant (Owner/Admin)
// @route   POST /api/restaurants
// @access  Private (RESTAURANT / ADMIN)
const createRestaurant = async (req, res) => {
  const existing = await Restaurant.findOne({ owner: req.user._id });
  if (existing && req.user.role !== 'ADMIN') {
    return res.status(400).json({ success: false, message: 'You already registered a restaurant' });
  }

  const restaurant = await Restaurant.create({
    owner: req.user._id,
    ...req.body,
  });

  res.status(201).json({ success: true, message: 'Restaurant created successfully', data: restaurant });
};

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
// @access  Private (RESTAURANT owner / ADMIN)
const updateRestaurant = async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    return res.status(404).json({ success: false, message: 'Restaurant not found' });
  }

  if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Not authorized to update this restaurant' });
  }

  Object.assign(restaurant, req.body);
  await restaurant.save();

  res.json({ success: true, message: 'Restaurant updated successfully', data: restaurant });
};

// @desc    Delete restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private (ADMIN / Owner)
const deleteRestaurant = async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    return res.status(404).json({ success: false, message: 'Restaurant not found' });
  }

  if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  await restaurant.deleteOne();
  await Food.deleteMany({ restaurant: restaurant._id });

  res.json({ success: true, message: 'Restaurant deleted successfully' });
};

// @desc    Get current user's restaurant
// @route   GET /api/restaurants/my/profile
// @access  Private (RESTAURANT owner)
const getMyRestaurant = async (req, res) => {
  const restaurant = await Restaurant.findOne({ owner: req.user._id });
  if (!restaurant) {
    return res.status(404).json({ success: false, message: 'No restaurant found for this owner' });
  }

  res.json({ success: true, data: restaurant });
};

// @desc    Get restaurant analytics
// @route   GET /api/restaurants/my/analytics
// @access  Private (RESTAURANT owner)
const getRestaurantAnalytics = async (req, res) => {
  const restaurant = await Restaurant.findOne({ owner: req.user._id });
  if (!restaurant) {
    return res.status(404).json({ success: false, message: 'No restaurant found' });
  }

  const orders = await Order.find({ restaurant: restaurant._id });

  const totalOrders = orders.length;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayOrders = orders.filter((o) => new Date(o.createdAt) >= today).length;
  const totalRevenue = orders
    .filter((o) => o.orderStatus === 'DELIVERED')
    .reduce((acc, o) => acc + o.total, 0);

  const popularFoods = await Food.find({ restaurant: restaurant._id }).sort({ numReviews: -1 }).limit(5);

  res.json({
    success: true,
    data: {
      totalOrders,
      todayOrders,
      totalRevenue,
      rating: restaurant.rating,
      popularFoods,
    },
  });
};

module.exports = {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getMyRestaurant,
  getRestaurantAnalytics,
};
