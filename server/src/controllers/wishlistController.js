const Wishlist = require('../models/Wishlist');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id })
    .populate('foods')
    .populate('restaurants');

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, foods: [], restaurants: [] });
  }

  res.json({ success: true, data: wishlist });
};

// @desc    Toggle Food in Wishlist
// @route   POST /api/wishlist/food/:foodId
// @access  Private
const toggleFoodWishlist = async (req, res) => {
  const { foodId } = req.params;
  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = new Wishlist({ user: req.user._id, foods: [], restaurants: [] });
  }

  const exists = wishlist.foods.includes(foodId);
  if (exists) {
    wishlist.foods.pull(foodId);
  } else {
    wishlist.foods.push(foodId);
  }

  await wishlist.save();
  const populated = await Wishlist.findById(wishlist._id).populate('foods').populate('restaurants');

  res.json({
    success: true,
    message: exists ? 'Food removed from wishlist' : 'Food added to wishlist',
    data: populated,
  });
};

// @desc    Toggle Restaurant in Wishlist
// @route   POST /api/wishlist/restaurant/:restaurantId
// @access  Private
const toggleRestaurantWishlist = async (req, res) => {
  const { restaurantId } = req.params;
  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = new Wishlist({ user: req.user._id, foods: [], restaurants: [] });
  }

  const exists = wishlist.restaurants.includes(restaurantId);
  if (exists) {
    wishlist.restaurants.pull(restaurantId);
  } else {
    wishlist.restaurants.push(restaurantId);
  }

  await wishlist.save();
  const populated = await Wishlist.findById(wishlist._id).populate('foods').populate('restaurants');

  res.json({
    success: true,
    message: exists ? 'Restaurant removed from wishlist' : 'Restaurant added to wishlist',
    data: populated,
  });
};

module.exports = {
  getWishlist,
  toggleFoodWishlist,
  toggleRestaurantWishlist,
};
