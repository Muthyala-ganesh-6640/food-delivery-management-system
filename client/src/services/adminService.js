import API from './api';

export const getAdminDashboard = () => API.get('/admin/dashboard');
export const getUsers = (params) => API.get('/admin/users', { params });
export const toggleBlockUser = (id) => API.put(`/admin/users/${id}/block`);
export const approveRestaurant = (id, isApproved) => API.put(`/admin/restaurants/${id}/approve`, { isApproved });
export const suspendRestaurant = (id) => API.put(`/admin/restaurants/${id}/suspend`);
export const getDeliveryPartners = () => API.get('/admin/delivery-partners');
export const approveDeliveryPartner = (id) => API.put(`/admin/delivery-partners/${id}/approve`);
export const getAdminReports = () => API.get('/admin/reports');
