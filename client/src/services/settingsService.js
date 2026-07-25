import api from './api';

export const getSettings = () => api.get('/settings').then((res) => res.data);

export const updateSettings = (payload) => api.put('/settings', payload).then((res) => res.data);
