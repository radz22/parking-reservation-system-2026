import { Router } from 'express';
import { authenticate } from '@/middleware/auth';
import { authorize } from '@/middleware/rbac';
import {
  getUserProfile,
  getUserDashboard,
} from '@/controllers/user-controller';

const userRouter = Router();

userRouter.use(authenticate);
userRouter.use(authorize('USER', 'ADMIN'));

userRouter.get('/profile', getUserProfile);
userRouter.get('/dashboard', getUserDashboard);

export default userRouter;
