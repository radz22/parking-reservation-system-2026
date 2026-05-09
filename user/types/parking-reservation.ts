export enum ReservationStatus {
  PENDING = 'PENDING',
  RESERVED = 'RESERVED',
  OCCUPIED = 'OCCUPIED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface ParkingReservation {
  id: string;
  userId: string;
  slotId: string;
  vehicleId: string;
  startTime: string;
  endTime?: string;
  status: ReservationStatus;
  totalPrice?: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    username: string;
    email: string;
  };
  slot?: {
    id: string;
    slotNumber: string;
    isAvailable: boolean;
    vehicleType: string;
  };
  vehicle?: {
    id: string;
    plateNumber: string;
    type: string;
  };
}

export interface ParkingReservationFilter {
  page?: number;
  limit?: number;
  search?: string;
  userId?: string;
  status?: ReservationStatus;
}

export interface CreateParkingReservationInput {
  userId: string;
  slotId: string;
  plateNumber: string;
}

export interface CreateParkingReservationResult extends ParkingReservation {
  qrCodeToken: string;
}

export interface QrCodeResponse {
  qrCode: string;
  data: ParkingReservation;
}
