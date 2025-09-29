import { createContext } from 'react';

export type AuthUser = {
  id: string;
  name?: string;
  email?: string;
  fullName?: string;
};

export type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (u: AuthUser | null) => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
