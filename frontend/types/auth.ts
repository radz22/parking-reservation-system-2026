export type Role = 'USER' | 'ADMIN';

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  contact: string;
  plateNumber?: string;
  wheelType?: string;
  role?: Role;
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
