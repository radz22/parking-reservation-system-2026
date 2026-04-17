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


export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenPayload {
  id: string;
  email: string;
  username: string;
  role: Role;
  isVerified: boolean;
  isBanned: boolean;
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
  isVerified: boolean;
  isBanned: boolean;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

/** Validates forgot-password OTP without resetting password (step before new password). */
export interface VerifyPasswordResetCodeRequest {
  email: string;
  otp: string;
}

