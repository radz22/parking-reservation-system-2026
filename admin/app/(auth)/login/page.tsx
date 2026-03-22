import { Suspense } from 'react';
import { Login } from '@/components/login/login';
import { Loading } from '@/components/loading/loading';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <Loading />
        </div>
      }
    >
      <Login />
    </Suspense>
  );
}
