import apiClient from '@/lib/api';
import {
  ParkingSlot,
  ParkingSlotFilter,
  CreateParkingSlotInput,
  UpdateParkingSlotInput,
} from '@/types/parking-slot';
import { Pagination } from '@/types/panigation';
export const parkingSlotService = {
  async getAll(
    params?: ParkingSlotFilter,
  ): Promise<{ items: ParkingSlot[]; pagination: Pagination }> {
    const response = await apiClient.get('/api/parking-slots', { params });
    return response.data;
  },

  async getById(id: string): Promise<ParkingSlot> {
    const response = await apiClient.get(`/api/parking-slots/${id}`);
    return response.data;
  },

  async create(data: CreateParkingSlotInput): Promise<ParkingSlot> {
    const response = await apiClient.post('/api/parking-slots', data);
    return response.data;
  },

  async update(id: string, data: UpdateParkingSlotInput): Promise<ParkingSlot> {
    const response = await apiClient.patch(`/api/parking-slots/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/parking-slots/${id}`);
  },
};
