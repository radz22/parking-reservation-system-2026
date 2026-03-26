export type VehicleType = 'TWO_WHEEL' | 'FOUR_WHEEL';

export interface ParkingSlot {
  id: string;
  slotNumber: string;
  vehicleType: VehicleType;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateParkingSlotInput {
  slotNumber: string;
  vehicleType: VehicleType;
  isAvailable: boolean;
}

export interface UpdateParkingSlotInput {
  slotNumber?: string;
  vehicleType?: VehicleType;
  isAvailable?: boolean;
}

export interface ParkingSlotResponse {
  items: ParkingSlot[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
