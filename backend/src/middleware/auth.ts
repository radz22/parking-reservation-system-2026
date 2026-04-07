import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '@/utils/jwt';
import { CustomError } from '@/utils/custom-error';

export interface AuthenticatedUser {
  id: string;
  email: string;
  username: string;
  role: string;
  isVerified: boolean;
  isBanned: boolean;
}


declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new CustomError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new CustomError('Invalid token format', 401);
    }

    const decoded = verifyAccessToken(token);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      username: decoded.username,
      role: decoded.role,
      isVerified: decoded.isVerified,
      isBanned: decoded.isBanned,
    };


    next();
  } catch (error) {
    if (error instanceof CustomError) {
      next(error);
    } else {
      next(new CustomError('Invalid or expired token', 401));
    }
  }
};
