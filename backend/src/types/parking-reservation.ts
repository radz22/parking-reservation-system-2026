import { PaginationParams } from './panigation-type';

export interface ParkingReservationFilter extends PaginationParams {
  userId?: string;
  slotId?: string;
  status?: string;
}
