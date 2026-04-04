import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { ParkingReservationFilter } from '@/types/parking-reservation';

export class ParkingReservationService {
  static async findAll(params: ParkingReservationFilter) {
    const { page = 1, limit = 10, search = '', userId, status } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.ParkingReservationWhereInput = {};

    
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

  static async create(data: { userId: string; slotId: string; plateNumber: string; startTime: Date; endTime?: Date }) {
    // 1. Check if the slot is available
    const slot = await prisma.parkingSlot.findUnique({
      where: { id: data.slotId }
    });

    if (!slot) {
      throw new Error('Parking slot not found');
    }

    if (!slot.isAvailable) {
      throw new Error('Parking slot is not available');
    }

    // 2. Check if user already has an active reservation
    const activeReservation = await prisma.parkingReservation.findFirst({
      where: {
        userId: data.userId,
        status: {
          in: ['PENDING', 'RESERVED', 'OCCUPIED'],
        },
      }
    });

    if (activeReservation) {
      throw new Error('User already has an active reservation');
    }

    // 3. Ensure vehicle exists
    let vehicle = await prisma.vehicle.findUnique({
      where: { plateNumber: data.plateNumber }
    });

    if (!vehicle) {
      vehicle = await prisma.vehicle.create({
        data: {
          plateNumber: data.plateNumber,
          type: slot.vehicleType, // Assume vehicle type matches slot type for initial creation
        }
      });
    }

    // 4. Create reservation and update slot availability in a transaction
    return prisma.$transaction(async (tx) => {
      const reservation = await tx.parkingReservation.create({
        data: {
          userId: data.userId,
          slotId: data.slotId,
          vehicleId: vehicle.id,
          startTime: data.startTime,
          endTime: data.endTime,
          status: 'PENDING'
        },
        include: {
          slot: true,
          vehicle: true,
          user: true
        }
      });

      await tx.parkingSlot.update({
        where: { id: data.slotId },
        data: { isAvailable: false }
      });

      return reservation;
    });
  }

  static async cancel(id: string) {
    const reservation = await prisma.parkingReservation.findUnique({
      where: { id }
    });

    if (!reservation) {
      throw new Error('Reservation not found');
    }

    if (reservation.status !== 'RESERVED' && reservation.status !== 'PENDING') {
      throw new Error('Only PENDING or RESERVED reservations can be cancelled');
    }

    return prisma.$transaction(async (tx) => {
      const updatedReservation = await tx.parkingReservation.update({
        where: { id },
        data: { status: 'CANCELLED' }
      });

      await tx.parkingSlot.update({
        where: { id: reservation.slotId },
        data: { isAvailable: true }
      });

      return updatedReservation;
    });
  }

  // Add a method to mark as completed and set totalPrice
  static async completeReservation(id: string, totalPrice: number) {
    const reservation = await prisma.parkingReservation.findUnique({
      where: { id }
    });

    if (!reservation) {
      throw new Error('Reservation not found');
    }

    return prisma.$transaction(async (tx) => {
      const updatedReservation = await tx.parkingReservation.update({
        where: { id },
        data: {
          status: 'COMPLETED',
          endTime: new Date(),
          totalPrice,
        },
      });

      await tx.parkingSlot.update({
        where: { id: reservation.slotId },
        data: { isAvailable: true }
      });

      return updatedReservation;
    });
  }
}
