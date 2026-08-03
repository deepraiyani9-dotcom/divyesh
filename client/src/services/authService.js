import api from './api';

export const login = (payload) => api.post('/auth/login', payload).then((res) => res.data);

export const logout = () => api.post('/auth/logout').then((res) => res.data);

export const getMe = () => api.get('/auth/me').then((res) => res.data);

export const updateProfile = (payload) => api.put('/auth/profile', payload).then((res) => res.data);

export const register = (payload) => api.post('/auth/register', payload).then((res) => res.data);

export const forgotPassword = (payload) =>
  api.post('/auth/forgot-password', payload).then((res) => res.data);

export const resetPassword = (token, payload) =>
  api.post(`/auth/reset-password/${token}`, payload).then((res) => res.data);

export const changePassword = (payload) =>
  api.put('/auth/change-password', payload).then((res) => res.data);
