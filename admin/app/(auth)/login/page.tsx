// app/login/page.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Suspense } from 'react';
import { Login } from '@/components/login/login';
import { Loading } from '@/components/loading/loading';

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    if (session.user.role?.toUpperCase() === 'ADMIN') {
      redirect('/admin/dashboard');
    } else {
      redirect('/');
    }
  }

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
