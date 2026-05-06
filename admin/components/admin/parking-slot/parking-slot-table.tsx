import React from 'react';
import { ParkingSlot } from '@/types/parking-slot';
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
import { MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

type ParkingSlotTableProps = {
  parkingSlots: ParkingSlot[];
  isLoading: boolean;
  isFetching?: boolean;
  currentPage: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  handleEdit: (slot: ParkingSlot) => void;
  handleDeleteClick: (slot: ParkingSlot) => void;
  handleView?: (slot: ParkingSlot) => void;
};

export function ParkingSlotTable({
  parkingSlots,
  isLoading,
  currentPage,
  totalPages,
  total,
  onPageChange,
  handleEdit,
  handleDeleteClick,
  handleView,
}: ParkingSlotTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden min-h-[400px] flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Slot Number</TableHead>
              <TableHead>Vehicle Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parkingSlots.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-gray-500"
                >
                  No parking slots found.
                </TableCell>
              </TableRow>
            ) : (
              parkingSlots.map((slot) => (
                <TableRow key={slot.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    {slot.slotNumber}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {slot.vehicleType.toLowerCase().replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={slot.isAvailable ? 'default' : 'destructive'}
                    >
                      {slot.isAvailable ? 'Available' : 'Occupied'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(slot.createdAt), 'PPP')}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {handleView && (
                          <DropdownMenuItem onClick={() => handleView(slot)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleEdit(slot)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(slot)}
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
        itemLabel="parking slots"
      />
    </>
  );
}
