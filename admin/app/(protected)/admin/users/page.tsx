'use client';

import { useEffect, useState } from 'react';
import { AdminHeader } from '@/components/admin/admin-header';
import {
  Search,
  Ban,
  UserCheck,
  Trash2,
  MoreVertical,
  Loader2,
  Mail,
  CreditCard,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import apiClient from '@/lib/api-client';

interface User {
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

export default function UserManagementPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(
        `/api/admin/users?page=${page}&search=${search}`,
      );
      setUsers(res.data.users as User[]);
      setTotalPages(res.data.pagination.totalPages);
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

  const handleDeleteUser = async (userId: string) => {
    try {
      await apiClient.delete(`/api/admin/users/${userId}`);
      toast.success('User deleted permanently');
      fetchUsers();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminHeader
        title="User Management"
        description="Monitor registered accounts and manage access permissions."
      />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              className="pl-9 h-11 rounded-xl border-gray-100 bg-gray-50/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Badge
            variant="outline"
            className="px-3 py-1.5 rounded-lg border-blue-100 bg-blue-50 text-blue-700 font-medium"
          >
            Total Users: {users.length}
          </Badge>
        </div>

        <div className="bg-white rounded-2xl shadow-md border-none overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="font-semibold px-6">User</TableHead>
                <TableHead className="font-semibold text-center">
                  Status
                </TableHead>
                <TableHead className="font-semibold px-6">
                  Joined Date
                </TableHead>
                <TableHead className="font-semibold text-right px-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-60 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                      <p className="text-sm text-gray-500">
                        Loading user records...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-60 text-center text-gray-500"
                  >
                    No users found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-gray-50/30 transition-colors"
                  >
                    <TableCell className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">
                          {user.username}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                          <Mail className="w-3 h-3" />
                          <span>{user.email}</span>
                        </div>
                        {user.plateNumber && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                            <CreditCard className="w-3 h-3" />
                            <span>{user.plateNumber}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <Badge
                          className={`rounded-lg px-2.5 py-0.5 border-none ${
                            user.isVerified
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {user.isVerified ? 'Verified' : 'Pending'}
                        </Badge>
                        {user.isBanned && (
                          <Badge className="bg-rose-50 text-rose-700 border-none px-2.5 py-0.5 rounded-lg font-bold">
                            BANNED
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 text-gray-600 text-sm">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="px-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 rounded-xl p-2"
                        >
                          <DropdownMenuItem
                            onClick={() => handleToggleBan(user)}
                            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${
                              user.isBanned
                                ? 'text-emerald-600 hover:bg-emerald-50'
                                : 'text-orange-600 hover:bg-orange-50'
                            }`}
                          >
                            {user.isBanned ? (
                              <>
                                <UserCheck className="w-4 h-4" /> Unban User
                              </>
                            ) : (
                              <>
                                <Ban className="w-4 h-4" /> Ban User
                              </>
                            )}
                          </DropdownMenuItem>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="flex items-center gap-2 p-2 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" /> Delete
                                Permanently
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-2xl border-none">
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete User Permanently?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Warning: This action will remove all
                                  reservation history and vehicle data for{' '}
                                  <b>{user.username}</b>. This cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-xl">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="bg-rose-600 hover:bg-rose-700 rounded-xl"
                                >
                                  Delete User
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pb-10">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-xl"
            >
              Previous
            </Button>
            <div className="flex items-center px-4 font-medium text-sm text-gray-600">
              Page {page} of {totalPages}
            </div>
            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-xl"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
