import api from './api';

export const login = (payload) => api.post('/auth/login', payload).then((res) => res.data);

export const logout = () => api.post('/auth/logout').then((res) => res.data);

export const getMe = () => api.get('/auth/me').then((res) => res.data);

export const updateProfile = (payload) => api.put('/auth/profile', payload).then((res) => res.data);

export const register = (payload) => api.post('/auth/register', payload).then((res) => res.data);
