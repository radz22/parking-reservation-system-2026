import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from '@/components/ui/table';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/loading/loading';
import { MoreHorizontal, Trash2, Ban, UserCheck } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { User } from './user-management';

type UserTableProps = {
  users: User[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  onToggleBan: (user: User) => void;
  onDeleteClick: (user: User) => void;
};

export function UserTable({
  users,
  isLoading,
  currentPage,
  totalPages,
  total,
  onPageChange,
  onToggleBan,
  onDeleteClick,
}: UserTableProps) {
  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="px-6 py-3 text-left font-semibold">
                User Name
              </TableHead>
              <TableHead className="px-6 py-3 text-left font-semibold">
                Email
              </TableHead>
              <TableHead className="px-6 py-3 text-left font-semibold">
                Plate Number
              </TableHead>
              <TableHead className="px-6 py-3 text-center font-semibold">
                Status
              </TableHead>
              <TableHead className="px-6 py-3 text-left font-semibold">
                Joined Date
              </TableHead>
              <TableHead className="w-[70px] py-3"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-gray-500 font-medium"
                >
                  No users found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-gray-50/30 transition-colors group"
                >
                  <TableCell className="px-6 py-4">{user.username}</TableCell>
                  <TableCell className="px-6 py-4">{user.email}</TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge variant="outline">{user.plateNumber || 'N/A'}</Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    {user.isBanned ? (
                      <Badge variant="destructive">Banned</Badge>
                    ) : (
                      <Badge variant="default">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full hover:bg-gray-100"
                        >
                          <MoreHorizontal className="w-4 h-4 text-gray-400" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="w-48 rounded-xl p-2 shadow-xl border-gray-100"
                      >
                        <DropdownMenuItem
                          onClick={() => onToggleBan(user)}
                          className={`flex items-center gap-2 p-2 rounded-lg font-medium ${
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

                        <DropdownMenuSeparator className="bg-gray-100 my-1" />

                        <DropdownMenuItem
                          onClick={() => onDeleteClick(user)}
                          className="flex items-center gap-2 p-2 rounded-lg text-rose-600 hover:bg-rose-50 font-medium"
                        >
                          <Trash2 className="w-4 h-4" /> Delete Permanently
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="px-2 mt-2">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          total={total}
          onPageChange={onPageChange}
          itemLabel="users"
        />
      </div>
    </>
  );
}
