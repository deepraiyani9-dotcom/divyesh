import api from './api';

export const submitContact = (payload) => api.post('/contact', payload).then((res) => res.data);

export const getContacts = (params = {}) => api.get('/contacts', { params }).then((res) => res.data);

export const getContact = (id) => api.get(`/contacts/${id}`).then((res) => res.data);

export const updateContact = (id, payload) => api.put(`/contacts/${id}`, payload).then((res) => res.data);

export const deleteContact = (id) => api.delete(`/contacts/${id}`).then((res) => res.data);
