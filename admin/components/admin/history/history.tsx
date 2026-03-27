'use client';

import React from 'react';
import { useParkingReservation } from '@/hooks/parking-reservation/use-parking-reservation';
import { HistoryTable } from './history-table';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { ParkingReservation } from '@/types/parking-reservation';
import { SearchField } from '@/components/ui/search';

export function History() {
  const {
    reservations,
    isLoading,
    isFetching,
    currentPage,
    handlePageChange,
    searchQuery,
    setSearchQuery,
    total,
    totalPages,
    deleteMutation,
    completeMutation,
    refresh
  } = useParkingReservation();

  const handleDelete = (res: ParkingReservation) => {
    if (confirm('Are you sure you want to delete this reservation record?')) {
      deleteMutation.mutate(res.id);
    }
  };

  const handleView = (res: ParkingReservation) => {
    // Implement view logic
    console.log('Viewing reservation:', res);
  };

  const handleComplete = (res: ParkingReservation) => {
     const price = prompt('Enter total price for this reservation:');
     if (price && !isNaN(parseFloat(price))) {
        completeMutation.mutate({ id: res.id, totalPrice: parseFloat(price) });
     }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-3 w-full max-w-sm">
          <SearchField
            placeholder="Search by user, plate, or slot..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refresh()}
            disabled={isFetching}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <HistoryTable
        reservations={reservations}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        onPageChange={handlePageChange}
        handleDelete={handleDelete}
        handleView={handleView}
        handleComplete={handleComplete}
      />
    </div>
  );
}
