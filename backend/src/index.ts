import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from '@/middleware/error-handler';
import authRouter from '@/routes/auth-route';
import userRouter from '@/routes/user-route';
import adminRouter from '@/routes/admin-route';
import parkingSlotRouter from '@/routes/parking-slot-route';
import parkingReservationRouter from '@/routes/parking-reservation-route';

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, origin || true);
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/parking-slots', parkingSlotRouter);
app.use('/api/parking-reservations', parkingReservationRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening: http://localhost:${port}`);
});
