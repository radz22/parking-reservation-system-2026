import {
  RegisterRequest,
  LoginRequest,
  VerifyOtpRequest,
  ResendVerificationRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyPasswordResetCodeRequest,
} from '@/types/auth';
import { hashText, compareTextToHashedText } from '@/utils/brycpt';
import { prisma } from '@/lib/prisma';
import { CustomError } from '@/utils/custom-error';
import { generateTokens, verifyRefreshToken } from '@/utils/jwt';
import { generateOtp } from '@/utils/otp';
import { emailService } from '@/services/email-service';

const RESEND_VERIFICATION_COOLDOWN_MS = 60 * 1000;
const resendVerificationLastSent = new Map<string, number>();

export const register = async (req: RegisterRequest) => {
  const { username, email, password, contact, plateNumber, role } = req;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new CustomError('Invalid email format', 400);
  }

  const hashedPassword = await hashText(password);

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new CustomError('User already exists', 400);
  }

  const prismaRole = role && role.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER';
  const otp = generateOtp();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      contact,
      plateNumber,
      role: prismaRole,
      isVerified: false,
      otp,
      otpExpires,
    },
  });

  const sent = await emailService.sendVerificationEmail(email, username, otp);
  if (!sent.success) {
    await prisma.user.delete({ where: { id: user.id } });
    throw new CustomError(
      sent.error ?? 'Failed to send verification email',
      502,
    );
  }

  return user;
};

export const login = async (req: LoginRequest) => {
  const { email, password } = req;
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  if (user.isBanned) {
    throw new CustomError(
      'Your account has been banned. Please contact support.',
      403,
    );
  }

  if (!user.isVerified) {
    throw new CustomError('Please verify your email before logging in.', 401);
  }

  const isPasswordValid = await compareTextToHashedText(
    password,
    user.password,
  );

  if (!isPasswordValid) {
    throw new CustomError('Invalid email or password', 401);
  }

  const { accessToken, refreshToken } = generateTokens(
    user.id,
    user.email,
    user.username!,
    user.role,
    user.isVerified,
    user.isBanned,
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      isVerified: user.isVerified,
      isBanned: user.isBanned,
    },
  };
};

export const verifyOtp = async (req: VerifyOtpRequest) => {
  const { email, otp } = req;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  if (user.otp !== otp || (user.otpExpires && user.otpExpires < new Date())) {
    throw new CustomError('Invalid or expired OTP', 400);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      otp: null,
      otpExpires: null,
    },
  });

  return { message: 'OTP verified successfully' };
};

export const resendVerificationOtp = async (req: ResendVerificationRequest) => {
  const { email } = req;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new CustomError('Invalid email format', 400);
  }

  const lastSent = resendVerificationLastSent.get(email.toLowerCase());
  if (
    lastSent !== undefined &&
    Date.now() - lastSent < RESEND_VERIFICATION_COOLDOWN_MS
  ) {
    throw new CustomError(
      'Please wait a minute before requesting another code.',
      429,
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  if (user.isVerified) {
    throw new CustomError('This email is already verified.', 400);
  }

  const prevOtp = user.otp;
  const prevExpires = user.otpExpires;
  const otp = generateOtp();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: { otp, otpExpires },
  });

  const sent = await emailService.sendVerificationEmail(
    email,
    user.username,
    otp,
  );
  if (!sent.success) {
    await prisma.user.update({
      where: { id: user.id },
      data: { otp: prevOtp, otpExpires: prevExpires },
    });
    throw new CustomError(
      sent.error ?? 'Failed to send verification email',
      502,
    );
  }

  resendVerificationLastSent.set(email.toLowerCase(), Date.now());

  return {
    message: 'A new verification code has been sent to your email.',
  };
};

export const forgotPassword = async (req: ForgotPasswordRequest) => {
  const { email } = req;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  const otp = generateOtp();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: { otp, otpExpires },
  });

  const sent = await emailService.sendForgotPasswordEmail(
    email,
    user.username,
    otp,
  );
  if (!sent.success) {
    await prisma.user.update({
      where: { id: user.id },
      data: { otp: null, otpExpires: null },
    });
    throw new CustomError(sent.error ?? 'Failed to send reset email', 502);
  }

  return { message: 'Password reset OTP sent to your email' };
};

export const verifyPasswordResetCode = async (
  req: VerifyPasswordResetCodeRequest,
) => {
  const { email, otp } = req;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  if (user.otp !== otp || (user.otpExpires && user.otpExpires < new Date())) {
    throw new CustomError('Invalid or expired OTP', 400);
  }

  return {
    message: 'Code verified. You can now set a new password.',
  };
};

export const resetPassword = async (req: ResetPasswordRequest) => {
  const { email, otp, newPassword } = req;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  if (user.otp !== otp || (user.otpExpires && user.otpExpires < new Date())) {
    throw new CustomError('Invalid or expired OTP', 400);
  }

  const hashedPassword = await hashText(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      otp: null,
      otpExpires: null,
      isVerified: true,
    },
  });

  return { message: 'Password has been reset successfully' };
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const decoded = verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new CustomError('User not found', 404);
    }

    const tokens = generateTokens(
      user.id,
      user.email,
      user.username!,
      user.role,
      user.isVerified,
      user.isBanned,
    );

    return tokens;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Invalid or expired refresh token', 401);
  }
};
