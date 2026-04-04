'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, Motorbike, Car, Loader2 } from 'lucide-react';
import { Navigation } from './navigation';
import { useProfile } from '@/hooks/use-profile';
import { parkingSlotService } from '@/services/parking-slot-service';
import { parkingReservationService } from '@/services/parking-reservation-service';
import { ParkingSlot } from '@/types/parking-slot';
import { toast } from 'sonner';
import { ReservationStatus } from '@/types/parking-reservation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface Slot {
  id: string;
  slotNumber: string;
  status: 'available' | 'reserve' | 'occupied';
  type: '2-wheel' | '4-wheel';
  icon: 'motorbike' | 'car';
}

export const ParkingReservation = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [hasActiveReservation, setHasActiveReservation] = useState(false);
  const [isReserving, setIsReserving] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const { profile } = useProfile();

  const fetchSlots = useCallback(async () => {
    try {
      setLoading(true);
      const data = await parkingSlotService.getAll({ limit: 100 });
      const mappedSlots: Slot[] = data.items.map((item: ParkingSlot) => ({
        id: item.id,
        slotNumber: item.slotNumber,
        status: item.isAvailable ? 'available' : 'occupied',
        type: item.vehicleType === 'TWO_WHEEL' ? '2-wheel' : '4-wheel',
        icon: item.vehicleType === 'TWO_WHEEL' ? 'motorbike' : 'car',
      }));
      setSlots(mappedSlots);

      if (profile?.id) {
        const reservations = await parkingReservationService.getAll({
          userId: profile.id,
          status: 'RESERVED' as ReservationStatus,
        });
        setHasActiveReservation(reservations.items.length > 0);
      }
    } catch (error) {
      console.error('Failed to fetch slots:', error);
      toast.error('Failed to load parking slots');
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const filteredSlots = useMemo(() => {
    return slots.filter((slot) => {
      const matchesSearch = slot.slotNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType = selectedType === '' || slot.type === selectedType;
      const matchesStatus =
        selectedStatus === '' || slot.status === selectedStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [slots, searchQuery, selectedType, selectedStatus]);

  const availableCount = slots.filter((s) => s.status === 'available').length;

  const handleStatusFilter = (status: string) => {
    setSelectedStatus((prev) => (prev === status ? '' : status));
  };

  const handleSlotClick = (slot: Slot) => {
    if (hasActiveReservation) {
      toast.warning(
        'You already have an active reservation. Please cancel it first in your dashboard.',
      );
      return;
    }

    if (slot.status !== 'available') {
      toast.error(`This slot is already ${slot.status}.`);
      return;
    }

    if (!profile?.plateNumber) {
      toast.error('Please set your Plate Number in your profile first.');
      return;
    }

    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  const handleReserveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !profile?.id || !profile.plateNumber) return;

    try {
      setIsReserving(true);
      await parkingReservationService.create({
        userId: profile.id,
        slotId: selectedSlot.id,
        plateNumber: profile.plateNumber,
        startTime: new Date(),
      });

      toast.success(
        `Slot Number ${selectedSlot.slotNumber} reserved successfully!`,
      );
      setIsModalOpen(false);
      fetchSlots(); // Refresh slots
    } catch (error: unknown) {
      console.error('Reservation failed:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create reservation';
      toast.error(errorMessage);
    } finally {
      setIsReserving(false);
    }
  };

  return (
    <div className="bg-body min-h-screen dark:bg-[#121212]">
      <Navigation />

      <section
        id="reservation-header"
        className="container-1 pt-35 px-4 md:px-0"
      >
        <div className="flex flex-col md:flex-row md:justify-between">
          <div>
            <h1 className="text-4xl text-text font-semibold mb-3 dark:text-white">
              Reserve Parking Space
            </h1>
            <p className="text-lg text-text/70 font-semibold dark:text-gray-400">
              Find and reserve an available parking space
            </p>
          </div>
        </div>

        <div className="bg-primary p-6 my-10 rounded-2xl dark:bg-[#1e1e1e] shadow-sm">
          <h2 className="px-2 font-bold text-text text-2xl mb-5 dark:text-white">
            {loading ? '---' : availableCount} Available Spaces
          </h2>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search by Slot Number..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#2a2a2a] dark:text-white border border-transparent focus:border-secondary rounded-xl outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative flex-1">
              <select
                className="w-full pl-5 pr-10 py-3 bg-gray-50 dark:bg-[#2a2a2a] dark:text-white border border-transparent focus:border-secondary rounded-xl outline-none appearance-none cursor-pointer"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">( All Vehicle Types )</option>
                <option value="2-wheel">2-Wheel</option>
                <option value="4-wheel">4-Wheel</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Legend & Grid Section */}
      <section id="reserve-legend" className="mt-10">
        <div className="bg-primary dark:bg-[#121212] py-10">
          <div className="container-1 px-4 md:px-0">
            <div className="flex flex-col md:flex-row md:justify-between items-center mb-10">
              <h2 className="text-text text-2xl font-semibold dark:text-white">
                Parking Spaces:
              </h2>
              <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
                <button
                  onClick={() => handleStatusFilter('')}
                  className={`px-5 py-2 rounded-3xl font-semibold transition ${selectedStatus === '' ? 'bg-secondary text-white' : 'bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}
                >
                  All
                </button>
                <button
                  onClick={() => handleStatusFilter('available')}
                  className={`px-5 py-2 rounded-3xl font-semibold transition ${selectedStatus === 'available' ? 'bg-green-500 text-white' : 'bg-green-100 dark:bg-green-900/30 text-green-600'}`}
                >
                  Available
                </button>
                <button
                  onClick={() => handleStatusFilter('reserve')}
                  className={`px-5 py-2 rounded-3xl font-semibold transition ${selectedStatus === 'reserve' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600'}`}
                >
                  Reserved
                </button>
                <button
                  onClick={() => handleStatusFilter('occupied')}
                  className={`px-5 py-2 rounded-3xl font-semibold transition ${selectedStatus === 'occupied' ? 'bg-red-500 text-white' : 'bg-red-100 dark:bg-red-900/30 text-red-600'}`}
                >
                  Occupied
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-secondary" size={48} />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {filteredSlots.length > 0 ? (
                  filteredSlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => handleSlotClick(slot)}
                      className={`text-left rounded-2xl p-6 transition-all hover:scale-[1.02] shadow-sm ${
                        slot.status === 'available'
                          ? 'bg-green-50 dark:bg-green-900/10 border border-green-200'
                          : slot.status === 'reserve'
                            ? 'bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200'
                            : 'bg-red-50 dark:bg-red-900/10 border border-red-200 opacity-80 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className="font-bold text-lg dark:text-white">
                          {slot.slotNumber}
                        </span>
                        {slot.icon === 'motorbike' ? (
                          <Motorbike size={20} className="text-gray-500" />
                        ) : (
                          <Car size={20} className="text-gray-500" />
                        )}
                      </div>
                      <p
                        className={`font-bold uppercase tracking-wider ${
                          slot.status === 'available'
                            ? 'text-green-600'
                            : slot.status === 'reserve'
                              ? 'text-yellow-600'
                              : 'text-red-600'
                        }`}
                      >
                        {slot.status}
                      </p>
                      <p className="text-xs uppercase opacity-60 dark:text-gray-400 mt-1">
                        {slot.type}
                      </p>
                    </button>
                  ))
                ) : (
                  <p className="col-span-full text-center text-text/50 p-20 text-xl">
                    No parking slots match your search.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Reservation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-none p-8 dark:bg-[#1a1a1a] dark:text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Assign Parking Space
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleReserveSubmit} className="space-y-6 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-semibold">Plate Number</Label>
                <Input value={profile?.plateNumber || ''} readOnly />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Vehicle Type</Label>
                <Input value={selectedSlot?.type || ''} readOnly />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-semibold">Parking Space</Label>
                <Input value={selectedSlot?.slotNumber || ''} readOnly />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Status</Label>
                <Input value="Reserved" readOnly />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                className="flex-1 rounded-xl h-12"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isReserving}
                className="flex-1 bg-black text-white dark:bg-white dark:text-black rounded-xl h-12 hover:bg-black dark:hover:bg-white"
              >
                {isReserving ? (
                  <Loader2 className="animate-spin mr-2" size={20} />
                ) : null}
                Reserve Space
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
