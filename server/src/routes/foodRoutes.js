const express = require('express');
const router = express.Router();
const {
  getFoods,
  getFoodById,
  addFood,
  updateFood,
  deleteFood,
  getCategories,
} = require('../controllers/foodController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', getFoods);
router.get('/categories/all', getCategories);
router.get('/:id', getFoodById);

router.post('/', protect, authorize('RESTAURANT', 'ADMIN'), addFood);
router.put('/:id', protect, authorize('RESTAURANT', 'ADMIN'), updateFood);
router.delete('/:id', protect, authorize('RESTAURANT', 'ADMIN'), deleteFood);

module.exports = router;
