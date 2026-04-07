'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const SetPassword = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/forgot-password');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-body">
      <p className="text-text/70 text-sm">Redirecting to password reset…</p>
    </div>
  );
};
