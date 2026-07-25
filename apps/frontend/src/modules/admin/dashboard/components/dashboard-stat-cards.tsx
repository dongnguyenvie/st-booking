'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card';
import { Badge } from '@repo/ui/components/badge';
import { Users, UserCheck, ShieldCheck } from 'lucide-react';
import { useDashboardStats } from '../hooks/use-dashboard-stats';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  iconVariant: 'info' | 'success' | 'violet';
  loading?: boolean;
}

const iconWrapperClass = {
  info: 'bg-info-subtle text-info',
  success: 'bg-success-subtle text-success',
  violet: 'bg-violet-subtle text-primary',
};

function StatCard({ label, value, icon: Icon, iconVariant, loading }: StatCardProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconWrapperClass[iconVariant]}`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 w-20 animate-pulse rounded bg-muted" />
        ) : (
          <p className="text-2xl font-bold tracking-tight">{value.toLocaleString()}</p>
        )}
        <Badge variant="secondary" className="mt-1 text-[10px]">
          live
        </Badge>
      </CardContent>
    </Card>
  );
}

export function DashboardStatCards() {
  const { stats, loading, fetch } = useDashboardStats();

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        label="Total Users"
        value={stats?.totalUsers ?? 0}
        icon={Users}
        iconVariant="info"
        loading={loading}
      />
      <StatCard
        label="Active Users"
        value={stats?.activeUsers ?? 0}
        icon={UserCheck}
        iconVariant="success"
        loading={loading}
      />
      <StatCard
        label="Roles"
        value={stats?.totalRoles ?? 0}
        icon={ShieldCheck}
        iconVariant="violet"
        loading={loading}
      />
    </div>
  );
}
