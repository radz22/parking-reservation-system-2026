export type Role = 'USER' | 'ADMIN';

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenPayload {
  id: string;
  email: string;
  username: string;
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  role: Role;
}
