import { ParkingSlot } from './parking-slot';

export type ReservationStatus = 'RESERVED' | 'OCCUPIED' | 'COMPLETED' | 'CANCELLED';

export interface ParkingReservation {
  id: string;
  slotId: string;
  vehicleId: string;
  userId: string;
  startTime: string;
  endTime: string | null;
  status: ReservationStatus;
  totalPrice?: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    username: string;
    email: string;
  };
  slot?: ParkingSlot;
  vehicle?: {
    id: string;
    plateNumber: string;
    type: string;
  };
}

export interface ParkingReservationResponse {
  items: ParkingReservation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
