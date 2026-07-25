import api from './api';

export const getProducts = (params = {}) => api.get('/products', { params }).then((res) => res.data);

export const getProductById = (id) => api.get(`/products/${id}`).then((res) => res.data);

export const getProductBySlug = (slug) => api.get(`/products/slug/${slug}`).then((res) => res.data);

export const createProduct = (payload) => api.post('/products', payload).then((res) => res.data);

export const updateProduct = (id, payload) => api.put(`/products/${id}`, payload).then((res) => res.data);

export const deleteProduct = (id) => api.delete(`/products/${id}`).then((res) => res.data);
