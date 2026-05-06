'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { UseMutationResult } from '@tanstack/react-query';
import { CreateParkingSlotInput, ParkingSlot } from '@/types/parking-slot';
import { Loader2 } from 'lucide-react';

const schema = z.object({
  slotNumber: z.string().min(1, 'Slot number is required'),
  vehicleType: z.enum(['TWO_WHEEL', 'FOUR_WHEEL']),
  isAvailable: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

export function CreateParkingSlotModal({
  isOpen,
  onClose,
  createMutation,
}: {
  isOpen: boolean;
  onClose: () => void;
  createMutation: UseMutationResult<
    ParkingSlot,
    Error,
    CreateParkingSlotInput,
    unknown
  >;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      isAvailable: true,
      vehicleType: 'FOUR_WHEEL',
    },
  });

  const onSubmit = (data: FormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Parking Slot</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="slotNumber">Slot Number</Label>
            <Input
              id="slotNumber"
              placeholder="e.g. A-01"
              {...register('slotNumber')}
            />
            {errors.slotNumber && (
              <p className="text-sm text-red-500">{errors.slotNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleType">Vehicle Type</Label>
            <select
              id="vehicleType"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...register('vehicleType')}
            >
              <option value="TWO_WHEEL">Two Wheel</option>
              <option value="FOUR_WHEEL">Four Wheel</option>
            </select>
            {errors.vehicleType && (
              <p className="text-sm text-red-500">{errors.vehicleType.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isAvailable"
              className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              {...register('isAvailable')}
            />
            <Label htmlFor="isAvailable">Is Available</Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Slot'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
