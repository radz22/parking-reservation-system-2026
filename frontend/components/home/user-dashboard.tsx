'use client';

import { Navigation } from './navigation';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { Globe, AlertTriangle, Loader2 } from 'lucide-react';
import { useProfile } from '@/hooks/use-profile';
import { parkingReservationService } from '@/services/parking-reservation-service';
import { parkingSlotService } from '@/services/parking-slot-service';
import { ParkingReservation } from '@/types/parking-reservation';
import { ParkingSlot } from '@/types/parking-slot';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { QRCodeSVG } from 'qrcode.react';
import { Loading } from '@/components/loading/loading';
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
import { useRouter } from 'next/navigation';

interface Reservation {
  id: string;
  plateNumber: string;
  slotNumber: string;
  vehicleType: string;
  startTime: string;
  endTime: string | null;
  totalPrice: number | null;
  status: string;
}

export const UserDashboard = ({ children }: { children?: React.ReactNode }) => {
  const router = useRouter();
  const [isCancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState<
    string | null
  >(null);
  const [isOpenQrCode, setIsOpenQrCode] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [isLoadingQrCode, setIsLoadingQrCode] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [stats, setStats] = useState({
    totalActivity: 0,
    totalAvailable: 0,
    available2Wheels: 0,
    available4Wheels: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  const { profile } = useProfile();

  const fetchData = useCallback(async () => {
    if (!profile?.id) return;

    try {
      setLoading(true);

      const resData = await parkingReservationService.getAll({
        userId: profile.id,
        limit: 50,
      });

      const mappedReservations: Reservation[] = resData.items.map(
        (r: ParkingReservation) => ({
          id: r.id,
          plateNumber: r.vehicle?.plateNumber || 'N/A',
          slotNumber: r.slot?.slotNumber || 'N/A',
          vehicleType:
            r.slot?.vehicleType === 'TWO_WHEEL' ? '2-wheel' : '4-wheel',
          startTime: r.startTime,
          endTime: r.endTime || null,
          status: r.status,
          totalPrice: r.totalPrice || null,
        }),
      );

      setReservations(mappedReservations);

      const slotsData = await parkingSlotService.getAll({ limit: 100 });
      const items = slotsData.items;

      setStats({
        totalActivity: resData.pagination.total,
        totalAvailable: items.filter((s: ParkingSlot) => s.isAvailable).length,
        available2Wheels: items.filter(
          (s: ParkingSlot) => s.isAvailable && s.vehicleType === 'TWO_WHEEL',
        ).length,
        available4Wheels: items.filter(
          (s: ParkingSlot) => s.isAvailable && s.vehicleType === 'FOUR_WHEEL',
        ).length,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCancelClick = (id: string) => {
    setSelectedReservationId(id);
    setCancelModalOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedReservationId) return;

    try {
      setIsCancelling(true);
      await parkingReservationService.cancel(selectedReservationId);
      toast.success('Reservation cancelled successfully!');
      setCancelModalOpen(false);
      fetchData();
    } catch (error: unknown) {
      console.error('Cancellation failed:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to cancel reservation';
      toast.error(errorMessage);
    } finally {
      setIsCancelling(false);
      setSelectedReservationId(null);
    }
  };

  const handleQrCodeClick = async (id: string) => {
    setIsOpenQrCode(true);
    setIsLoadingQrCode(true);

    try {
      const { qrCode } = await parkingReservationService.getById(id);
      setQrCode(qrCode);
    } catch {
      toast.error('Failed to load QR code');
      setQrCode('');
    } finally {
      setIsLoadingQrCode(false);
    }
  };
  const handleBrowseVacantSpaces = () => {
    router.push('/parking-reserve');
  };
  return (
    <div className="dashboard-container dark:bg-[#0a0a0a] transition-all w-full">
      <Navigation />
      {children}
      <main id="main-section" className="p-5 lg:px-20">
        <div className="max-w-5xl mx-auto mt-30 px-3 lg:max-w-7xl lg:mt-40">
          <div className="flex flex-col flex-1 gap-3">
            <h1 className="text-text text-4xl font-semibold dark:text-white">
              Welcome Back,{' '}
              <span className="font-bold text-secondary dark:text-white">
                {profile?.username}
              </span>
            </h1>
            <p className="text-dark text-base my-3 ">
              Manage your parking reservations and find available spaces
            </p>
          </div>

          <div className="mt-10">
            <button
              onClick={handleBrowseVacantSpaces}
              className="flex items-center justify-center px-5 pr-7 py-2 bg-text rounded-4xl text-primary hover:bg-secondary duration-300 ease-out border cursor-pointer"
            >
              <Globe size={18} strokeWidth={3} className="mr-2" />
              <span>Browse Vacant Spaces</span>
            </button>
          </div>

          <div id="dashboard-info" className="mt-20">
            <div>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
                <div className="dashboard-boxes dark:bg-[#121212]">
                  <div className="flex justify-between items-center">
                    <span className="text-text/60 text-sm font-medium text text dark:text-white">
                      Your Total Activity:
                    </span>
                    <i className="fa-solid fa-parking text-secondary"></i>
                  </div>
                  <h2 className="text-3xl font-bold text-text my-3 text text dark:text-white">
                    <span>{loading ? '...' : stats.totalActivity}</span>
                  </h2>
                </div>

                <div className="dashboard-boxes dark:bg-[#121212]">
                  <div className="flex justify-between items-center">
                    <span className="text-text/60 text-sm font-medium text text dark:text-white">
                      Total Available Space:
                    </span>
                    <i className="fa-solid fa-check text-secondary"></i>
                  </div>
                  <h2 className="text-3xl font-bold text-text my-3 text text dark:text-white">
                    <span>{loading ? '...' : stats.totalAvailable}</span>
                  </h2>
                </div>

                <div className="dashboard-boxes dark:bg-[#121212]">
                  <div className="flex justify-between items-center">
                    <span className="text-text/60 text-sm font-medium text text dark:text-white">
                      Available Space (2-Wheels)
                    </span>
                    <i className="fa-solid fa-motorcycle text-secondary"></i>
                  </div>
                  <h2 className="text-3xl font-bold text-text my-3 text text dark:text-white">
                    <span>{loading ? '...' : stats.available2Wheels}</span>
                  </h2>
                </div>

                <div className="dashboard-boxes dark:bg-[#121212]">
                  <div className="flex justify-between items-center">
                    <span className="text-text/60 text-sm font-medium dark:text-white">
                      Available Space (4-Wheels)
                    </span>
                    <i className="fa-solid fa-car text-secondary"></i>
                  </div>
                  <h2 className="text-3xl font-bold text-text my-3 dark:text-white">
                    <span>{loading ? '...' : stats.available4Wheels}</span>
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <section id="reservation-info">
        <div id="reservation-table" className="mt-20 max-w-8xl mx-auto">
          <div className="bg-primary dark:bg-[#121212] h-fit py-20 transition-colors duration-300">
            <div className="md:max-w-7xl md:mx-auto px-4">
              <h1 className="font-semibold text-text text-2xl text-center md:text-start dark:text-white">
                Your Reservations:
              </h1>

              <div className="mt-10 overflow-x-auto">
                {loading ? (
                  <div className="flex justify-center items-center py-10">
                    <Loader2
                      className="animate-spin text-secondary"
                      size={32}
                    />
                  </div>
                ) : (
                  <table className="min-w-full text-center table-auto border-collapse">
                    <thead>
                      <tr className="text-text/50 font-bold uppercase text-xs tracking-wider">
                        <th className="px-4 py-3 border-b border-gray-100 dark:text-white">
                          Slot
                        </th>
                        <th className="px-4 py-3 border-b border-gray-100 dark:text-white">
                          Vehicle
                        </th>
                        <th className="px-4 py-3 border-b border-gray-100 dark:text-white">
                          Type
                        </th>
                        <th className="px-4 py-3 border-b border-gray-100 dark:text-white">
                          IN
                        </th>
                        <th className="px-4 py-3 border-b border-gray-100 dark:text-white">
                          OUT
                        </th>
                        <th className="px-4 py-3 border-b border-gray-100 dark:text-white">
                          Total Fee
                        </th>
                        <th className="px-4 py-3 border-b border-gray-100 dark:text-white">
                          Status
                        </th>
                        <th className="px-4 py-3 border-b border-gray-100 dark:text-white text-right">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="text-text font-semibold text-sm">
                      {reservations.length > 0 ? (
                        reservations.map((res) => (
                          <tr
                            key={res.id}
                            className="hover:bg-dark/10 transition-colors duration-200 dark:text-white"
                          >
                            <td className="px-4 py-4 whitespace-nowrap">
                              {res.slotNumber}
                            </td>
                            <td className="px-4 py-4 uppercase whitespace-nowrap">
                              {res.plateNumber}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {res.vehicleType}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {res.startTime
                                ? format(
                                    new Date(res.startTime),
                                    'MMM dd, yyyy p',
                                  )
                                : '-'}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {res.endTime
                                ? format(
                                    new Date(res.endTime),
                                    'MMM dd, yyyy p',
                                  )
                                : '-'}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {res.totalPrice
                                ? `₱${res.totalPrice.toFixed(2)}`
                                : '-'}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  res.status === 'RESERVED' ||
                                  res.status === 'PENDING'
                                    ? 'bg-yellow-100 text-yellow-600'
                                    : res.status === 'COMPLETED'
                                      ? 'bg-green-100 text-green-600'
                                      : res.status === 'OCCUPIED'
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'bg-red-100 text-red-600'
                                }`}
                              >
                                {res.status}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              {(res.status === 'RESERVED' ||
                                res.status === 'PENDING') && (
                                <div className="flex justify-end gap-2 flex-wrap">
                                  <button
                                    onClick={() => handleCancelClick(res.id)}
                                    className="bg-gray-200 text-text px-6 py-1.5 rounded-full font-bold hover:bg-red-500 hover:text-white transition-all duration-300 text-xs"
                                  >
                                    Cancel
                                  </button>

                                  <button
                                    onClick={() => handleQrCodeClick(res.id)}
                                    className="bg-gray-200 text-text px-6 py-1.5 rounded-full font-bold hover:bg-blue-500 hover:text-white transition-all duration-300 text-xs"
                                  >
                                    QR CODE
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={7}
                            className="text-center py-10 text-text/40 italic"
                          >
                            No active reservations found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <AlertDialog open={isCancelModalOpen} onOpenChange={setCancelModalOpen}>
        <AlertDialogContent className="bg-primary rounded-3xl p-8 border-none max-w-sm text-center ">
          <AlertDialogHeader className="text-center md:text-left">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto md:mx-0">
              <AlertTriangle className="text-red-500" size={32} />
            </div>

            <AlertDialogTitle className="text-xl font-bold text-text mb-2">
              Cancel Reservation?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-text/60">
              Are you sure you want to cancel your slot? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex flex-col gap-3 mt-6 sm:flex-col">
            <div className="flex flex-col gap-3 md:flex-row">
              <AlertDialogAction
                disabled={isCancelling}
                onClick={handleCancelConfirm}
                className="w-full md:w-55 py-6 bg-red-500 text-primary rounded-xl font-semibold  transition-all hover:bg-secondary duration-300 ease-out "
              >
                {isCancelling ? (
                  <Loader2 className="animate-spin mr-2" size={20} />
                ) : null}
                Yes, Cancel
              </AlertDialogAction>

              <AlertDialogCancel className="w-full md:w-55 py-6 bg-gray-200 rounded-xl font-bold hover:bg-secondary hover:text-primary border-none ">
                No, Keep it
              </AlertDialogCancel>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isOpenQrCode} onOpenChange={setIsOpenQrCode}>
        <DialogContent className="bg-primary rounded-3xl p-8 border-none flex items-center justify-center">
          {isLoadingQrCode ? (
            <Loading />
          ) : (
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md flex items-center justify-center">
              <div className="bg-white p-4 rounded-2xl w-full flex justify-center">
                <QRCodeSVG value={qrCode} className="w-full h-auto" />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
