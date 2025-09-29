import api from './client';
import type { AuthResponse } from './types';

export type LoginPayload = { email: string; password: string };
export type RegisterPayload = { name: string; email: string; password: string };

export async function login(data: LoginPayload) {
  const res = await api.post<AuthResponse>('/auth/login', data);
  return res.data;
}

export async function register(data: RegisterPayload) {
  const res = await api.post<AuthResponse>('/auth/register', data);
  return res.data;
}

export async function logout() {
  await api.post('/auth/logout');
}
