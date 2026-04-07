'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Car,
  QrCode,
  History,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/parking-slot', label: 'Parking Slot', icon: Car },
  { href: '/admin/history', label: 'History', icon: History },
  { href: '/admin/qr-scanning', label: 'QR Scanning', icon: QrCode },
  { href: '/admin/users', label: 'Users', icon: Users },
];
export function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  if (!isMounted) {
    return null;
  }
  const sidebarContent = (
    <>
      <div className="p-6 border-b border-gray-100">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Premium Parking"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <div>
            <h1 className="font-bold text-gray-900 text-lg">Premium Parking</h1>
            <p className="text-xs text-gray-500">Admin Portal</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
          onClick={handleSignOut}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </>
  );

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </Button>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col z-50 transition-transform lg:hidden',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {sidebarContent}
      </aside>

      <aside className="hidden lg:flex fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 flex-col">
        {sidebarContent}
      </aside>
    </>
  );
}
