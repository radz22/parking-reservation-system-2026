'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import {
  Camera,
  ShieldAlert,
  Loader2,
  RefreshCw,
  LogIn,
  LogOut,
  Banknote
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import apiClient from '@/lib/api-client';

interface ScanResponse {
  success: boolean;
  message: string;
  action?: 'in' | 'out';
  fee?: number;
  extendedQrCode?: string;
  reservation?: any;
}

type ScanStatus = 'idle' | 'loading' | 'success' | 'error';
type ScanMode = 'in' | 'out';

export default function EventQrScanner() {
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const [scanMode, setScanMode] = useState<ScanMode>('in');
  const [calculatedFee, setCalculatedFee] = useState<number | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scanModeRef = useRef<ScanMode>(scanMode);
  const statusRef = useRef<ScanStatus>(status);

  useEffect(() => {
    scanModeRef.current = scanMode;
  }, [scanMode]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const showFeedback = (type: ScanStatus, msg: string, fee?: number) => {
    setStatus(type);
    setFeedbackMsg(msg);
    if (fee !== undefined) setCalculatedFee(fee);

    if (type === 'success') {
      setTimeout(() => {
        setStatus('idle');
        setCalculatedFee(null);
        scannerRef.current?.resume();
      }, 4000);
    }
  };

  const startScanner = async () => {
    try {
      setError('');
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode('reader', {
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          verbose: false,
        });
      }

      await scannerRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 15,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        onScanSuccess,
        () => {},
      );

      setIsScanning(true);
    } catch (err: unknown) {
      let message = 'Failed to access camera.';
      if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
      setIsScanning(false);
    }
  };

  const onScanSuccess = async (decodedText: string) => {
    if (statusRef.current !== 'idle') return;

    try {
      await scannerRef.current?.pause(true);
      showFeedback('loading', 'Verifying...');

      const currentMode = scanModeRef.current;

      const res = await apiClient.post<ScanResponse>('/api/parking-reservations/scan', {
        token: decodedText,
        mode: currentMode,
      });

      if (res.data.success) {
        showFeedback(
          'success',
           res.data.message || `Vehicle ${currentMode === 'in' ? 'Checked In' : 'Checked Out'}`,
           res.data.fee
        );
      } else {
        showFeedback('error', res.data.message || 'Access Not Authorized');
      }
    } catch (err: any) {
      showFeedback('error', err.response?.data?.message || 'Invalid or Expired QR Code');
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current?.isScanning) {
      await scannerRef.current.stop();
      setIsScanning(false);
      setStatus('idle');
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto bg-slate-950 rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden font-sans mt-4">
      <div className="p-6 bg-slate-900/80 border-b border-white/5 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div
              className={`w-2 h-2 rounded-full animate-pulse ${scanMode === 'in' ? 'bg-emerald-500' : 'bg-amber-500'}`}
            />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">
              Scanner Terminal
            </span>
          </div>
          {isScanning && (
            <button
              onClick={stopScanner}
              className="text-[10px] font-black text-rose-500 uppercase flex items-center gap-1"
            >
              <RefreshCw size={12} className="animate-spin-slow" /> Reset
            </button>
          )}
        </div>

        <Tabs value={scanMode} onValueChange={(val) => setScanMode(val as ScanMode)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800">
            <TabsTrigger 
              value="in" 
              disabled={status === 'loading'}
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white uppercase text-xs font-bold tracking-wider"
            >
              <LogIn className="w-4 h-4 mr-2" /> Check In
            </TabsTrigger>
            <TabsTrigger 
              value="out" 
              disabled={status === 'loading'}
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white uppercase text-xs font-bold tracking-wider"
            >
              <LogOut className="w-4 h-4 mr-2" /> Check Out
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="relative aspect-square bg-black">
        <div id="reader" className="w-full h-full" />

        {status !== 'idle' && (
          <div
            className={`absolute inset-0 z-20 flex flex-col items-center justify-center p-8 transition-all duration-300 ${
              status === 'success'
                ? scanMode === 'in'
                  ? 'bg-emerald-600'
                  : 'bg-amber-600'
                : status === 'error'
                  ? 'bg-rose-600'
                  : 'bg-slate-900/95'
            }`}
          >
            {status === 'loading' && (
              <div className="flex flex-col items-center animate-pulse">
                <Loader2 className="w-16 h-16 text-white animate-spin mb-4" />
                <h4 className="text-white font-black uppercase tracking-widest italic">
                  Verifying...
                </h4>
              </div>
            )}

            {status === 'success' && (
              <div className="flex flex-col items-center text-center animate-in zoom-in duration-300">
                <div className="bg-white rounded-full p-5 mb-6 shadow-2xl">
                  {scanMode === 'in' ? (
                    <LogIn className="w-16 h-16 text-emerald-600" />
                  ) : (
                    <LogOut className="w-16 h-16 text-amber-600" />
                  )}
                </div>
                <h4 className="text-white font-black text-4xl uppercase tracking-tighter italic leading-none mb-2">
                  {scanMode === 'in' ? 'Checked In' : 'Checked Out'}
                </h4>
                <p className={`font-bold uppercase tracking-[0.2em] text-xs mb-4 ${scanMode === 'in' ? 'text-emerald-100' : 'text-amber-100'}`}>
                  {feedbackMsg}
                </p>
                {calculatedFee !== null && (
                   <div className="mt-4 bg-black/40 px-6 py-4 rounded-xl border border-white/20 flex flex-col items-center">
                     <span className="text-[10px] uppercase tracking-widest text-white/70 mb-1">Total Fee</span>
                     <div className="flex items-center gap-2 text-white">
                        <Banknote className="w-6 h-6 text-emerald-400" />
                        <span className="text-3xl font-black">₱{calculatedFee}</span>
                     </div>
                   </div>
                )}
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center text-center animate-in shake duration-300">
                <div className="bg-white rounded-full p-5 mb-6 shadow-2xl">
                  <ShieldAlert className="w-16 h-16 text-rose-600" />
                </div>
                <h4 className="text-white font-black text-4xl uppercase tracking-tighter italic leading-none mb-2">
                  Access Denied
                </h4>
                <p className="text-rose-100 font-bold uppercase tracking-widest text-xs mb-6">
                  {feedbackMsg}
                </p>
                <div className="flex flex-col gap-3 w-full max-w-xs">
                  <button
                    onClick={() => {
                      setStatus('idle');
                      scannerRef.current?.resume();
                    }}
                    className="w-full px-10 py-4 bg-black/30 hover:bg-black/40 rounded-2xl border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                  >
                    Dismiss & Retry
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {!isScanning && status === 'idle' && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-900 p-8">
            {error ? (
              <div className="text-center">
                <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                <p className="text-white font-bold text-sm mb-6">{error}</p>
                <button
                  onClick={startScanner}
                  className="text-amber-500 text-[10px] font-black uppercase underline tracking-widest"
                >
                  Grant Permissions & Retry
                </button>
              </div>
            ) : (
              <button
                onClick={startScanner}
                className="group flex flex-col items-center gap-6"
              >
                <div className="w-24 h-24 bg-amber-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.3)] transition-transform group-active:scale-95">
                  <Camera className="text-slate-950 w-10 h-10" />
                </div>
                <div className="text-center">
                  <span className="text-white text-lg font-black uppercase tracking-tight block">
                    Open Scanner
                  </span>
                  <span className="text-amber-500/60 text-[10px] font-bold uppercase tracking-[0.4em]">
                    Live Verification
                  </span>
                </div>
              </button>
            )}
          </div>
        )}

        {isScanning && status === 'idle' && (
          <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
            <div className="w-[260px] h-[260px] relative">
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-amber-500 rounded-tl-3xl shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-amber-500 rounded-tr-3xl shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-amber-500 rounded-bl-3xl shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-amber-500 rounded-br-3xl shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50 shadow-[0_0_10px_#f59e0b] animate-scan-line" />
            </div>
          </div>
        )}
      </div>

      <div className="p-10 bg-slate-900/50 flex flex-col items-center">
        <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.4em] mb-4 text-center">
          Parking System <br /> Access Control Unit
        </p>
        <div className="flex gap-1.5 opacity-40">
          <div className="w-2 h-2 bg-slate-700 rounded-full" />
          <div className="w-12 h-2 bg-amber-500 rounded-full" />
          <div className="w-2 h-2 bg-slate-700 rounded-full" />
        </div>
      </div>
    </div>
  );
}
