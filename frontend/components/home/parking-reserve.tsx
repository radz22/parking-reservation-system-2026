'use client';
//for icon, utility and react components
import { useState, useMemo } from 'react';
import { Search, Motorbike, Car } from 'lucide-react';
import { Navigation } from './navigation';

//shadcnification
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
  status: 'available' | 'reserve' | 'occupied';
  type: '2-wheel' | '4-wheel';
  icon: 'motorbike' | 'car';
}

// 1. Iyong Data (Mock Data)
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
  // 2. States para sa Filtering at Data
  const [slots, setSlots] = useState(INITIAL_PARKING_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [hasActiveReservation, setHasActiveReservation] = useState(false);

  //para sa modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [plateNumber, setPlateNumber] = useState('');

  // 3. Filtering Logic (Kapalit ng renderParkingSlot function)
  const filteredSlots = useMemo(() => {
    return slots.filter((slot) => {
      const matchesSearch = slot.id
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType = selectedType === '' || slot.type === selectedType;
      const matchesStatus =
        selectedStatus === '' || slot.status === selectedStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [slots, searchQuery, selectedType, selectedStatus]);

  // Count available spaces
  const availableCount = slots.filter((s) => s.status === 'available').length;

  // Toggle for Legend Filter
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

    setSelectedSlot(slot); // Isesave kung anong slot ang pinindot
    setIsModalOpen(true); //magshow yung modal bawat slot na pinindot pero 1:1 ratio lang
  };

  return (
    <div className="bg-body min-h-screen dark:bg-[#121212]">
      <Navigation />

      <section id="reservation-header" className="container-1 pt-35">
        <div className="flex flex-col md:flex-row md:justify-between">
          <div>
            <h1 className="text-4xl text-text font-semibold mb-3 dark:text-white">
              Reserve Parking Space
            </h1>
            <p className="text-lg text-text/70 font-semibold dark:text-white">
              Find and reserve an available parking space
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="container-1 bg-primary p-6 my-10 rounded-2xl dark:bg-[#121212]">
          <h1 className="px-2 font-bold text-text text-2xl mb-5 text text dark:text-white">
            {availableCount} Available Spaces
          </h1>

          <div className="flex">
            <form
              className="flex flex-row gap-1 md:gap-5 w-full"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="relative flex-1">
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search by Slot Number..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent focus:border-secondary focus:bg-white rounded-xl outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="relative flex-1">
                <select
                  className="w-full pl-2 pr-5 py-3 md:pl-5 bg-gray-50 border border-transparent focus:border-secondary focus:bg-white rounded-xl outline-none appearance-none cursor-pointer"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="">( Select Vehicle Type )</option>
                  <option value="2-wheel">2-Wheel</option>
                  <option value="4-wheel">4-Wheel</option>
                </select>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Legend Section */}
      <section id="reserve-legend" className="mt-20">
        <div className="bg-primary dark:bg-[#121212]">
          <div className="container-1 py-7 flex flex-col md:flex-row md:justify-between">
            <div>
              <h1 className="text-text text-2xl font-semibold md:mt-5 text text dark:text-white">
                Parking Spaces:
              </h1>
            </div>

            <div className="my-5">
              <ul className="flex flex-row gap-3">
                <li
                  className={`px-4 py-2 w-fit rounded-3xl font-semibold cursor-pointer duration-300 ${selectedStatus === '' ? 'bg-secondary text-primary' : 'bg-text/30'}`}
                >
                  <button
                    className="cursor-pointer"
                    onClick={() => handleStatusFilter('')}
                  >
                    All
                  </button>
                </li>
                <li
                  className={`px-4 py-2 w-fit rounded-3xl font-semibold cursor-pointer duration-300 ${selectedStatus === 'available' ? 'bg-secondary text-primary' : 'bg-green-400'}`}
                >
                  <button
                    className="cursor-pointer"
                    onClick={() => handleStatusFilter('available')}
                  >
                    Available
                  </button>
                </li>
                <li
                  className={`px-4 py-2 w-fit rounded-3xl font-semibold cursor-pointer duration-300 ${selectedStatus === 'reserve' ? 'bg-secondary text-primary' : 'bg-yellow-400'}`}
                >
                  <button
                    className="cursor-pointer"
                    onClick={() => handleStatusFilter('reserve')}
                  >
                    Reserved
                  </button>
                </li>
                <li
                  className={`px-4 py-2 w-fit rounded-3xl font-semibold cursor-pointer duration-300 ${selectedStatus === 'occupied' ? 'bg-secondary text-primary' : 'bg-red-400'}`}
                >
                  <button
                    className="cursor-pointer"
                    onClick={() => handleStatusFilter('occupied')}
                  >
                    Occupied
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Slots Table */}
          <div id="reserve-table" className="container-1 pb-10">
            <div
              id="slot-container"
              className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
            >
              {filteredSlots.length > 0 ? (
                filteredSlots.map((slot) => (
                  <div key={slot.id} className="status-box">
                    <button
                      onClick={() => handleSlotClick(slot)}
                      className={`w-full text-left rounded-2xl p-4 transition-all pb-15 pt-5 ${
                        slot.status === 'available'
                          ? 'available-box'
                          : slot.status === 'reserve'
                            ? 'reserve-box'
                            : 'occupied-box'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-base">{slot.id}</h3>
                        {slot.icon === 'motorbike' ? (
                          <Motorbike size={18} />
                        ) : (
                          <Car size={18} />
                        )}
                      </div>
                      <p className="text-center font-bold text-lg uppercase mt-2">
                        {slot.status}
                      </p>
                      <p className="text-center text-sm uppercase opacity-70">
                        ({slot.type})
                      </p>
                    </button>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-text/50 p-10 text-xl">
                  No parking slots found.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-none p-8 dark:bg-slate-950">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <DialogTitle className="text-xl font-bold text text dark:text-white">
              Assign Parking Space:
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Logic para i-update ang state
              setSlots((prev) =>
                prev.map((s) =>
                  s.id === selectedSlot?.id ? { ...s, status: 'reserve' } : s,
                ),
              );
              setHasActiveReservation(true);
              setIsModalOpen(false);

              alert(`Slot Number ${selectedSlot?.id} is completely Reserved!`);

              setPlateNumber('');
            }}
            className="space-y-4"
          >
            {/* Row 1: Plate Number & Vehicle Type */}
            <div className="grid grid-cols-2 gap-4 text text dark:text-white">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Plate Number:</Label>
                <Input
                  placeholder="Enter Plate"
                  className="bg-gray-100 border-none rounded-lg h-10"
                  required
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Vehicle Type:</Label>
                <Input
                  value={selectedSlot?.type || ''}
                  readOnly
                  className="bg-gray-100 border-none rounded-lg h-10 text-gray-500 focus-visible:ring-0 cursor-default"
                />
              </div>
            </div>

            {/* Row 2: Parking Space & Status */}
            <div className="grid grid-cols-2 gap-4 text text dark:text-white">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Parking Space:</Label>
                <Input
                  value={selectedSlot?.id || ''}
                  readOnly
                  className="bg-gray-100 border-none rounded-lg h-10 text-gray-500 focus-visible:ring-0 cursor-default"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Status:</Label>
                <Input
                  value="Reserved"
                  readOnly
                  className="bg-gray-100 border-none rounded-lg h-10 text-gray-500 focus-visible:ring-0 cursor-default"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6">
              <Button
                type="button"
                variant="secondary"
                className="flex-1 bg-gray-200 hover:bg-gray-300 rounded-xl font-semibold h-11"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-black text-white hover:bg-black/90 rounded-xl font-semibold h-11"
              >
                Reserve Space
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};