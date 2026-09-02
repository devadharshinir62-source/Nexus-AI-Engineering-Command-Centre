import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, register as apiRegister, getCurrentUser as apiGetCurrentUser } from '../services/authService';

interface User {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  // Load token from storage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('nexus_token');
    if (storedToken) {
      setToken(storedToken);
      apiGetCurrentUser()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('nexus_token');
          setToken(null);
          setUser(null);
        });
    }
  }, []);

  const login = async (email: string, password: string) => {
    const resp = await apiLogin(email, password);
    const newToken = resp.access_token;
    localStorage.setItem('nexus_token', newToken);
    setToken(newToken);
    const u = await apiGetCurrentUser();
    setUser(u);
    navigate('/');
  };

  const register = async (fullName: string, email: string, password: string) => {
    const resp = await apiRegister(fullName, email, password);
    const newToken = resp.access_token;
    localStorage.setItem('nexus_token', newToken);
    setToken(newToken);
    const u = await apiGetCurrentUser();
    setUser(u);
    navigate('/');
  };

  const logout = () => {
    localStorage.removeItem('nexus_token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
