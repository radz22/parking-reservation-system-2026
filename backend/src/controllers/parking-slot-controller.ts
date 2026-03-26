import { Request, Response, NextFunction } from 'express';
import { ParkingSlotService } from '@/services/parking-slot-service';
import { CreateParkingSlotInput, UpdateParkingSlotInput } from '@/types/parking-slot';

export class ParkingSlotController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data: CreateParkingSlotInput = req.body;
      const result = await ParkingSlotService.create(data);
      return res.status(201).json(result);
    } catch (error) {
      return next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data: UpdateParkingSlotInput = req.body;
      const result = await ParkingSlotService.update(id, data);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await ParkingSlotService.delete(id);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }

  static async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await ParkingSlotService.findById(id);
      if (!result) {
        return res.status(404).json({ message: 'Parking slot not found' });
      }
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  static async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search } = req.query;
      const result = await ParkingSlotService.findAll({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: search as string,
      });
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }
}
