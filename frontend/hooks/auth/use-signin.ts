'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { LoginRequest } from '@/types/auth';

function getRoleBasedRedirect(role: string): string {
  const roleMap: Record<string, string> = {
    USER: '/',
  };
  return roleMap[role.toUpperCase()] || '/';
}

type SignInResult = { success: boolean; message?: string };

const useAuth = () => {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSignIn = async (data: LoginRequest): Promise<SignInResult> => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const redirectParam = searchParams.get('callbackUrl');

      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(
          result.error === 'CredentialsSignin'
            ? 'Wrong email or password.'
            : result.error,
        );
      }

      if (result?.ok) {
        const sessionResponse = await fetch(`/api/auth/session`);
        const session = await sessionResponse.json();

        if (session?.user?.role) {
          let redirectPath = getRoleBasedRedirect(session.user.role);

          if (redirectParam) {
            try {
              const decodedRedirect = decodeURIComponent(redirectParam);
              if (
                decodedRedirect.startsWith('/') &&
                !decodedRedirect.startsWith('//')
              ) {
                redirectPath = decodedRedirect;
              }
            } catch (err) {
              console.error('Redirect URL decoding failed:', err);
            }
          }

          setSuccess('Access Granted. Redirecting...');

          setTimeout(() => {
            window.location.href = redirectPath;
          }, 1000);

          return { success: true };
        } else {
          throw new Error('User role is undefined. Please contact support.');
        }
      } else {
        throw new Error('Authentication failed. Please try again.');
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as Error).message || 'An unexpected error occurred.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    handleSignIn,
    setError,
    setSuccess,
  };
};

export default useAuth;
