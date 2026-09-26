import API from './api';

export const getCart = () => API.get('/cart');
export const addToCart = (data) => API.post('/cart', data);
export const updateCartItem = (itemId, data) => API.put(`/cart/${itemId}`, data);
export const removeCartItem = (itemId) => API.delete(`/cart/${itemId}`);
export const clearCart = () => API.delete('/cart');
