import { AdminHeader } from '@/components/admin/admin-header';
import { History } from '@/components/admin/history/history';
import { Suspense } from 'react';
import { Loading } from '@/components/loading/loading';

export default function HistoryPage() {
  return (
    <div>
      <AdminHeader
        title="Transaction & Reservation History"
        description="View and manage all user parking reservations and transactions."
      />
      <div className="p-6">
        <Suspense fallback={<Loading />}>
          <History />
        </Suspense>
      </div>
    </div>
  );
}
