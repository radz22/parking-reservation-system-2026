import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { parkingSlotService } from '@/services/parking-slot-service';
import {
  CreateParkingSlotInput,
  ParkingSlot,
  UpdateParkingSlotInput,
} from '@/types/parking-slot';
import { useState } from 'react';
import { toast } from 'sonner';

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const data = error.response?.data;
    if (data && typeof data === 'object' && 'message' in data) {
      const msg = (data as { message: unknown }).message;
      if (typeof msg === 'string' && msg.trim()) return msg;
    }
    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
export function useParkingSlot() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['parking-slots', currentPage, searchQuery],
    queryFn: () => parkingSlotService.findAll(currentPage, 10, searchQuery),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateParkingSlotInput) =>
      parkingSlotService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parking-slots'] });
      setOpenCreateModal(false);
      toast.success('Parking slot created successfully');
    },
    onError: (error) =>
      toast.error(
        getApiErrorMessage(error, 'Could not create parking slot'),
      ),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateParkingSlotInput }) =>
      parkingSlotService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parking-slots'] });
      setOpenUpdateModal(false);
      toast.success('Parking slot updated successfully');
    },
    onError: (error) =>
      toast.error(
        getApiErrorMessage(error, 'Could not update parking slot'),
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => parkingSlotService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parking-slots'] });
      setOpenDeleteModal(false);
      toast.success('Parking slot deleted successfully');
    },
    onError: (error) =>
      toast.error(
        getApiErrorMessage(error, 'Could not delete parking slot'),
      ),
  });

  const handleEdit = (slot: ParkingSlot) => {
    setSelectedSlot(slot);
    setOpenUpdateModal(true);
  };

  const handleDeleteClick = (slot: ParkingSlot) => {
    setSelectedSlot(slot);
    setOpenDeleteModal(true);
  };

  const handleView = (slot: ParkingSlot) => {
    setSelectedSlot(slot);
    setOpenViewModal(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSuccess = () => {
    refetch();
  };

  return {
    parkingSlots: data?.items || [],
    isLoading,
    total: data?.pagination.total || 0,
    totalPages: data?.pagination.totalPages || 0,
    currentPage,
    searchQuery,
    setSearchQuery,
    openCreateModal,
    setOpenCreateModal,
    openUpdateModal,
    setOpenUpdateModal,
    openDeleteModal,
    setOpenDeleteModal,
    openViewModal,
    setOpenViewModal,
    selectedSlot,
    handleEdit,
    handleDeleteClick,
    handleView,
    handlePageChange,
    handleSuccess,
    createMutation,
    updateMutation,
    deleteMutation,
    isFetching,
  };
}
