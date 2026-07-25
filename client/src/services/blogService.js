import api from './api';

export const getBlogs = (params = {}) => api.get('/blogs', { params }).then((res) => res.data);

export const getBlogById = (id) => api.get(`/blogs/${id}`).then((res) => res.data);

export const getBlogBySlug = (slug) => api.get(`/blogs/slug/${slug}`).then((res) => res.data);

export const createBlog = (payload) => api.post('/blogs', payload).then((res) => res.data);

export const updateBlog = (id, payload) => api.put(`/blogs/${id}`, payload).then((res) => res.data);

export const deleteBlog = (id) => api.delete(`/blogs/${id}`).then((res) => res.data);
