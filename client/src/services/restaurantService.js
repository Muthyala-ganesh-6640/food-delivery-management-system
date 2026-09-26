import API from './api';

export const getRestaurants = (params) => API.get('/restaurants', { params });
export const getRestaurantById = (id) => API.get(`/restaurants/${id}`);
export const getMyRestaurant = () => API.get('/restaurants/my/profile');
export const getRestaurantAnalytics = () => API.get('/restaurants/my/analytics');
export const createRestaurant = (data) => API.post('/restaurants', data);
export const updateRestaurant = (id, data) => API.put(`/restaurants/${id}`, data);
export const deleteRestaurant = (id) => API.delete(`/restaurants/${id}`);
