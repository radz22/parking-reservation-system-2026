'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { parkingSlotService } from '@/services/parking-slot-service';
import { ParkingSlot } from '@/types/parking-slot';

export function DeleteParkingSlotModal({
  slot,
  isOpen,
  onClose,
  onSuccess,
}: {
  slot: ParkingSlot | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => parkingSlotService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parking-slots'] });
      onSuccess();
      onClose();
    },
  });

  const handleDelete = () => {
    if (slot) {
      mutation.mutate(slot.id);
    }
  };

  if (!slot) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Parking Slot</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete parking slot{' '}
            <span className="font-bold text-black">{slot.slotNumber}</span>? 
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Deleting...' : 'Delete Slot'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
