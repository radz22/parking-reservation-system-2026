'use client';

import { useSession, signOut } from 'next-auth/react';

interface AdminHeaderProps {
  title: string;
  description?: string;
}

export function AdminHeader({ title, description }: AdminHeaderProps) {
  const { data: session } = useSession();
  const userData = session?.user;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          {userData && (
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {userData.username}
              </p>
              <p className="text-xs text-gray-500">{userData.email}</p>
            </div>
          )}
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="px-3 py-1 border rounded text-sm text-gray-700 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
