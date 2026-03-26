'use client';

import { useState, useMemo } from 'react';
import { Search, Motorbike, Car } from 'lucide-react';
import { Navigation } from './navigation';

// shadcn/ui components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// 1. TypeScript Interface for Safety
interface Slot {
  id: string;
  status: 'available' | 'reserve' | 'occupied';
  type: '2-wheel' | '4-wheel';
  icon: 'motorbike' | 'car';
}

const INITIAL_PARKING_DATA: Slot[] = [
  { id: '2A01', status: 'available', type: '2-wheel', icon: 'motorbike' },
  { id: '2A02', status: 'available', type: '2-wheel', icon: 'motorbike' },
  { id: '2A03', status: 'available', type: '2-wheel', icon: 'motorbike' },
  { id: '2A04', status: 'available', type: '2-wheel', icon: 'motorbike' },
  { id: '2A05', status: 'available', type: '2-wheel', icon: 'motorbike' },
  { id: '2A06', status: 'available', type: '2-wheel', icon: 'motorbike' },
  { id: '4A01', status: 'available', type: '4-wheel', icon: 'car' },
  { id: '4A02', status: 'available', type: '4-wheel', icon: 'car' },
  { id: '4A03', status: 'available', type: '4-wheel', icon: 'car' },
  { id: '4A04', status: 'available', type: '4-wheel', icon: 'car' },
  { id: '4A05', status: 'available', type: '4-wheel', icon: 'car' },
  { id: '4A06', status: 'available', type: '4-wheel', icon: 'car' },
];

export const ParkingReservation = () => {
  // 2. States
  const [slots, setSlots] = useState<Slot[]>(INITIAL_PARKING_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [hasActiveReservation, setHasActiveReservation] = useState(false);

  // Modal & User States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
 const [userPlate] = useState(() => {
  // Chine-check natin kung nasa browser tayo (client-side) para hindi mag-error sa Next.js
  if (typeof window !== "undefined") {
    return localStorage.getItem("user_plate_number") || "";
  }
  return "";
});

  // 3. Filtering Logic
  const filteredSlots = useMemo(() => {
    return slots.filter((slot) => {
      const matchesSearch = slot.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === '' || slot.type === selectedType;
      const matchesStatus = selectedStatus === '' || slot.status === selectedStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [slots, searchQuery, selectedType, selectedStatus]);

  const availableCount = slots.filter((s) => s.status === 'available').length;

  const handleStatusFilter = (status: string) => {
    setSelectedStatus((prev) => (prev === status ? '' : status));
  };

  const handleSlotClick = (slot: Slot) => {
    if (hasActiveReservation) {
      alert('You already have an active reservation. Please cancel it first.');
      return;
    }

    if (slot.status !== 'available') {
      alert(`This slot is already ${slot.status}.`);
      return;
    }

    if (!userPlate) {
      alert("Please set your Plate Number in your profile first.");
      return;
    }

    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  const handleReserveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    setSlots((prev) =>
      prev.map((s) => (s.id === selectedSlot.id ? { ...s, status: 'reserve' } : s))
    );
    
    setHasActiveReservation(true);
    setIsModalOpen(false);
    alert(`Slot Number ${selectedSlot.id} is now Reserved for Plate: ${userPlate}`);
  };

  return (
    <div className="bg-body min-h-screen dark:bg-[#121212]">
      <Navigation />

      <section id="reservation-header" className="container-1 pt-35 px-4 md:px-0">
        <div className="flex flex-col md:flex-row md:justify-between">
          <div>
            <h1 className="text-4xl text-text font-semibold mb-3 dark:text-white">Reserve Parking Space</h1>
            <p className="text-lg text-text/70 font-semibold dark:text-gray-400">Find and reserve an available parking space</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-primary p-6 my-10 rounded-2xl dark:bg-[#1e1e1e] shadow-sm">
          <h2 className="px-2 font-bold text-text text-2xl mb-5 dark:text-white">
            {availableCount} Available Spaces
          </h2>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40 pointer-events-none" />
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
              <h2 className="text-text text-2xl font-semibold dark:text-white">Parking Spaces:</h2>
              <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
                <button onClick={() => handleStatusFilter('')} className={`px-5 py-2 rounded-3xl font-semibold transition ${selectedStatus === '' ? 'bg-secondary text-white' : 'bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}>All</button>
                <button onClick={() => handleStatusFilter('available')} className={`px-5 py-2 rounded-3xl font-semibold transition ${selectedStatus === 'available' ? 'bg-green-500 text-white' : 'bg-green-100 dark:bg-green-900/30 text-green-600'}`}>Available</button>
                <button onClick={() => handleStatusFilter('reserve')} className={`px-5 py-2 rounded-3xl font-semibold transition ${selectedStatus === 'reserve' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600'}`}>Reserved</button>
                <button onClick={() => handleStatusFilter('occupied')} className={`px-5 py-2 rounded-3xl font-semibold transition ${selectedStatus === 'occupied' ? 'bg-red-500 text-white' : 'bg-red-100 dark:bg-red-900/30 text-red-600'}`}>Occupied</button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {filteredSlots.length > 0 ? (
                filteredSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => handleSlotClick(slot)}
                    className={`text-left rounded-2xl p-6 transition-all hover:scale-[1.02] shadow-sm ${
                      slot.status === 'available' ? 'bg-green-50 dark:bg-green-900/10 border border-green-200' : 
                      slot.status === 'reserve' ? 'bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200' : 
                      'bg-red-50 dark:bg-red-900/10 border border-red-200 opacity-80 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="font-bold text-lg dark:text-white">{slot.id}</span>
                      {slot.icon === 'motorbike' ? <Motorbike size={20} className="text-gray-500" /> : <Car size={20} className="text-gray-500" />}
                    </div>
                    <p className={`font-bold uppercase tracking-wider ${
                      slot.status === 'available' ? 'text-green-600' : 
                      slot.status === 'reserve' ? 'text-yellow-600' : 'text-red-600'
                    }`}>{slot.status}</p>
                    <p className="text-xs uppercase opacity-60 dark:text-gray-400 mt-1">{slot.type}</p>
                  </button>
                ))
              ) : (
                <p className="col-span-full text-center text-text/50 p-20 text-xl">No parking slots match your search.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Reservation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-none p-8 dark:bg-[#1a1a1a] dark:text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Assign Parking Space</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleReserveSubmit} className="space-y-6 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-semibold">Plate Number</Label>
                <Input value={userPlate} readOnly className="bg-gray-100 dark:bg-[#2a2a2a] border-none rounded-lg cursor-not-allowed text-gray-500" />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Vehicle Type</Label>
                <Input value={selectedSlot?.type || ''} readOnly className="bg-gray-100 dark:bg-[#2a2a2a] border-none rounded-lg cursor-not-allowed text-gray-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-semibold">Parking Space</Label>
                <Input value={selectedSlot?.id || ''} readOnly className="bg-gray-100 dark:bg-[#2a2a2a] border-none rounded-lg cursor-not-allowed text-gray-500" />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Status</Label>
                <Input value="Reserved" readOnly className="bg-gray-100 dark:bg-[#2a2a2a] border-none rounded-lg cursor-not-allowed text-gray-500" />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="secondary" className="flex-1 rounded-xl h-12" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-black dark:bg-white dark:text-black hover:opacity-90 rounded-xl h-12">
                Reserve Space
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};