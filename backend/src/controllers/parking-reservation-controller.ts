import { Request, Response, NextFunction } from 'express';
import { ReservationStatus } from '@prisma/client';
import { ParkingReservationService } from '@/services/parking-reservation-service';

export class ParkingReservationController {
  static async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search, userId, status } = req.query;
      const result = await ParkingReservationService.findAll({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: search as string,
        userId: userId as string,
        status: status as ReservationStatus,
      });

      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  static async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await ParkingReservationService.findById(id);
      if (!result) {
        return res.status(404).json({ message: 'Reservation not found' });
      }
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await ParkingReservationService.delete(id);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }

  static async complete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { totalPrice } = req.body;
      const result = await ParkingReservationService.completeReservation(
        id,
        totalPrice,
      );
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ParkingReservationService.create(req.body);
      return res.status(201).json(result);
    } catch (error) {
      return next(error);
    }
  }

  static async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await ParkingReservationService.cancel(id);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  static async scan(req: Request, res: Response) {
    try {
      const { token, mode } = req.body;
      if (!token || !mode) {
        return res
          .status(400)
          .json({ success: false, message: 'Missing token or mode' });
      }
      const result = await ParkingReservationService.scanQrToken(token, mode);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'QR Scan failed',
      });
    }
  }
}
