import API from './api';

export const getFoods = (params) => API.get('/foods', { params });
export const getFoodById = (id) => API.get(`/foods/${id}`);
export const getCategories = () => API.get('/foods/categories/all');
export const addFood = (data) => API.post('/foods', data);
export const updateFood = (id, data) => API.put(`/foods/${id}`, data);
export const deleteFood = (id) => API.delete(`/foods/${id}`);
