import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card';
import { Badge } from '@repo/ui/components/badge';
import { TrendingUp, TrendingDown, Users, Eye, MousePointerClick, Clock } from 'lucide-react';

interface MetricCard {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ElementType;
  iconVariant: 'info' | 'success' | 'violet' | 'warning';
}

const metrics: MetricCard[] = [
  {
    label: 'Page Views',
    value: '142,580',
    change: '+14.3%',
    trend: 'up',
    icon: Eye,
    iconVariant: 'info',
  },
  {
    label: 'Unique Visitors',
    value: '38,920',
    change: '+6.8%',
    trend: 'up',
    icon: Users,
    iconVariant: 'success',
  },
  {
    label: 'Click-Through',
    value: '4.72%',
    change: '-0.4%',
    trend: 'down',
    icon: MousePointerClick,
    iconVariant: 'warning',
  },
  {
    label: 'Avg. Session',
    value: '3m 42s',
    change: '+12.1%',
    trend: 'up',
    icon: Clock,
    iconVariant: 'violet',
  },
];

const iconWrapperClass: Record<MetricCard['iconVariant'], string> = {
  info: 'bg-info-subtle text-info',
  success: 'bg-success-subtle text-success',
  violet: 'bg-violet-subtle text-primary',
  warning: 'bg-warning-subtle text-warning',
};

interface TopPage {
  path: string;
  views: number;
  bounce: string;
}

const TOP_PAGES: TopPage[] = [
  { path: '/dashboard', views: 28_410, bounce: '22%' },
  { path: '/users', views: 14_830, bounce: '31%' },
  { path: '/analytics', views: 11_200, bounce: '18%' },
  { path: '/permissions', views: 8_540, bounce: '27%' },
  { path: '/settings', views: 5_920, bounce: '35%' },
];

interface TrafficSource {
  source: string;
  sessions: number;
  share: string;
}

const TRAFFIC_SOURCES: TrafficSource[] = [
  { source: 'Direct', sessions: 18_340, share: '47%' },
  { source: 'Organic Search', sessions: 11_220, share: '29%' },
  { source: 'Referral', sessions: 5_640, share: '14%' },
  { source: 'Social', sessions: 3_720, share: '10%' },
];

export function AnalyticsPageFeature() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Traffic and engagement overview for the last 30 days.</p>
      </div>

      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map(({ label, value, change, trend, icon: Icon, iconVariant }) => (
          <Card key={label} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconWrapperClass[iconVariant]}`}
              >
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tracking-tight">{value}</p>
              <div className="mt-1 flex items-center gap-1">
                {trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-success" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <Badge variant={trend === 'up' ? 'success' : 'destructive'} className="text-[10px]">
                  {change}
                </Badge>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Top pages */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-3 text-xs font-medium text-muted-foreground pb-1 border-b">
                <span>Page</span>
                <span className="text-right">Views</span>
                <span className="text-right">Bounce</span>
              </div>
              {TOP_PAGES.map(({ path, views, bounce }) => (
                <div key={path} className="grid grid-cols-3 text-sm py-1">
                  <span className="font-mono text-xs truncate">{path}</span>
                  <span className="text-right tabular-nums">{views.toLocaleString()}</span>
                  <span className="text-right text-muted-foreground">{bounce}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic sources */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {TRAFFIC_SOURCES.map(({ source, sessions, share }) => (
                <div key={source} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{source}</span>
                    <span className="text-muted-foreground">
                      {sessions.toLocaleString()} · {share}
                    </span>
                  </div>
                  {/* Simple progress bar */}
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: share }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
