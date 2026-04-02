'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { LoginSchemaType } from '@/schemas/login-schema';

type SignInResult = { success: boolean; message?: string };

const ADMIN_ROLE = 'ADMIN';

const useAdminAuth = () => {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSignIn = async (data: LoginSchemaType): Promise<SignInResult> => {
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

      if (!result?.ok) {
        throw new Error('Authentication failed. Please try again.');
      }

      // Fetch session to check role
      const sessionResponse = await fetch('/api/auth/session');
      const session = await sessionResponse.json();

      if (!session?.user?.role) {
        throw new Error('User role is undefined. Please contact support.');
      }

      if (session.user.role.toUpperCase() !== ADMIN_ROLE) {
        throw new Error('Access denied. Admins only.');
      }

      // Determine redirect path
      let redirectPath = '/admin/dashboard';
      if (redirectParam) {
        try {
          const decodedRedirect = decodeURIComponent(redirectParam);
          if (
            decodedRedirect.startsWith('/') &&
            !decodedRedirect.startsWith('//')
          ) {
            redirectPath = decodedRedirect;
          }
        } catch {
          console.warn(
            'Redirect URL decoding failed, using default admin path.',
          );
        }
      }

      setSuccess('Access Granted. Redirecting...');

      // Redirect after short delay
      setTimeout(() => {
        window.location.href = redirectPath;
      }, 1000);

      return { success: true };
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

export default useAdminAuth;
