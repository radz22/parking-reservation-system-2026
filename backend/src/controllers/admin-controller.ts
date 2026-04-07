import { Request, Response, NextFunction } from 'express';
import { prisma } from '@/lib/prisma';
import { CustomError } from '@/utils/custom-error';
import { Prisma } from '@prisma/client';

export const getAdminDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new CustomError('Authentication required', 401);
    }

    const [
      totalUsers,
      totalSlots,
      activeReservations,
      availableSlots,
      totalCompleted,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.parkingSlot.count(),
      prisma.parkingReservation.count({
        where: { status: { in: ['RESERVED', 'OCCUPIED', 'PENDING'] } },
      }),
      prisma.parkingSlot.count({ where: { isAvailable: true } }),
      prisma.parkingReservation.count({ where: { status: 'COMPLETED' } }),
    ]);

    res.status(200).json({
      message: `Welcome to the admin dashboard, ${req.user.username}!`,
      stats: {
        totalUsers,
        totalSlots,
        activeReservations,
        availableSlots,
        totalCompleted,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where = {
      role: {
        not: 'ADMIN', // ❌ exclude admin
      },
      ...(search && {
        OR: [
          {
            username: {
              contains: String(search),
              mode: 'insensitive' as const,
            },
          },
          {
            email: {
              contains: String(search),
              mode: 'insensitive' as const,
            },
          },
        ],
      }),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          role: {
            not: 'ADMIN',
          },
        },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          isVerified: true,
          isBanned: true,
          createdAt: true,
          contact: true,
          plateNumber: true,
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where: where as Prisma.UserWhereInput }),
    ]);

    res.status(200).json({
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};
export const toggleBanUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { isBanned } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new CustomError('User not found', 404);
    }

    if (user.role === 'ADMIN') {
      throw new CustomError('Cannot ban an admin', 400);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isBanned: Boolean(isBanned) },
      select: { id: true, isBanned: true, username: true },
    });

    res.status(200).json({
      message: `User ${updatedUser.username} has been ${updatedUser.isBanned ? 'banned' : 'unbanned'}.`,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
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
