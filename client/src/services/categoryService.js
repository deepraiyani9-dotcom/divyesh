import api from './api';

export const getCategories = (params = {}) => api.get('/categories', { params }).then((res) => res.data);

export const getCategoryById = (id) => api.get(`/categories/${id}`).then((res) => res.data);

export const getCategoryBySlug = (slug) => api.get(`/categories/slug/${slug}`).then((res) => res.data);

export const createCategory = (payload) => api.post('/categories', payload).then((res) => res.data);

export const updateCategory = (id, payload) => api.put(`/categories/${id}`, payload).then((res) => res.data);

export const deleteCategory = (id) => api.delete(`/categories/${id}`).then((res) => res.data);
