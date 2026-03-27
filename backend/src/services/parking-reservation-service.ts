import { prisma } from '@/lib/prisma';
import { ParkingReservationFilter } from '@/types/parking-reservation';

export class ParkingReservationService {
  static async findAll(params: ParkingReservationFilter) {
    const { page = 1, limit = 10, search = '', userId, status } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (userId) {
      where.userId = userId;
    }
    
    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        {
          user: {
            username: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          vehicle: {
            plateNumber: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          slot: {
            slotNumber: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.parkingReservation.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
          slot: true,
          vehicle: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.parkingReservation.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async findById(id: string) {
    return prisma.parkingReservation.findUnique({
      where: { id },
      include: {
        user: true,
        slot: true,
        vehicle: true,
      },
    });
  }

  static async delete(id: string) {
     return prisma.parkingReservation.delete({
        where: { id }
     })
  }

  // Add a method to mark as completed and set totalPrice
  static async completeReservation(id: string, totalPrice: number) {
    return prisma.parkingReservation.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        endTime: new Date(),
        totalPrice,
      },
    });
  }
}
