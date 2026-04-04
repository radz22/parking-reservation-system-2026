import { Router } from 'express';
import { ParkingSlotController } from '@/controllers/parking-slot-controller';
import { authenticate } from '@/middleware/auth';
import { authorize } from '@/middleware/rbac';

const parkingSlotRouter = Router();

parkingSlotRouter.use(authenticate);
parkingSlotRouter.use(authorize('USER', 'ADMIN'));

// Publicly accessible for authenticated users
parkingSlotRouter.get('/', ParkingSlotController.findAll);
parkingSlotRouter.get('/:id', ParkingSlotController.findById);

// Restricted to ADMIN
parkingSlotRouter.post('/', ParkingSlotController.create);
parkingSlotRouter.put('/:id', ParkingSlotController.update);
parkingSlotRouter.delete('/:id', ParkingSlotController.delete);

export default parkingSlotRouter;
