import { DashboardStatCards } from './components/dashboard-stat-cards';
import { RecentActivityAgGrid } from './components/recent-activity-ag-grid';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card';

export function DashboardPageFeature() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back. Here's what's happening.</p>
      </div>

      <DashboardStatCards />

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentActivityAgGrid />
        </CardContent>
      </Card>
    </div>
  );
}
