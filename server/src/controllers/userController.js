const User = require('../models/User');
const Address = require('../models/Address');
const Order = require('../models/Order');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  const addresses = await Address.find({ user: req.user._id });
  res.json({
    success: true,
    data: {
      ...user.toObject(),
      addresses,
    },
  });
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    if (req.body.profileImage) {
      user.profileImage = req.body.profileImage;
    }
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        profileImage: updatedUser.profileImage,
      },
    });
  } else {
    res.status(404).json({ success: false, message: 'User not found' });
  }
};

// @desc    Get user addresses
// @route   GET /api/users/addresses
// @access  Private
const getAddresses = async (req, res) => {
  const addresses = await Address.find({ user: req.user._id });
  res.json({ success: true, data: addresses });
};

// @desc    Add new address
// @route   POST /api/users/addresses
// @access  Private
const addAddress = async (req, res) => {
  const { type, houseNo, street, area, city, state, pincode, landmark, isDefault } = req.body;

  if (isDefault) {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
  }

  const address = await Address.create({
    user: req.user._id,
    type,
    houseNo,
    street,
    area,
    city,
    state,
    pincode,
    landmark,
    isDefault: isDefault || false,
  });

  res.status(201).json({ success: true, message: 'Address added successfully', data: address });
};

// @desc    Update address
// @route   PUT /api/users/addresses/:id
// @access  Private
const updateAddress = async (req, res) => {
  const address = await Address.findById(req.params.id);

  if (!address) {
    return res.status(404).json({ success: false, message: 'Address not found' });
  }

  if (address.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  if (req.body.isDefault) {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
  }

  Object.assign(address, req.body);
  await address.save();

  res.json({ success: true, message: 'Address updated successfully', data: address });
};

// @desc    Delete address
// @route   DELETE /api/users/addresses/:id
// @access  Private
const deleteAddress = async (req, res) => {
  const address = await Address.findById(req.params.id);

  if (!address) {
    return res.status(404).json({ success: false, message: 'Address not found' });
  }

  if (address.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  await address.deleteOne();
  res.json({ success: true, message: 'Address deleted successfully' });
};

// @desc    Get user order history
// @route   GET /api/users/orders
// @access  Private
const getUserOrders = async (req, res) => {
  const orders = await Order.find({ customer: req.user._id })
    .populate('restaurant', 'name logo banner phone')
    .sort({ createdAt: -1 });

  res.json({ success: true, data: orders });
};

// @desc    Delete account
// @route   DELETE /api/users/account
// @access  Private
const deleteAccount = async (req, res) => {
  await User.findByIdAndDelete(req.user._id);
  res.json({ success: true, message: 'Account deleted successfully' });
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getUserOrders,
  deleteAccount,
};
