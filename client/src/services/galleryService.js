import api from './api';

export const getGallery = (params = {}) => api.get('/gallery', { params }).then((res) => res.data);

export const getGalleryItem = (id) => api.get(`/gallery/${id}`).then((res) => res.data);

export const createGalleryItem = (payload) => api.post('/gallery', payload).then((res) => res.data);

export const updateGalleryItem = (id, payload) => api.put(`/gallery/${id}`, payload).then((res) => res.data);

export const deleteGalleryItem = (id) => api.delete(`/gallery/${id}`).then((res) => res.data);
