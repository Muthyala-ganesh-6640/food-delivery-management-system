const Cart = require('../models/Cart');
const Food = require('../models/Food');

// @desc    Get current user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id })
    .populate('items.food')
    .populate('restaurant', 'name logo deliveryFee minimumOrder');

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  res.json({ success: true, data: cart });
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  const { foodId, quantity = 1, specialInstructions = '', selectedAddOns = [] } = req.body;

  const food = await Food.findById(foodId);
  if (!food) {
    return res.status(404).json({ success: false, message: 'Food item not found' });
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [], restaurant: food.restaurant });
  }

  // If adding food from a different restaurant, reset cart for single-restaurant order
  if (cart.restaurant && cart.restaurant.toString() !== food.restaurant.toString()) {
    cart.items = [];
    cart.restaurant = food.restaurant;
  }

  const existingItemIndex = cart.items.findIndex((item) => item.food.toString() === foodId);

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += Number(quantity);
    cart.items[existingItemIndex].specialInstructions = specialInstructions || cart.items[existingItemIndex].specialInstructions;
  } else {
    cart.items.push({
      food: foodId,
      quantity: Number(quantity),
      price: food.finalPrice || food.price,
      specialInstructions,
      selectedAddOns,
    });
  }

  cart.restaurant = food.restaurant;

  // Recalculate subtotal
  cart.subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  await cart.save();

  const populatedCart = await Cart.findById(cart._id)
    .populate('items.food')
    .populate('restaurant', 'name logo deliveryFee minimumOrder');

  res.json({ success: true, message: 'Item added to cart', data: populatedCart });
};

// @desc    Update cart item quantity or instructions
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = async (req, res) => {
  const { quantity, specialInstructions } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({ success: false, message: 'Cart not found' });
  }

  const item = cart.items.id(req.params.itemId);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found in cart' });
  }

  if (quantity !== undefined) {
    if (quantity <= 0) {
      cart.items.pull(req.params.itemId);
    } else {
      item.quantity = quantity;
    }
  }

  if (specialInstructions !== undefined) {
    item.specialInstructions = specialInstructions;
  }

  if (cart.items.length === 0) {
    cart.restaurant = undefined;
    cart.subtotal = 0;
  } else {
    cart.subtotal = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  }

  await cart.save();

  const populatedCart = await Cart.findById(cart._id)
    .populate('items.food')
    .populate('restaurant', 'name logo deliveryFee minimumOrder');

  res.json({ success: true, message: 'Cart updated', data: populatedCart });
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeCartItem = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({ success: false, message: 'Cart not found' });
  }

  cart.items.pull(req.params.itemId);

  if (cart.items.length === 0) {
    cart.restaurant = undefined;
    cart.subtotal = 0;
  } else {
    cart.subtotal = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  }

  await cart.save();

  const populatedCart = await Cart.findById(cart._id)
    .populate('items.food')
    .populate('restaurant', 'name logo deliveryFee minimumOrder');

  res.json({ success: true, message: 'Item removed from cart', data: populatedCart });
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = [];
    cart.restaurant = undefined;
    cart.subtotal = 0;
    cart.discount = 0;
    cart.coupon = undefined;
    await cart.save();
  }
  res.json({ success: true, message: 'Cart cleared' });
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
