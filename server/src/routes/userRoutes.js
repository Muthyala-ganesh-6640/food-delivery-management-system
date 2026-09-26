const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getUserOrders,
  deleteAccount,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);

router.get('/addresses', getAddresses);
router.post('/addresses', addAddress);
router.put('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);

router.get('/orders', getUserOrders);
router.delete('/account', deleteAccount);

module.exports = router;
