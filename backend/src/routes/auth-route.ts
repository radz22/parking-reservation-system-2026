import { Router } from 'express';
import { signin, signup, refresh, getMe } from '@/controllers/auth-controller';
import { authenticate } from '@/middleware/auth';

const authRouter = Router();

authRouter.post('/register', signup);
authRouter.post('/login', signin);
authRouter.post('/refresh', refresh);
authRouter.get('/me', authenticate, getMe);

export default authRouter;
