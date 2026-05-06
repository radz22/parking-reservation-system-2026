'use client';

import { Button } from '@/components/ui/button';
import { RefreshCw, PlusCircle } from 'lucide-react';
import { SearchField } from '@/components/ui/search';
import { ParkingSlotTable } from './parking-slot-table';
import { CreateParkingSlotModal } from '@/components/admin/parking-slot/create-modal';
import { UpdateParkingSlotModal } from '@/components/admin/parking-slot/update-modal';
import { DeleteParkingSlotModal } from '@/components/admin/parking-slot/delete-modal';
import { ViewParkingSlotModal } from '@/components/admin/parking-slot/view-modal';
import { useParkingSlot } from '@/hooks/parking-slot/use-parking-slot';

export function ParkingSlot() {
  const {
    parkingSlots,
    isLoading,
    isFetching,
    searchQuery,
    setSearchQuery,
    currentPage,
    totalPages,
    total,
    openCreateModal,
    setOpenCreateModal,
    openViewModal,
    setOpenViewModal,
    openUpdateModal,
    setOpenUpdateModal,
    openDeleteModal,
    setOpenDeleteModal,
    selectedSlot,
    handlePageChange,
    handleView,
    handleEdit,
    handleDeleteClick,
    handleSuccess,
    createMutation,
    updateMutation,
    deleteMutation,
  } = useParkingSlot();

  return (
    <>
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SearchField
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search slot number..."
            />

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSuccess()}
              disabled={isFetching}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
          </div>
          <Button
            onClick={() => setOpenCreateModal(true)}
            className="bg-purple-600 hover:bg-purple-700 font-medium"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Parking Slot
          </Button>
        </div>
      </div>

      <ParkingSlotTable
        parkingSlots={parkingSlots}
        isLoading={isLoading}
        isFetching={isFetching}
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        onPageChange={handlePageChange}
        handleView={handleView}
        handleEdit={handleEdit}
        handleDeleteClick={handleDeleteClick}
      />

      <CreateParkingSlotModal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        createMutation={createMutation}
      />

      <ViewParkingSlotModal
        isOpen={openViewModal}
        onClose={() => setOpenViewModal(false)}
        slot={selectedSlot}
      />

      <UpdateParkingSlotModal
        slot={selectedSlot}
        isOpen={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        updateMutation={updateMutation}
      />

      <DeleteParkingSlotModal
        slot={selectedSlot}
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        deleteMutation={deleteMutation}
      />
    </>
  );
}
