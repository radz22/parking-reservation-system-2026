'use client';
import { useState, type ElementType, type ReactNode } from 'react';
import { useParkingReservation } from '@/hooks/parking-reservation/use-parking-reservation';
import { HistoryTable } from './history-table';
import { Button } from '@/components/ui/button';
import {
  RefreshCw,
  Car,
  User,
  MapPin,
  Calendar,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Trash2,
  PhilippinePeso,
} from 'lucide-react';
import { ParkingReservation } from '@/types/parking-reservation';
import { SearchField } from '@/components/ui/search';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface DetailItemProps {
  icon: ElementType;
  label: string;
  value: string | ReactNode;
  color?: string;
}

function DetailItem({
  icon: Icon,
  label,
  value,
  color = 'text-gray-500',
}: DetailItemProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/50 border border-gray-100">
      <div className={`p-2 rounded-lg bg-white shadow-sm ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
          {label}
        </div>
        <div className="text-sm font-semibold text-gray-900">{value}</div>
      </div>
    </div>
  );
}

export function History() {
  const {
    reservations,
    isLoading,
    isFetching,
    currentPage,
    handlePageChange,
    searchQuery,
    setSearchQuery,
    total,
    totalPages,
    deleteMutation,
    completeMutation,
    refresh,
  } = useParkingReservation();

  const [selectedRes, setSelectedRes] = useState<ParkingReservation | null>(
    null,
  );
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [resToDelete, setResToDelete] = useState<ParkingReservation | null>(
    null,
  );

  const handleDelete = async () => {
    if (resToDelete) {
      try {
        await deleteMutation.mutateAsync(resToDelete.id);
        toast.success('Reservation record deleted successfully');
        setResToDelete(null);
      } catch {
        toast.error('Failed to delete reservation');
      }
    }
  };

  const handleView = (res: ParkingReservation) => {
    setSelectedRes(res);
    setIsViewOpen(true);
  };

  const handleComplete = (res: ParkingReservation) => {
    const price = prompt('Enter total price for this reservation:');
    if (price && !isNaN(parseFloat(price))) {
      completeMutation.mutate({ id: res.id, totalPrice: parseFloat(price) });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-3 w-full max-w-sm">
          <SearchField
            placeholder="Search by user, plate, or slot..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => refresh()}
            disabled={isFetching}
            className="rounded-xl h-10 px-4"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      <HistoryTable
        reservations={reservations}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        onPageChange={handlePageChange}
        handleDelete={(res) => setResToDelete(res)}
        handleView={handleView}
        handleComplete={handleComplete}
      />

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-md rounded-2xl border-none shadow-2xl p-0 overflow-hidden">
          <DialogHeader className="p-6 bg-gray-900 text-white">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Reservation Details
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Detailed information for reservation ID:{' '}
              {selectedRes?.id.split('-')[0]}...
            </DialogDescription>
          </DialogHeader>

          {selectedRes && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <DetailItem
                  icon={User}
                  label="User"
                  value={selectedRes.user?.username || 'N/A'}
                  color="text-blue-600"
                />
                <DetailItem
                  icon={Car}
                  label="Plate Number"
                  value={selectedRes.vehicle?.plateNumber || 'N/A'}
                  color="text-indigo-600"
                />
                <DetailItem
                  icon={MapPin}
                  label="Slot Number"
                  value={selectedRes.slot?.slotNumber || 'N/A'}
                  color="text-orange-600"
                />
                <DetailItem
                  icon={ShieldAlert}
                  label="Status"
                  value={
                    <Badge className="rounded-lg">{selectedRes.status}</Badge>
                  }
                  color="text-emerald-600"
                />
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">
                  Timeline
                </h4>
                <div className="space-y-4 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-9 h-9 rounded-full bg-blue-50 border-2 border-white shadow-sm flex items-center justify-center">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">
                        Check-In Time
                      </div>
                      <div className="text-sm font-bold">
                        {selectedRes.startTime
                          ? format(
                              new Date(selectedRes.startTime),
                              'MMMM d, yyyy HH:mm',
                            )
                          : 'Not Checked In'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-9 h-9 rounded-full bg-emerald-50 border-2 border-white shadow-sm flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">
                        Check-Out Time
                      </div>
                      <div className="text-sm font-bold">
                        {selectedRes.endTime
                          ? format(
                              new Date(selectedRes.endTime),
                              'MMMM d, yyyy HH:mm',
                            )
                          : '-'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                    <PhilippinePeso className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-400">
                      Total Price
                    </div>
                    <div className="text-xl font-black text-gray-900">
                      {selectedRes.totalPrice
                        ? `₱${selectedRes.totalPrice.toFixed(2)}`
                        : '₱0.00'}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setIsViewOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!resToDelete}
        onOpenChange={(open) => !open && setResToDelete(null)}
      >
        <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-rose-600">
              <Trash2 className="w-5 h-5" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Are you sure you want to delete this reservation record for{' '}
              <b>{resToDelete?.user?.username}</b>? This action cannot be undone
              and will permanently remove the record from history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl border-gray-200">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-100"
            >
              Delete Record
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
