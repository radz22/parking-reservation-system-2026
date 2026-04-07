import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
  CreateParkingSlotInput,
  UpdateParkingSlotInput,
} from '@/types/parking-slot';
import { PaginationParams } from '@/types/panigation-type';

export class ParkingSlotService {
  static async create(data: CreateParkingSlotInput) {
    return prisma.parkingSlot.create({
      data,
    });
  }

  static async update(id: string, data: UpdateParkingSlotInput) {
    return prisma.parkingSlot.update({
      where: { id },
      data,
    });
  }
  static async delete(id: string) {
    try {
      const result = await prisma.$transaction(async (tx) => {
        await tx.parkingReservation.deleteMany({
          where: { slotId: id },
        });

        const deletedSlot = await tx.parkingSlot.delete({
          where: { id },
        });

        return deletedSlot;
      });

      return result;
    } catch (error) {
      console.error('Error deleting parking slot:', error);
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to delete parking slot',
      );
    }
  }
  static async findById(id: string) {
    return prisma.parkingSlot.findUnique({
      where: { id },
    });
  }

  static async findAll(params: PaginationParams) {
    const { page = 1, limit = 10, search = '' } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.ParkingSlotWhereInput = search
      ? {
          OR: [
            {
              slotNumber: {
                contains: search,
                mode: 'insensitive' as const,
              },
            },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      prisma.parkingSlot.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          slotNumber: 'asc',
        },
      }),
      prisma.parkingSlot.count({ where }),
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
}
