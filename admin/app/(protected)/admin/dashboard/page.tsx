import { AdminHeader } from '@/components/admin/admin-header';
export default function AdminDashboardPage() {
  return (
    <div>
      <AdminHeader
        title="Admin Dashboard"
        description="Manage admin users and settings"
      />
      <div className="p-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>
    </div>
  );
}
