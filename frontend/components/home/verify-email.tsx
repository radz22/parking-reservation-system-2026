'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { isAxiosError } from 'axios';
import { authService } from '@/services/auth-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormError } from '@/components/forms/form-error';
import { FormSuccess } from '@/components/forms/form-success';
import { Loading } from '@/components/loading/loading';
import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (!email) {
      router.push('/sign-in');
    }
  }, [email, router]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = window.setInterval(() => {
      setResendCooldown((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(t);
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (!email) {
      setError('Missing email. Return to sign up and try again.');
      return;
    }
    if (otpValue.length < 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await authService.verifyEmail({
        email: email ?? '',
        otp: otpValue,
      });
      setSuccess('Email verified successfully! Redirecting to login...');
      setTimeout(() => router.push('/sign-in'), 2000);
    } catch (err: unknown) {
      if (isAxiosError<{ message?: string }>(err)) {
        setError(
          err.response?.data?.message ??
            'Verification failed. Please try again.',
        );
      } else {
        setError('Verification failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = useCallback(async () => {
    if (!email || resendCooldown > 0 || resendLoading) return;
    setResendLoading(true);
    setError('');
    setSuccess('');
    try {
      const { message } = await authService.resendVerificationEmail({ email });
      setSuccess(message);
      setOtp(['', '', '', '', '', '']);
      setResendCooldown(60);
      const first = document.getElementById('otp-0');
      first?.focus();
    } catch (err: unknown) {
      if (isAxiosError<{ message?: string }>(err)) {
        const msg = err.response?.data?.message;
        setError(msg ?? 'Could not resend code. Please try again.');
      } else {
        setError('Could not resend code. Please try again.');
      }
    } finally {
      setResendLoading(false);
    }
  }, [email, resendCooldown, resendLoading]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col antialiased items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-3xl p-8 sm:p-12 ring-1 ring-gray-900/5">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-6">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Verify your email
          </h1>
          <p className="text-gray-500 text-sm">
            We&apos;ve sent a 6-digit code to{' '}
            <span className="font-semibold text-gray-900">{email}</span>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-between gap-2">
            {otp.map((digit, idx) => (
              <Input
                key={idx}
                id={`otp-${idx}`}
                type="text"
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-14 text-center text-2xl font-bold rounded-xl border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                maxLength={1}
                required
              />
            ))}
          </div>

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-gray-900 hover:bg-black text-white rounded-xl font-medium shadow-md transition-all active:scale-[0.98]"
          >
            {loading ? <Loading /> : 'Verify Email'}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Didn&apos;t receive the code?{' '}
            <button
              type="button"
              onClick={() => void handleResend()}
              disabled={
                !email || resendLoading || resendCooldown > 0 || loading
              }
              className="font-semibold text-blue-600 hover:underline disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
            >
              {resendLoading
                ? 'Sending…'
                : resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : 'Resend code'}
            </button>
          </p>
          <Link
            href="/sign-in"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
