import apiClient from '@/lib/api-client';
import {
  CreateParkingSlotInput,
  ParkingSlot,
  ParkingSlotResponse,
  UpdateParkingSlotInput,
} from '@/types/parking-slot';

export const parkingSlotService = {
  create: async (data: CreateParkingSlotInput): Promise<ParkingSlot> => {
    const response = await apiClient.post<ParkingSlot>('/api/parking-slots', data);
    return response.data;
  },

  findAll: async (page = 1, limit = 10, search = ''): Promise<ParkingSlotResponse> => {
    const response = await apiClient.get<ParkingSlotResponse>('/api/parking-slots', {
      params: { page, limit, search },
    });
    return response.data;
  },

  findById: async (id: string): Promise<ParkingSlot> => {
    const response = await apiClient.get<ParkingSlot>(`/api/parking-slots/${id}`);
    return response.data;
  },

  update: async (id: string, data: UpdateParkingSlotInput): Promise<ParkingSlot> => {
    const response = await apiClient.put<ParkingSlot>(`/api/parking-slots/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/parking-slots/${id}`);
  },
};
