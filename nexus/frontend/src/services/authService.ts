import { api } from './api';

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    is_active: boolean;
  };
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', { email, password });
  return response.data;
};

export const register = async (fullName: string, email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', { full_name: fullName, email, password });
  return response.data;
};

export const getCurrentUser = async (): Promise<AuthResponse['user']> => {
  const response = await api.get<AuthResponse['user']>('/auth/me');
  return response.data;
};
