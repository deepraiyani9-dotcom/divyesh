import api from './api';

export const getTestimonials = (params = {}) => api.get('/testimonials', { params }).then((res) => res.data);

export const getTestimonial = (id) => api.get(`/testimonials/${id}`).then((res) => res.data);

export const createTestimonial = (payload) => api.post('/testimonials', payload).then((res) => res.data);

export const updateTestimonial = (id, payload) => api.put(`/testimonials/${id}`, payload).then((res) => res.data);

export const deleteTestimonial = (id) => api.delete(`/testimonials/${id}`).then((res) => res.data);
