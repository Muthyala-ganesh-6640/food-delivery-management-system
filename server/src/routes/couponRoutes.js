const express = require('express');
const router = express.Router();
const {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
} = require('../controllers/couponController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', getCoupons);
router.post('/validate', protect, validateCoupon);

router.post('/', protect, authorize('ADMIN'), createCoupon);
router.put('/:id', protect, authorize('ADMIN'), updateCoupon);
router.delete('/:id', protect, authorize('ADMIN'), deleteCoupon);

module.exports = router;
