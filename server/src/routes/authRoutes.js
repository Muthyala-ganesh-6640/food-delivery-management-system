const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validate, registerValidation, loginValidation } = require('../utils/validators');

router.post('/register', validate(registerValidation), registerUser);
router.post('/login', validate(loginValidation), loginUser);
router.post('/logout', logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);

module.exports = router;
