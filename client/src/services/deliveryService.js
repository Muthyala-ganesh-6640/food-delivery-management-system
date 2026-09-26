import API from './api';

export const getDeliveryProfile = () => API.get('/delivery/profile');
export const updateDeliveryStatus = (status) => API.put('/delivery/status', { status });
export const getAvailableOrders = () => API.get('/delivery/orders/available');
export const acceptDeliveryOrder = (orderId) => API.put(`/delivery/orders/${orderId}/accept`);
export const getDeliveryEarnings = () => API.get('/delivery/earnings');
