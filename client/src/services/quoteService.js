import api from './api';

export const submitQuote = (payload) => api.post('/quote', payload).then((res) => res.data);

export const getQuotes = (params = {}) => api.get('/quotes', { params }).then((res) => res.data);

export const getQuote = (id) => api.get(`/quotes/${id}`).then((res) => res.data);

export const updateQuote = (id, payload) => api.put(`/quotes/${id}`, payload).then((res) => res.data);

export const deleteQuote = (id) => api.delete(`/quotes/${id}`).then((res) => res.data);
