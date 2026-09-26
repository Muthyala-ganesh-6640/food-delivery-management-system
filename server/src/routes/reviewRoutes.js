const express = require('express');
const router = express.Router();
const { createReview, getRestaurantReviews, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:restaurantId', getRestaurantReviews);
router.post('/', protect, createReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
