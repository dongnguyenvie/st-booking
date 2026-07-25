'use client';

import { Bell, Menu, ArrowLeftRight } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import { Badge } from '@repo/ui/components/badge';
import { Sheet, SheetContent } from '@repo/ui/components/sheet';
import { LayoutSidebarHeader } from '@repo/ui/layout/layout-sidebar';
import { UserMenu, type UserMenuItem } from '@repo/ui/layout/components';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarNavContent } from './sidebar-nav-content';
import { useAuth0 } from '@auth0/auth0-react';
import { authA } from '@/store/modules/auth';
import { ROUTES } from '@/core/routes';
import { getAccessibleSurfaces } from '@/core/get-home-route-by-privileges';

export function AdminHeader() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { logout: auth0Logout } = useAuth0();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const displayName = user?.email ?? user?.name ?? 'Admin';
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : user?.email
      ? user.email.slice(0, 2).toUpperCase()
      : 'AD';

  function handleSignOut() {
    dispatch(authA.logout());
    auth0Logout({ logoutParams: { returnTo: window.location.origin + ROUTES.auth.login } });
  }

  /** Switcher items — surfaces the user can reach other than the current Admin one. */
  const switcherItems: UserMenuItem[] = (() => {
    if (!user) return [];
    const others = getAccessibleSurfaces(user).filter((s) => s.key !== 'admin');
    return others.map((s, i) => ({
      label: `Switch to ${s.label}`,
      icon: <ArrowLeftRight className="h-3.5 w-3.5" />,
      separator: i === 0,
      onClick: () => router.push(s.route),
    }));
  })();

  return (
    <LayoutSidebarHeader onMenuToggle={() => setDrawerOpen(true)}>
      {/* Mobile sidebar drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="left" className="w-60 p-0 bg-sidebar border-none">
          <SidebarNavContent email={user?.email ?? ''} onNavigate={() => setDrawerOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Notifications */}
      <div className="relative">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <Badge
          variant="destructive"
          className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px]"
        >
          3
        </Badge>
      </div>

      <UserMenu
        displayName={displayName}
        initials={initials}
        items={[
          UserMenu.ProfileItem(() => {}),
          UserMenu.SettingsItem(() => {}),
          ...switcherItems,
          UserMenu.SignOutItem(handleSignOut),
        ]}
      />
    </LayoutSidebarHeader>
  );
}
