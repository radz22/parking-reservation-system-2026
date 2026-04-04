import { ReservationStatus } from '@prisma/client';
import { PaginationParams } from './panigation-type';

export interface ParkingReservationFilter extends PaginationParams {
  userId?: string;
  slotId?: string;
  status?: ReservationStatus;
}

export interface CreateParkingReservationInput {
  userId: string;
  slotId: string;
  vehicleId: string;
  startTime: Date;
  endTime?: Date;
}

