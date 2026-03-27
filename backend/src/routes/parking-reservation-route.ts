import { Router } from 'express';
import { ParkingReservationController } from '@/controllers/parking-reservation-controller';

const parkingReservationRouter = Router();

parkingReservationRouter.get('/', ParkingReservationController.findAll);
parkingReservationRouter.get('/:id', ParkingReservationController.findById);
parkingReservationRouter.delete('/:id', ParkingReservationController.delete);
parkingReservationRouter.patch('/:id/complete', ParkingReservationController.complete);

export default parkingReservationRouter;
