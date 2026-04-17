'use client';

import React, { useEffect, useState } from 'react';
import { AdminHeader } from '@/components/admin/admin-header';
import {
  Users,
  Car,
  CalendarCheck,
  Clock,
  CheckCircle2,
  Ban,
  RefreshCcw,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import { Loading } from '@/components/loading/loading';
import apiClient from '@/lib/api-client';

interface Stats {
  totalUsers: number;
  totalSlots: number;
  activeReservations: number;
  availableSlots: number;
  totalCompleted: number;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  description: string;
  color: string;
}

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get(`/api/admin/dashboard`);
      setStats(res.data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.accessToken) {
      fetchStats();
    }
  }, [session]);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
    color,
  }: StatCardProps) => (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={`p-2 rounded-xl ${color} transition-transform group-hover:scale-110 duration-300`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-extrabold tracking-tight">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminHeader
        title={`Welcome back, ${session?.user?.username || 'Admin'}`}
        description="Here is what's happening with your parking system today."
      />

      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon={Users}
            description="Registered accounts"
            color="bg-blue-50 text-blue-600"
          />
          <StatCard
            title="Total Slots"
            value={stats?.totalSlots || 0}
            icon={Car}
            description="Available capacity"
            color="bg-indigo-50 text-indigo-600"
          />
          <StatCard
            title="Active Reservations"
            value={stats?.activeReservations || 0}
            icon={CalendarCheck}
            description="Booked or Occupied"
            color="bg-orange-50 text-orange-600"
          />
          <StatCard
            title="Completed"
            value={stats?.totalCompleted || 0}
            icon={CheckCircle2}
            description="Successfully checked out"
            color="bg-emerald-50 text-emerald-600"
          />
        </div>

        {/* Dashboard Sections */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4 border-none shadow-md">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                View the latest parking events and updates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground bg-gray-50/50 rounded-2xl border border-dashed">
                <Clock className="w-10 h-10 mb-4 opacity-20" />
                <p className="text-sm font-medium">
                  Activity logs will appear here
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Shortcut to frequent management tasks.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <button
                onClick={fetchStats}
                className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group flex items-center gap-3"
              >
                <RefreshCcw className="w-5 h-5 text-blue-500 group-hover:rotate-180 transition-transform duration-500" />
                <div>
                  <div className="font-semibold text-sm">Refresh Stats</div>
                  <div className="text-xs text-muted-foreground">
                    Update dashboard metrics
                  </div>
                </div>
              </button>
              <a
                href="/admin/users"
                className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all group flex items-center gap-3"
              >
                <Ban className="w-5 h-5 text-orange-500" />
                <div>
                  <div className="font-semibold text-sm">
                    Review Banned Users
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Manage user restrictions
                  </div>
                </div>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
