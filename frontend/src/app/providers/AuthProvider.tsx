import { useMemo, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AuthAPI } from '@api';
import { AuthContext, type AuthUser, type AuthContextValue } from './authContext';
import { initSocket, disconnectSocket } from '../../shared/utils/socket';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await AuthAPI.getCurrentUser();
        setUser(res.user ?? null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
        setInitialCheckDone(true);
      }
    };
    
    checkAuth();
  }, []);

  // Initialize socket when user is authenticated
  useEffect(() => {
    if (user?.id) {
      initSocket(user.id);
    } else {
      disconnectSocket();
    }
    
    return () => {
      disconnectSocket();
    };
  }, [user?.id]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    initialCheckDone,
    error,
    async login(email: string, password: string) {
      setLoading(true);
      setError(null);
      try {
        const res = await AuthAPI.login({ email, password });
        setUser(res.user ?? null);
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
      setLoading(true);
      setError(null);
      try {
        await AuthAPI.register({ name, email, password, fullName });
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
        
        // Clear all bot chat messages from sessionStorage
        const botChatKeys = Object.keys(sessionStorage).filter(key => 
          key.startsWith('bot-chat-messages-')
        );
        botChatKeys.forEach(key => sessionStorage.removeItem(key));
        
        queryClient.cancelQueries();
        queryClient.clear();
      }
    },
    async refreshUser() {
      try {
        const res = await AuthAPI.getCurrentUser();
        setUser(res.user ?? null);
      } catch {
        setUser(null);
      }
    },
    setUser,
  }), [user, loading, initialCheckDone, error, queryClient]);

  if (!initialCheckDone) {
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
