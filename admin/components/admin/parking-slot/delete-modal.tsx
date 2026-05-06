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
import type { UseMutationResult } from '@tanstack/react-query';
import { ParkingSlot } from '@/types/parking-slot';
import { Loader2 } from 'lucide-react';

export function DeleteParkingSlotModal({
  slot,
  isOpen,
  onClose,
  deleteMutation,
}: {
  slot: ParkingSlot | null;
  isOpen: boolean;
  onClose: () => void;
  deleteMutation: UseMutationResult<void, Error, string, unknown>;
}) {
  const handleDelete = () => {
    if (slot) {
      deleteMutation.mutate(slot.id);
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
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Slot'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
