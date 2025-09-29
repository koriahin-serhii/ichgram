import api from './client';
import type { ID } from './types';

export async function getProfile(id: ID) {
  const res = await api.get(`/user/profile/${id}`);
  return res.data;
}

export async function updateProfile(form: FormData) {
  const res = await api.put('/user/profile', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
}
