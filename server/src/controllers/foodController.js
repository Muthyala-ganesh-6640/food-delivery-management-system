const Food = require('../models/Food');
const Restaurant = require('../models/Restaurant');
const Category = require('../models/Category');

// @desc    Get all food items with search, filter, pagination
// @route   GET /api/foods
// @access  Public
const getFoods = async (req, res) => {
  const { search, category, isVeg, minPrice, maxPrice, rating, restaurantId, page = 1, limit = 20 } = req.query;

  let query = { isAvailable: true };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }

  if (category) {
    query.category = { $regex: category, $options: 'i' };
  }

  if (isVeg !== undefined && isVeg !== '') {
    query.isVeg = isVeg === 'true';
  }

  if (restaurantId) {
    query.restaurant = restaurantId;
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  if (rating) {
    query.rating = { $gte: Number(rating) };
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Food.countDocuments(query);
  const foods = await Food.find(query)
    .populate('restaurant', 'name logo rating deliveryTime deliveryFee')
    .skip(skip)
    .limit(Number(limit));

  res.json({
    success: true,
    count: foods.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data: foods,
  });
};

// @desc    Get food item by ID
// @route   GET /api/foods/:id
// @access  Public
const getFoodById = async (req, res) => {
  const food = await Food.findById(req.params.id).populate('restaurant', 'name logo rating address phone');

  if (!food) {
    return res.status(404).json({ success: false, message: 'Food item not found' });
  }

  res.json({ success: true, data: food });
};

// @desc    Add food item
// @route   POST /api/foods
// @access  Private (RESTAURANT owner / ADMIN)
const addFood = async (req, res) => {
  let { restaurant, name, description, image, category, price, discount, isVeg, preparationTime, addOns } = req.body;

  if (!restaurant && req.user.role === 'RESTAURANT') {
    const userRestaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!userRestaurant) {
      return res.status(400).json({ success: false, message: 'Please create a restaurant profile first' });
    }
    restaurant = userRestaurant._id;
  }

  const food = await Food.create({
    restaurant,
    name,
    description,
    image,
    category,
    price: Number(price),
    discount: Number(discount || 0),
    isVeg: isVeg !== undefined ? isVeg : true,
    preparationTime,
    addOns,
  });

  res.status(201).json({ success: true, message: 'Food item added successfully', data: food });
};

// @desc    Update food item
// @route   PUT /api/foods/:id
// @access  Private (RESTAURANT owner / ADMIN)
const updateFood = async (req, res) => {
  const food = await Food.findById(req.params.id);

  if (!food) {
    return res.status(404).json({ success: false, message: 'Food item not found' });
  }

  const restaurant = await Restaurant.findById(food.restaurant);
  if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Not authorized to update this food item' });
  }

  Object.assign(food, req.body);
  if (req.body.price || req.body.discount !== undefined) {
    const p = req.body.price !== undefined ? Number(req.body.price) : food.price;
    const d = req.body.discount !== undefined ? Number(req.body.discount) : food.discount;
    food.finalPrice = d > 0 ? Math.round(p - (p * d) / 100) : p;
  }

  await food.save();
  res.json({ success: true, message: 'Food item updated successfully', data: food });
};

// @desc    Delete food item
// @route   DELETE /api/foods/:id
// @access  Private (RESTAURANT owner / ADMIN)
const deleteFood = async (req, res) => {
  const food = await Food.findById(req.params.id);

  if (!food) {
    return res.status(404).json({ success: false, message: 'Food item not found' });
  }

  const restaurant = await Restaurant.findById(food.restaurant);
  if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Not authorized to delete this food item' });
  }

  await food.deleteOne();
  res.json({ success: true, message: 'Food item deleted successfully' });
};

// @desc    Get all categories
// @route   GET /api/foods/categories/all
// @access  Public
const getCategories = async (req, res) => {
  const categories = await Category.find({ isActive: true });
  res.json({ success: true, data: categories });
};

module.exports = {
  getFoods,
  getFoodById,
  addFood,
  updateFood,
  deleteFood,
  getCategories,
};
