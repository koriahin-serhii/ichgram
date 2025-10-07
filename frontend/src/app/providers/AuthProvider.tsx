import { useMemo, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AuthAPI } from '@api';
import { AuthContext, type AuthUser, type AuthContextValue } from './authContext';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true); // Start with true to check auth on mount
  const [error, setError] = useState<string | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await AuthAPI.getCurrentUser();
        setUser(res.user ?? null);
      } catch {
        // User not authenticated or token expired
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

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
    async register(name: string, email: string, password: string, fullName: string) {
      setLoading(true); setError(null);
      try {
        await AuthAPI.register({ name, email, password, fullName });
        // Auto-login right after successful registration
        const res = await AuthAPI.login({ email, password });
        setUser(res.user ?? null);
        await queryClient.invalidateQueries({ predicate: () => true });
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
        // Cancel all ongoing queries before clearing
        queryClient.cancelQueries();
        queryClient.clear();
      }
    },
    async refreshUser() {
      try {
        const res = await AuthAPI.getCurrentUser();
        setUser(res.user ?? null);
      } catch {
        // If refresh fails, user might be logged out
        setUser(null);
      }
    },
    setUser,
  }), [user, loading, error, queryClient]);

  // Show loading indicator while checking auth
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#8e8e8e'
      }}>
        Loading...
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
