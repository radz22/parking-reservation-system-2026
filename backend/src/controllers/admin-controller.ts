import { Request, Response, NextFunction } from 'express';
import { prisma } from '@/lib/prisma';
import { CustomError } from '@/utils/custom-error';

export const getAdminDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new CustomError('Authentication required', 401);
    }


    const totalUsers = await prisma.user.count();
    const totalAdmins = await prisma.user.count({
      where: { role: 'ADMIN' },
    });
    const totalRegularUsers = await prisma.user.count({
      where: { role: 'USER' },
    });

    res.status(200).json({
      message: `Welcome to the admin dashboard, ${req.user.username}!`,
      stats: {
        totalUsers,
        totalAdmins,
        totalRegularUsers,
      },
      admin: {
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

export const getAllUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new CustomError('User not found', 404);
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

