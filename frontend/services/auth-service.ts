import api from '../lib/api';
import {
  RegisterRequest,
  AuthResponse,
  LoginRequest,
  UserResponse,
} from '@/types/auth';

export type MessageResponse = { message: string };

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

  async verifyEmail(data: {
    email: string;
    otp: string;
  }): Promise<MessageResponse> {
    const response = await api.post<MessageResponse>('api/auth/verify', data);
    return response.data;
  },

  async resendVerificationEmail(data: {
    email: string;
  }): Promise<MessageResponse> {
    const response = await api.post<MessageResponse>(
      'api/auth/resend-verification',
      data,
    );
    return response.data;
  },

  async forgotPassword(data: { email: string }): Promise<MessageResponse> {
    const response = await api.post<MessageResponse>(
      'api/auth/forgot-password',
      data,
    );
    return response.data;
  },

  async verifyPasswordReset(data: {
    email: string;
    otp: string;
  }): Promise<MessageResponse> {
    const response = await api.post<MessageResponse>(
      'api/auth/verify-password-reset',
      data,
    );
    return response.data;
  },

  async resetPassword(data: {
    email: string;
    otp: string;
    newPassword: string;
  }): Promise<MessageResponse> {
    const response = await api.post<MessageResponse>(
      'api/auth/reset-password',
      data,
    );
    return response.data;
  },
};
