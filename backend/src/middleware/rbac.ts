import { Request, Response, NextFunction } from 'express';
import { CustomError } from '@/utils/custom-error';
import { Role } from '@/types/auth';

export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new CustomError('Authentication required', 401));
    }

    const userRole = req.user.role as Role;

    if (!allowedRoles.includes(userRole)) {
      return next(
        new CustomError(
          'Access denied. You do not have permission to access this resource.',
          403
        )
      );
    }

    next();
  };
};
