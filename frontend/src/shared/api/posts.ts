import api from './client';
import type { ID } from './types';

export async function getUserPosts(userId: ID) {
  const res = await api.get(`/posts/user/${userId}`);
  return res.data;
}

export async function getFeed() {
  const res = await api.get('/posts');
  return res.data;
}

export async function getPost(id: ID) {
  const res = await api.get(`/posts/${id}`);
  return res.data;
}

export async function createPost(image: File, data: Record<string, string | number | boolean> = {}) {
  const form = new FormData();
  form.append('image', image);
  Object.entries(data).forEach(([k, v]) => form.append(k, String(v)));
  const res = await api.post('/posts', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
}

export async function deletePost(id: ID) {
  const res = await api.delete(`/posts/${id}`);
  return res.data;
}

export async function updatePost(id: ID, image?: File, data: Record<string, string | number | boolean> = {}) {
  const form = new FormData();
  if (image) form.append('image', image);
  Object.entries(data).forEach(([k, v]) => form.append(k, String(v)));
  const res = await api.put(`/posts/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
}
