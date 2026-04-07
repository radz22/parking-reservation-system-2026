import { Request, Response, NextFunction } from 'express';
import {
  register,
  login,
  refreshAccessToken,
  verifyOtp,
  resendVerificationOtp,
  forgotPassword as forgot,
  verifyPasswordResetCode,
  resetPassword as reset,
} from '@/services/auth';
import { CustomError } from '@/utils/custom-error';

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, email, password, contact, plateNumber, wheelType, role } = req.body;
    const user = await register({ username, email, password, contact, plateNumber, wheelType, role });
    if (!user) {
      throw new CustomError('Failed to register', 500);
    }
    const { password: _password, ...safeUser } = user;
    res.status(201).json(safeUser);

  } catch (error) {
    next(error);
  }
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await login({ email, password });
    if (!accessToken || !refreshToken) {
      throw new CustomError('Failed to login', 500);
    }

    res.status(200).json({ accessToken, refreshToken, user });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new CustomError('Refresh token is required', 400);
    }

    const tokens = await refreshAccessToken(refreshToken);
    res.status(200).json(tokens);
  } catch (error) {
    next(error);
  }
};

export const verify = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, otp } = req.body;
    const result = await verifyOtp({ email, otp });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const resendVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;
    const result = await resendVerificationOtp({ email });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;
    const result = await forgot({ email });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const verifyPasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, otp } = req.body;
    const result = await verifyPasswordResetCode({ email, otp });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, otp, newPassword } = req.body;
    const result = await reset({ email, otp, newPassword });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new CustomError('Authentication required', 401);
    }

    res.status(200).json({
      id: req.user.id,
      email: req.user.email,
      username: req.user.username,
      role: req.user.role,
      isVerified: req.user.isVerified,
      isBanned: req.user.isBanned
    });

  } catch (error) {
    next(error);
  }
};
