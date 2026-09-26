const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getOrders,
  updateStatus,
  cancelOrder,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', authorize('RESTAURANT', 'DELIVERY', 'ADMIN'), updateStatus);
router.put('/:id/cancel', cancelOrder);

module.exports = router;
