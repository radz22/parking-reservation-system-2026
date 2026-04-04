import { Router } from 'express';
import { authenticate } from '@/middleware/auth';
import { authorize } from '@/middleware/rbac';
import {
  getUserProfileById,
  getUserDashboard,
  updateUser,
} from '@/controllers/user-controller';

const userRouter = Router();

userRouter.use(authenticate);
userRouter.use(authorize('USER', 'ADMIN'));

userRouter.get('/profile/:id', getUserProfileById);
userRouter.put('/profile/:id', updateUser);

userRouter.get('/dashboard', getUserDashboard);

export default userRouter;
