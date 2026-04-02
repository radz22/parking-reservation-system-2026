import api from '../lib/api';
import {
  RegisterRequest,
  AuthResponse,
  LoginRequest,
  UserResponse,
} from '@/types/auth';

export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('api/auth/register', data);
    return response.data;
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('api/auth/login', data);
    return response.data;
  },

  async refresh(): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('api/auth/refresh');
    return response.data;
  },

  async getMe(): Promise<UserResponse> {
    const response = await api.get('api/auth/me');
    return response.data;
  },
};
