import { Request, Response, NextFunction } from 'express';
import { prisma } from '@/lib/prisma';
import { CustomError } from '@/utils/custom-error';

export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new CustomError('Authentication required', 401);
    }


    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });


    if (!user) {
      throw new CustomError('User not found', 404);
    }

    res.status(200).json({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new CustomError('Authentication required', 401);
    }

    res.status(200).json({
      message: `Welcome to your dashboard, ${req.user.username}!`,
      user: {
        id: req.user.id,
        email: req.user.email,
        username: req.user.username,
        role: req.user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
