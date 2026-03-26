import { AdminHeader } from '@/components/admin/admin-header';
import { ParkingSlot } from '@/components/admin/parking-slot/parking-slot';
import { Suspense } from 'react';
import { Loading } from '@/components/loading/loading';

export default function ParkingSlotPage() {
  return (
    <div>
      <AdminHeader
        title="Manage Parking Slots"
        description="Create, update, and manage parking slots for vehicles."
      />
      <div className="p-6">
        <Suspense fallback={<Loading />}>
          <ParkingSlot />
        </Suspense>
      </div>
    </div>
  );
}
