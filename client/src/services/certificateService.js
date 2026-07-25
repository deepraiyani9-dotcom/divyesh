import api from './api';

export const getCertificates = (params = {}) => api.get('/certificates', { params }).then((res) => res.data);

export const getCertificate = (id) => api.get(`/certificates/${id}`).then((res) => res.data);

export const createCertificate = (payload) => api.post('/certificates', payload).then((res) => res.data);

export const updateCertificate = (id, payload) => api.put(`/certificates/${id}`, payload).then((res) => res.data);

export const deleteCertificate = (id) => api.delete(`/certificates/${id}`).then((res) => res.data);
