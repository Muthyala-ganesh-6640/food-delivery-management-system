const Razorpay = require('razorpay');

let razorpayInstance;

try {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_foodexpress123',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'foodexpress_razorpay_secret_123',
  });
} catch (error) {
  console.warn('Razorpay initialization fallback:', error.message);
  razorpayInstance = {
    orders: {
      create: async (options) => ({
        id: 'order_mock_' + Date.now(),
        entity: 'order',
        amount: options.amount,
        currency: options.currency || 'INR',
        receipt: options.receipt,
        status: 'created',
      }),
    },
  };
}

module.exports = razorpayInstance;
