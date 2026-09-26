const express = require('express');
const router = express.Router();
const {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getMyRestaurant,
  getRestaurantAnalytics,
} = require('../controllers/restaurantController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', getRestaurants);
router.get('/my/profile', protect, authorize('RESTAURANT', 'ADMIN'), getMyRestaurant);
router.get('/my/analytics', protect, authorize('RESTAURANT', 'ADMIN'), getRestaurantAnalytics);
router.get('/:id', getRestaurantById);

router.post('/', protect, authorize('RESTAURANT', 'ADMIN'), createRestaurant);
router.put('/:id', protect, authorize('RESTAURANT', 'ADMIN'), updateRestaurant);
router.delete('/:id', protect, authorize('RESTAURANT', 'ADMIN'), deleteRestaurant);

module.exports = router;
