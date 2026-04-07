import { Router } from 'express';
import {
  signin,
  signup,
  refresh,
  getMe,
  verify,
  resendVerification,
  forgotPassword,
  verifyPasswordReset,
  resetPassword,
} from '@/controllers/auth-controller';
import { authenticate } from '@/middleware/auth';

const authRouter = Router();

authRouter.post('/register', signup);
authRouter.post('/login', signin);
authRouter.post('/refresh', refresh);
authRouter.get('/me', authenticate, getMe);
authRouter.post('/verify', verify);
authRouter.post('/resend-verification', resendVerification);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/verify-password-reset', verifyPasswordReset);
authRouter.post('/reset-password', resetPassword);

export default authRouter;
