import api from './api';

export const getCareers = (params = {}) => api.get('/careers', { params }).then((res) => res.data);

export const getCareer = (id) => api.get(`/careers/${id}`).then((res) => res.data);

export const createCareer = (payload) => api.post('/careers', payload).then((res) => res.data);

export const updateCareer = (id, payload) => api.put(`/careers/${id}`, payload).then((res) => res.data);

export const deleteCareer = (id) => api.delete(`/careers/${id}`).then((res) => res.data);
