'use client';

import Image from 'next/image';
import {
  Mail,
  Loader2,
  ArrowLeft,
  Shield,
  KeyRound,
  LockKeyhole,
  Eye,
  EyeOff,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { isAxiosError } from 'axios';
import { authService } from '@/services/auth-service';
import { FormError } from '@/components/forms/form-error';
import { FormSuccess } from '@/components/forms/form-success';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

const emptyOtp = (): string[] => ['', '', '', '', '', ''];

type Step = 1 | 2 | 3;

export const ForgotPassword = () => {
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(emptyOtp());
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = window.setInterval(() => {
      setResendCooldown((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(t);
  }, [resendCooldown]);

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearMessages();
    try {
      await authService.forgotPassword({ email });
      setOtp(emptyOtp());
      setSuccess('Check your email for a 6-digit code.');
      setStep(2);
    } catch (err: unknown) {
      const message = isAxiosError<{ message?: string }>(err)
        ? err.response?.data?.message
        : undefined;
      setError(message ?? 'Failed to send code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      setError('Enter all 6 digits.');
      return;
    }
    setIsLoading(true);
    clearMessages();
    try {
      await authService.verifyPasswordReset({ email, otp: otpValue });
      setSuccess('Code verified. Choose a new password below.');
      setStep(3);
    } catch (err: unknown) {
      const message = isAxiosError<{ message?: string }>(err)
        ? err.response?.data?.message
        : undefined;
      setError(message ?? 'Invalid or expired code. Try again or resend.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = useCallback(async () => {
    if (!email || resendCooldown > 0 || resendLoading) return;
    setResendLoading(true);
    clearMessages();
    try {
      const { message } = await authService.forgotPassword({ email });
      setSuccess(message);
      setOtp(emptyOtp());
      setResendCooldown(60);
      document.getElementById('forgot-otp-0')?.focus();
    } catch (err: unknown) {
      const msg = isAxiosError<{ message?: string }>(err)
        ? err.response?.data?.message
        : undefined;
      setError(msg ?? 'Could not resend code.');
    } finally {
      setResendLoading(false);
    }
  }, [email, resendCooldown, resendLoading]);

  const otpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) {
      document.getElementById(`forgot-otp-${index + 1}`)?.focus();
    }
  };

  const otpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`forgot-otp-${index - 1}`)?.focus();
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      setError('Code missing. Go back and enter the code again.');
      return;
    }
    setIsLoading(true);
    try {
      await authService.resetPassword({
        email,
        otp: otpValue,
        newPassword: password,
      });
      setSuccess('Password updated successfully. Redirecting to sign in...');
      setTimeout(() => void router.push('/sign-in'), 2000);
    } catch (err: unknown) {
      const message = isAxiosError<{ message?: string }>(err)
        ? err.response?.data?.message
        : undefined;
      setError(
        message ?? 'Could not update password. The code may have expired.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-body min-h-screen flex items-center justify-center antialiased container-1 py-10">
      <div className="max-w-3xl md:max-w-lg mx-auto w-full px-4">
        <div className="bg-primary rounded-2xl pt-10 pb-10 px-8 shadow-xl border border-gray-100">
          <div className="flex items-center justify-center mb-6">
            {step === 1 ? (
              <Image
                src="/img/direction.png"
                alt="forgot-password"
                width={150}
                height={150}
                className="object-contain"
              />
            ) : (
              <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center">
                <Shield className="w-10 h-10 text-blue-600" />
              </div>
            )}
          </div>

          <div className="text-center gap-2 flex flex-col mb-6">
            <p className="text-xs font-semibold text-text/50 uppercase tracking-wider">
              Step {step} of 3
            </p>
            <h1 className="text-2xl font-bold text-text">
              {step === 1 && 'Forgot your password?'}
              {step === 2 && 'Verify your code'}
              {step === 3 && 'New password'}
            </h1>
            <p className="text-sm text-text/70">
              {step === 1 &&
                'Enter your account email. We’ll send a 6-digit code.'}
              {step === 2 && `Enter the code we sent to ${email}.`}
              {step === 3 &&
                'Your code is verified. Create a new password for this account.'}
            </p>
          </div>

          <FormSuccess message={success} />
          <FormError message={error} />

          {step === 1 && (
            <form onSubmit={handleSendCode} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-text hover:bg-secondary text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center shadow-lg disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Send code'
                )}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-6 mt-5">
              <div className="flex justify-between gap-2">
                {otp.map((digit, idx) => (
                  <Input
                    key={idx}
                    id={`forgot-otp-${idx}`}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={digit}
                    onChange={(e) => otpChange(idx, e.target.value)}
                    onKeyDown={(e) => otpKeyDown(idx, e)}
                    className="w-full h-14 text-center text-xl font-bold rounded-xl border-gray-200"
                    maxLength={1}
                    required
                  />
                ))}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-text hover:bg-secondary text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Verify code'
                )}
              </button>
              <p className="text-center text-sm text-text/70">
                Didn&apos;t get it?{' '}
                <button
                  type="button"
                  onClick={() => void handleResend()}
                  disabled={resendLoading || resendCooldown > 0 || isLoading}
                  className="font-semibold text-blue-600 hover:underline disabled:text-gray-400 disabled:no-underline"
                >
                  {resendLoading
                    ? 'Sending…'
                    : resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : 'Resend code'}
                </button>
              </p>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    clearMessages();
                  }}
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  Use a different email
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-5 mt-5">
              <div>
                <label className="block text-sm font-medium text-text/80 mb-1">
                  New password
                </label>
                <div className="relative mt-1">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-600"
                  >
                    {showPassword ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text/80 mb-1">
                  Confirm password
                </label>
                <div className="relative mt-1">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-text hover:bg-secondary text-white font-bold py-3.5 rounded-xl flex items-center justify-center disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Save new password'
                )}
              </button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep(2);
                    clearMessages();
                  }}
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  Back to code
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 text-center">
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to sign in</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
