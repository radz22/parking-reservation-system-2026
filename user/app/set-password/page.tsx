import { Suspense } from 'react';
import { SetPassword } from '@/components/home/set-password';

export default function SetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading…
        </div>
      }
    >
      <SetPassword />
    </Suspense>
  );
}
