import { prisma } from '@/lib/prisma';
import { ParkingReservationFilter } from '@/types/parking-reservation';
import { generateQrCodeToken, verifyQrCodeToken } from '@/utils/jwt';
import { emailService } from '@/services/email-service';

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
    const findUserReserve = await prisma.parkingReservation.findUnique({
      where: { id },
      include: {
        user: true,
        slot: true,
        vehicle: true,
      },
    });

    if (!findUserReserve) {
      throw new Error('Reservation not found');
    }
    const qrCodeToken = generateQrCodeToken(
      findUserReserve.id,
      findUserReserve.slotId,
    );

    return {
      qrCode: qrCodeToken.qrCode,
      data: findUserReserve,
    };
  }

  static async delete(id: string) {
    return prisma.parkingReservation.delete({
      where: { id },
    });
  }

  static async create(data: {
    userId: string;
    slotId: string;
    plateNumber: string;
  }) {
    const slot = await prisma.parkingSlot.findUnique({
      where: { id: data.slotId },
    });

    if (!slot) {
      throw new Error('Parking slot not found');
    }

    if (!slot.isAvailable) {
      throw new Error('Parking slot is not available');
    }

    const activeReservation = await prisma.parkingReservation.findFirst({
      where: {
        userId: data.userId,
        status: {
          in: ['PENDING', 'RESERVED', 'OCCUPIED'],
        },
      },
    });

    if (activeReservation) {
      throw new Error('User already has an active reservation');
    }

    let vehicle = await prisma.vehicle.findUnique({
      where: { plateNumber: data.plateNumber },
    });

    if (!vehicle) {
      vehicle = await prisma.vehicle.create({
        data: {
          plateNumber: data.plateNumber,
          type: slot.vehicleType,
        },
      });
    }

    const result = await prisma.$transaction(async (tx: any) => {
      const reservation = await tx.parkingReservation.create({
        data: {
          userId: data.userId,
          slotId: data.slotId,
          vehicleId: vehicle.id,
          status: 'PENDING',
        },
        include: {
          slot: true,
          vehicle: true,
          user: true,
        },
      });

      await tx.parkingSlot.update({
        where: { id: data.slotId },
        data: { isAvailable: false },
      });

      // Generate QR code for the email
      const qrCodeToken = generateQrCodeToken(reservation.id, reservation.slotId);
      
      // Send email notification asynchronously (don't block the transaction return, but actually it's better to do after transaction)
      // However, since we are inside transaction, we should be careful. 
      // I'll move it outside the transaction return.
      
      return { reservation, qrCodeToken: qrCodeToken.qrCode };
    });

    // Send email after transaction succeeds
    const qrCodeToken = generateQrCodeToken(result.reservation.id, result.reservation.slotId);
    const mail = await emailService.sendReservationEmail(
      result.reservation.user.email,
      result.reservation.user.username,
      qrCodeToken.qrCode,
      result.reservation.slot.slotNumber,
    );
    if (!mail.success) {
      console.error(
        'Reservation email failed:',
        mail.error ?? 'unknown error',
      );
    }

    return {
      ...result.reservation,
      qrCodeToken: result.qrCodeToken
    };
  }

  static async cancel(id: string) {
    const reservation = await prisma.parkingReservation.findUnique({
      where: { id },
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
        data: { status: 'CANCELLED' },
      });

      await tx.parkingSlot.update({
        where: { id: reservation.slotId },
        data: { isAvailable: true },
      });

      return updatedReservation;
    });
  }

  static async completeReservation(id: string, totalPrice: number) {
    const reservation = await prisma.parkingReservation.findUnique({
      where: { id },
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
        data: { isAvailable: true },
      });

      return updatedReservation;
    });
  }

  static async scanQrToken(token: string, mode: 'in' | 'out') {
    let payload;
    try {
      payload = verifyQrCodeToken(token);
    } catch {
      throw new Error(
        'This QR code is invalid or has expired. Ask the customer to open their latest parking pass.',
      );
    }

    const { id, slotId } = payload;

    return prisma.$transaction(async (tx) => {
      const reservation = await tx.parkingReservation.findUnique({
        where: { id },
        include: { slot: true, vehicle: true, user: true },
      });

      if (!reservation) {
        throw new Error('No reservation matches this QR code.');
      }

      if (mode === 'in') {
        if (
          reservation.status !== 'PENDING' &&
          reservation.status !== 'RESERVED'
        ) {
          throw new Error(
            `Check-in is not possible right now (status: ${reservation.status}).`,
          );
        }

        const updatedReservation = await tx.parkingReservation.update({
          where: { id },
          data: {
            status: 'OCCUPIED',
            startTime: new Date(),
          },
          include: { slot: true, vehicle: true, user: true },
        });

        await tx.parkingSlot.update({
          where: { id: slotId },
          data: { isAvailable: false },
        });

        const newQrCode = generateQrCodeToken(id, slotId, '24h');

        return {
          success: true,
          action: 'in',
          message: 'Check-in successful',
          reservation: updatedReservation,
          extendedQrCode: newQrCode.qrCode,
        };
      } else {
        if (reservation.status !== 'OCCUPIED') {
          throw new Error(
            `Check-out is not possible right now (status: ${reservation.status}).`,
          );
        }

        const startTime = reservation.startTime
          ? new Date(reservation.startTime)
          : new Date();
        const endTime = new Date();
        const diffMs = endTime.getTime() - startTime.getTime();
        const diffMinutes = Math.floor(diffMs / (1000 * 60));

        let fee = 20;

        if (diffMinutes > 180) {
          const extraMinutes = diffMinutes - 180;
          const extraHours = Math.floor(extraMinutes / 60);
          const remainingMins = extraMinutes % 60;

          fee += extraHours * 20;
          if (remainingMins > 0) {
            fee += Math.ceil(remainingMins / 30) * 10;
          }
        }

        const updatedReservation = await tx.parkingReservation.update({
          where: { id },
          data: {
            status: 'COMPLETED',
            endTime,
            totalPrice: fee,
          },
          include: { slot: true, vehicle: true, user: true },
        });

        await tx.parkingSlot.update({
          where: { id: slotId },
          data: { isAvailable: true },
        });

        return {
          success: true,
          action: 'out',
          message: 'Check-out successful',
          fee,
          reservation: updatedReservation,
        };
      }
    });
  }
}
