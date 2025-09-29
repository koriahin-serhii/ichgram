import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { AuthAPI } from '@api';
import { queryClient } from '@shared/query/client';
import { AuthContext, type AuthUser, type AuthContextValue } from './authContext';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    error,
    async login(email: string, password: string) {
      setLoading(true); setError(null);
      try {
        const res = await AuthAPI.login({ email, password });
        setUser(res.user ?? null); // token stored in cookie by backend
        await queryClient.invalidateQueries({ predicate: () => true });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Login failed';
        setError(msg);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    async register(name: string, email: string, password: string) {
      setLoading(true); setError(null);
      try {
        await AuthAPI.register({ name, email, password });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Registration failed';
        setError(msg);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    async logout() {
      try {
        await AuthAPI.logout();
      } finally {
        setUser(null);
        queryClient.clear();
      }
    },
    setUser,
  }), [user, loading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
