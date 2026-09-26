const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../services/emailService');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ success: false, message: 'User already exists with this email' });
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: role || 'CUSTOMER',
  });

  if (user) {
    const token = generateToken(res, user._id, user.role);
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        token,
      },
    });
  } else {
    res.status(400).json({ success: false, message: 'Invalid user data' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: 'Your account has been blocked by Admin' });
    }

    const token = generateToken(res, user._id, user.role);
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        token,
      },
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = async (req, res) => {
  res.json({ success: true, message: 'Successfully logged out' });
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ success: false, message: 'No user found with that email' });
  }

  const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins
  await user.save();

  await sendEmail({
    email: user.email,
    subject: 'FoodExpress - Password Reset OTP',
    message: `Your password reset OTP is: ${resetToken}. Valid for 10 minutes.`,
  });

  res.json({ success: true, message: 'Password reset OTP sent to email', resetToken });
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  const { email, resetToken, newPassword } = req.body;
  const user = await User.findOne({
    email,
    resetPasswordToken: resetToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({ success: true, message: 'Password reset successful. You can now login.' });
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json({ success: true, data: user });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getMe,
};
