import { VehicleType } from '@prisma/client';

export interface ParkingSlotResponse {
  id: string;
  slotNumber: string;
  vehicleType: VehicleType;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateParkingSlotInput {
  slotNumber: string;
  vehicleType: VehicleType;
  isAvailable?: boolean;
}

export interface UpdateParkingSlotInput {
  slotNumber?: string;
  vehicleType?: VehicleType;
  isAvailable?: boolean;
}
