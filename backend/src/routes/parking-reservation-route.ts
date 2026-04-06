import { Router } from 'express';
import { ParkingReservationController } from '@/controllers/parking-reservation-controller';
import { authenticate } from '@/middleware/auth';
import { authorize } from '@/middleware/rbac';

const parkingReservationRouter = Router();

parkingReservationRouter.use(authenticate);
parkingReservationRouter.use(authorize('USER', 'ADMIN'));

parkingReservationRouter.get('/', ParkingReservationController.findAll);
parkingReservationRouter.get('/:id', ParkingReservationController.findById);
parkingReservationRouter.post('/', ParkingReservationController.create);
parkingReservationRouter.patch(
  '/:id/cancel',
  ParkingReservationController.cancel,
);
parkingReservationRouter.delete('/:id', ParkingReservationController.delete);
parkingReservationRouter.patch(
  '/:id/complete',
  ParkingReservationController.complete,
);
parkingReservationRouter.post('/scan', ParkingReservationController.scan);

export default parkingReservationRouter;
