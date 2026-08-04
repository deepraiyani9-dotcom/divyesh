import api from './api';

export const subscribeNewsletter = (email) => api.post('/subscribe', { email }).then((res) => res.data);

export const getSubscribers = (params = {}) => api.get('/subscribers', { params }).then((res) => res.data);

export const deleteSubscriber = (id) => api.delete(`/subscribers/${id}`).then((res) => res.data);

export const broadcastNewsletter = (payload) =>
  api.post('/subscribers/broadcast', payload).then((res) => res.data);
