import apiClient from '@/lib/api';
import {
  ParkingReservation,
  ParkingReservationFilter,
  CreateParkingReservationInput,
  CreateParkingReservationResult,
  QrCodeResponse,
} from '@/types/parking-reservation';
import { Pagination } from '@/types/panigation';

export const parkingReservationService = {
  async getAll(
    params?: ParkingReservationFilter,
  ): Promise<{ items: ParkingReservation[]; pagination: Pagination }> {
    const response = await apiClient.get('/api/parking-reservations', {
      params,
    });
    return response.data;
  },

  async getById(id: string): Promise<QrCodeResponse> {
    const response = await apiClient.get(`/api/parking-reservations/${id}`);
    return response.data;
  },

  async create(
    data: CreateParkingReservationInput,
  ): Promise<CreateParkingReservationResult> {
    const response = await apiClient.post('/api/parking-reservations', data);
    return response.data;
  },

  async cancel(id: string): Promise<ParkingReservation> {
    const response = await apiClient.patch(
      `/api/parking-reservations/${id}/cancel`,
    );
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/parking-reservations/${id}`);
  },
};
