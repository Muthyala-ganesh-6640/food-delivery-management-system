const express = require('express');
const router = express.Router();
const { createPaymentOrder, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/create', createPaymentOrder);
router.post('/verify', verifyPayment);

module.exports = router;
