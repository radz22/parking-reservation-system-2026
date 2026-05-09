import { Profile } from '@/components/home/profile';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/sign-in');
  }
  return <Profile />;
}
