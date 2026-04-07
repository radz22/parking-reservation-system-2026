'use client';

import { useEffect, useState } from 'react';
import { UserTable } from './user-table';
import { SearchField } from '@/components/ui/search';
import { Button } from '@/components/ui/button';
import { RefreshCw, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import apiClient from '@/lib/api-client';
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

export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  isVerified: boolean;
  isBanned: boolean;
  createdAt: string;
  contact?: string;
  plateNumber?: string;
}

export function UserManagement() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(
        `/api/admin/users?page=${page}&search=${search}`,
      );
      setUsers(res.data.users as User[]);
      setTotalPages(res.data.pagination.totalPages);
      setTotal(
        res.data.pagination.totalUsers ||
          res.data.pagination.totalItems ||
          res.data.users.length,
      );
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.accessToken) {
      fetchUsers();
    }
  }, [session, page, search]);

  const handleToggleBan = async (user: User) => {
    try {
      const res = await apiClient.patch(`/api/admin/users/${user.id}/ban`, {
        isBanned: !user.isBanned,
      });
      toast.success(res.data.message);
      fetchUsers();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Action failed');
    }
  };

  const handleDeleteUser = async (user: User) => {
    try {
      await apiClient.delete(`/api/admin/users/${user.id}`);
      toast.success('User deleted permanently');
      fetchUsers();
      setUserToDelete(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-3 w-full max-w-sm">
          <SearchField
            placeholder="Search by name or email..."
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchUsers()}
            disabled={loading}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      <UserTable
        users={users}
        isLoading={loading}
        currentPage={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
        onToggleBan={handleToggleBan}
        onDeleteClick={(u) => setUserToDelete(u)}
      />

      <AlertDialog
        open={!!userToDelete}
        onOpenChange={(open) => !open && setUserToDelete(null)}
      >
        <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-rose-600">
              <Trash2 className="w-5 h-5" />
              Confirm Permanently Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Are you sure you want to delete <b>{userToDelete?.username}</b>?
              This action will remove all reservation history and vehicle data.
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl border-gray-200">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => userToDelete && handleDeleteUser(userToDelete)}
              className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-100"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
