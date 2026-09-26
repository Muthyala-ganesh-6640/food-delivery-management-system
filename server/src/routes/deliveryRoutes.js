const express = require('express');
const router = express.Router();
const {
  getDeliveryProfile,
  updateDeliveryStatus,
  getAvailableOrders,
  acceptDeliveryOrder,
  getDeliveryEarnings,
} = require('../controllers/deliveryController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect, authorize('DELIVERY', 'ADMIN'));

router.get('/profile', getDeliveryProfile);
router.put('/status', updateDeliveryStatus);
router.get('/orders/available', getAvailableOrders);
router.put('/orders/:id/accept', acceptDeliveryOrder);
router.get('/earnings', getDeliveryEarnings);

module.exports = router;
