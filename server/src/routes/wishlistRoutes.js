const express = require('express');
const router = express.Router();
const {
  getWishlist,
  toggleFoodWishlist,
  toggleRestaurantWishlist,
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getWishlist);
router.post('/food/:foodId', toggleFoodWishlist);
router.post('/restaurant/:restaurantId', toggleRestaurantWishlist);

module.exports = router;
