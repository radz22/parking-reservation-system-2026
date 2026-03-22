import { Request, Response, NextFunction } from 'express';
import { CustomError } from '@/utils/custom-error';
export const errorHandler = (
  err: CustomError | Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err instanceof CustomError ? err.statusCode : 500;

  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
  });
};
