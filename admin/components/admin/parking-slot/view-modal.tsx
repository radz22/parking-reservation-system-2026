'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ParkingSlot } from '@/types/parking-slot';

export function ViewParkingSlotModal({
  slot,
  isOpen,
  onClose,
}: {
  slot: ParkingSlot | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!slot) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Parking Slot Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-bold">Slot Number</Label>
            <div className="col-span-3">{slot.slotNumber}</div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-bold">Vehicle Type</Label>
            <div className="col-span-3">
              <Badge variant="outline" className="capitalize">
                {slot.vehicleType.toLowerCase().replace('_', ' ')}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-bold">Status</Label>
            <div className="col-span-3">
              <Badge variant={slot.isAvailable ? 'default' : 'destructive'}>
                {slot.isAvailable ? 'Available' : 'Occupied'}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-bold">Created At</Label>
            <div className="col-span-3">
              {format(new Date(slot.createdAt), 'PPP p')}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-bold">Updated At</Label>
            <div className="col-span-3">
              {format(new Date(slot.updatedAt), 'PPP p')}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
