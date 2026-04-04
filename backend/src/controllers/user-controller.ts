import { Request, Response, NextFunction } from 'express';
import { prisma } from '@/lib/prisma';
import { CustomError } from '@/utils/custom-error';

export const getUserProfileById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.params.id;

    if (!userId) {
      throw new CustomError('User ID is required', 400);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new CustomError('User not found', 404);
    }

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      plateNumber: user.plateNumber,
      contact: user.contact,
      createdAt: user.createdAt,
    });
  } catch (error) {
    next(error);
  }
};
export const getUserDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction,
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

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new CustomError('Authentication required', 401);
    }

    const userId = req.user.id;
    const { username, email, contact, plateNumber } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        email,
        contact,
        plateNumber,
      },
    });

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
