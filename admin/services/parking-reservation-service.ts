import apiClient from '@/lib/api-client';
import {
  ParkingReservation,
  ParkingReservationResponse,
} from '@/types/parking-reservation';

export const parkingReservationService = {
  findAll: async (page = 1, limit = 10, search = ''): Promise<ParkingReservationResponse> => {
    const response = await apiClient.get<ParkingReservationResponse>('/api/parking-reservations', {
      params: { page, limit, search },
    });
    return response.data;
  },

  findById: async (id: string): Promise<ParkingReservation> => {
    const response = await apiClient.get<ParkingReservation>(`/api/parking-reservations/${id}`);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/parking-reservations/${id}`);
  },

  complete: async (id: string, totalPrice: number): Promise<ParkingReservation> => {
    const response = await apiClient.patch<ParkingReservation>(`/api/parking-reservations/${id}/complete`, { totalPrice });
    return response.data;
  },
};
