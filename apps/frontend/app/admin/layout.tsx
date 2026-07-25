import { Suspense } from 'react';
import { LayoutSidebarRoot } from '@repo/ui/layout/layout-sidebar';
import { AdminSidebar } from '@/modules/admin/layout/admin-sidebar';
import { AdminHeader } from '@/modules/admin/layout/admin-header';
import { AccessRedirectToastListener } from '@/hooks/access-redirect-toast-listener';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutSidebarRoot sidebar={<AdminSidebar />} header={<AdminHeader />}>
      <Suspense>
        <AccessRedirectToastListener />
      </Suspense>
      {children}
    </LayoutSidebarRoot>
  );
}
