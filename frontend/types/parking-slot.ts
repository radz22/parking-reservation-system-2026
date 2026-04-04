export enum VehicleType {
  TWO_WHEEL = 'TWO_WHEEL',
  FOUR_WHEEL = 'FOUR_WHEEL',
}

export interface ParkingSlot {
  id: string;
  slotNumber: string;
  isAvailable: boolean;
  vehicleType: VehicleType;
  createdAt: string;
  updatedAt: string;
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

export interface ParkingSlotFilter {
  page?: number;
  limit?: number;
  search?: string;
}
