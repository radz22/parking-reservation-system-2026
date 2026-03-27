import React from 'react';
import { ParkingReservation } from '@/types/parking-reservation';
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
import { MoreHorizontal, Trash2, Eye, CheckCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

type HistoryTableProps = {
  reservations: ParkingReservation[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  handleDelete: (reservation: ParkingReservation) => void;
  handleView: (reservation: ParkingReservation) => void;
  handleComplete?: (reservation: ParkingReservation) => void;
};

export function HistoryTable({
  reservations,
  isLoading,
  currentPage,
  totalPages,
  total,
  onPageChange,
  handleDelete,
  handleView,
  handleComplete,
}: HistoryTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden min-h-[400px] flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'secondary'; // Using secondary for green-ish if available, or default
      case 'CANCELLED':
        return 'destructive';
      case 'OCCUPIED':
        return 'default';
      case 'RESERVED':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>User</TableHead>
              <TableHead>Plate Number</TableHead>
              <TableHead>Slot</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-gray-500">
                  No reservations found.
                </TableCell>
              </TableRow>
            ) : (
              reservations.map((res) => (
                <TableRow key={res.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{res.user?.username || 'N/A'}</span>
                      <span className="text-xs text-gray-500">{res.user?.email || 'N/A'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{res.vehicle?.plateNumber || 'N/A'}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{res.slot?.slotNumber || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(res.status)}>
                      {res.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {format(new Date(res.startTime), 'MMM d, HH:mm')}
                  </TableCell>
                  <TableCell className="text-sm">
                    {res.endTime ? format(new Date(res.endTime), 'MMM d, HH:mm') : '-'}
                  </TableCell>
                  <TableCell className="font-semibold text-emerald-600">
                    {res.totalPrice ? `$${res.totalPrice.toFixed(2)}` : '-'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(res)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {res.status === 'RESERVED' || res.status === 'OCCUPIED' ? (
                           <DropdownMenuItem onClick={() => handleComplete?.(res)}>
                             <CheckCircle className="w-4 h-4 mr-2" />
                             Mark Completed
                           </DropdownMenuItem>
                        ) : null}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(res)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
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

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        onPageChange={onPageChange}
        itemLabel="reservations"
      />
    </>
  );
}
