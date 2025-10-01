import api from './client';
import type { AuthResponse } from './types';

export type LoginPayload = { email: string; password: string };
export type RegisterPayload = { name: string; email: string; password: string; fullName: string };

export async function login(data: LoginPayload) {
  const res = await api.post<AuthResponse>('/api/auth/login', data);
  return res.data;
}

export async function register(data: RegisterPayload) {
  const res = await api.post<AuthResponse>('/api/auth/register', data);
  return res.data;
}

export async function logout() {
  await api.post('/api/auth/logout');
}
