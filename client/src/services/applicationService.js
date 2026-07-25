import api from './api';

export const applyForJob = (formData) =>
  api
    .post('/apply', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data);

export const getApplications = (params = {}) => api.get('/applications', { params }).then((res) => res.data);

export const updateApplication = (id, payload) => api.put(`/applications/${id}`, payload).then((res) => res.data);

export const deleteApplication = (id) => api.delete(`/applications/${id}`).then((res) => res.data);
