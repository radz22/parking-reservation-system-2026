import { SignInPage } from '@/components/home/sign-in';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Loading } from '@/components/loading/loading';

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/');
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loading />
        </div>
      }
    >
      <SignInPage />
    </Suspense>
  );
}
