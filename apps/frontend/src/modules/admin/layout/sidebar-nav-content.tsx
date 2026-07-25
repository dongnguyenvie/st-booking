'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarNav, type NavGroup } from '@repo/ui/layout/components';
import {
  Building2,
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  ShieldCheck,
  Blocks,
  KeyRound,
  Store,
  Landmark,
} from 'lucide-react';

const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    ],
  },
  {
    // The product itself, reachable from the back office. Both entries need the
    // matching marketplace privilege — an admin-only account is bounced by the
    // edge guard in proxy.ts.
    label: 'Marketplace',
    items: [
      { label: 'Borrower portal', href: '/marketplace/borrower/offers', icon: Store },
      { label: 'Lender desk', href: '/marketplace/lender/deals', icon: Landmark },
    ],
  },
  {
    label: 'Management',
    items: [
      { label: 'Users', href: '/admin/users', icon: Users },
      { label: 'Permissions', href: '/admin/permissions', icon: ShieldCheck },
      { label: 'API Keys', href: '/admin/api-keys', icon: KeyRound },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Components', href: '/admin/components', icon: Blocks },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
      { label: 'Security', href: '/settings/security', icon: ShieldCheck },
    ],
  },
];

interface SidebarNavContentProps {
  onNavigate?: () => void;
  email?: string;
}

export function SidebarNavContent({ onNavigate, email = 'admin@carousel-marketplace.io' }: SidebarNavContentProps) {
  const pathname = usePathname();

  return (
    <SidebarNav
      groups={navGroups}
      pathname={pathname}
      onNavigate={onNavigate}
      renderLink={({ href, className, onClick, children }) => (
        <Link href={href} onClick={onClick} className={className}>
          {children}
        </Link>
      )}
      header={
        <>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-semibold text-white tracking-tight">Carousel Marketplace</span>
        </>
      }
      footer={
        <div className="flex items-center gap-3 rounded-md px-3 py-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
            A
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-white">Admin</p>
            <p className="truncate text-[10px] text-sidebar-foreground/50">{email}</p>
          </div>
        </div>
      }
    />
  );
}
