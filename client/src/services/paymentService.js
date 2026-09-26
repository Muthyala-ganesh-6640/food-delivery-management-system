import API from './api';

export const createPaymentOrder = (orderId) => API.post('/payment/create', { orderId });
export const verifyPayment = (paymentData) => API.post('/payment/verify', paymentData);
