import API from './api';

export const createOrder = (data) => API.post('/orders', data);
export const getOrders = () => API.get('/orders');
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const updateOrderStatus = (id, data) => API.put(`/orders/${id}/status`, data);
export const cancelOrder = (id, data) => API.put(`/orders/${id}/cancel`, data);
