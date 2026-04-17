import { AdminHeader } from '@/components/admin/admin-header';
import { UserManagement } from '@/components/admin/user/user-management';
import { Suspense } from 'react';
import { Loading } from '@/components/loading/loading';

export default function UserManagementPage() {
  return (
    <div>
      <AdminHeader
        title="Account Management"
        description="Monitor registered accounts, manage access permissions, and vehicle data."
      />
      <div className="p-6">
        <Suspense fallback={<Loading />}>
          <UserManagement />
        </Suspense>
      </div>
    </div>
    
  );
}
