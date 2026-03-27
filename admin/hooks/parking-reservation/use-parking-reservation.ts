'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { parkingReservationService } from '@/services/parking-reservation-service';
import { useState } from 'react';
import { ParkingReservation } from '@/types/parking-reservation';

export function useParkingReservation() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReservation, setSelectedReservation] = useState<ParkingReservation | null>(null);

  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['parking-reservations', currentPage, searchQuery],
    queryFn: () => parkingReservationService.findAll(currentPage, 10, searchQuery),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => parkingReservationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parking-reservations'] });
    },
  });

  const completeMutation = useMutation({
    mutationFn: ({ id, totalPrice }: { id: string; totalPrice: number }) =>
      parkingReservationService.complete(id, totalPrice),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parking-reservations'] });
    },
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSuccess = () => {
    refetch();
  };

  return {
    reservations: data?.items || [],
    isLoading,
    isFetching,
    total: data?.pagination.total || 0,
    totalPages: data?.pagination.totalPages || 0,
    currentPage,
    searchQuery,
    setSearchQuery,
    selectedReservation,
    setSelectedReservation,
    handlePageChange,
    handleSuccess,
    deleteMutation,
    completeMutation,
    refresh: refetch
  };
}
