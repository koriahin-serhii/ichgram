import api from './client';
import type { AuthResponse } from './types';

export type LoginPayload = { email: string; password: string };
export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  fullName: string;
};
export type ResetPasswordPayload = { email: string };
export type ResetPasswordResponse = { 
  message: string;
};

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

export async function getCurrentUser() {
  const res = await api.get<AuthResponse>('/api/auth/me');
  return res.data;
}

export async function resetPassword(data: ResetPasswordPayload) {
  const res = await api.post<ResetPasswordResponse>('/api/auth/reset-password', data);
  return res.data;
}
