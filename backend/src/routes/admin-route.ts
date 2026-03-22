import { Router } from 'express';
import { authenticate } from '@/middleware/auth';
import { authorize } from '@/middleware/rbac';
import {
  getAdminDashboard,
  getAllUsers,
  deleteUser,
} from '@/controllers/admin-controller';

const adminRouter = Router();

adminRouter.use(authenticate);
adminRouter.use(authorize('ADMIN'));

adminRouter.get('/dashboard', getAdminDashboard);
adminRouter.get('/users', getAllUsers);
adminRouter.delete('/users/:userId', deleteUser);

export default adminRouter;
