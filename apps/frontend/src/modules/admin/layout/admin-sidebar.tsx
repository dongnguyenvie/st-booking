import { SidebarNavContent } from './sidebar-nav-content';

/** Desktop sidebar — hidden on mobile via layout */
export function AdminSidebar() {
  return (
    <aside className="h-full w-60 shrink-0">
      <SidebarNavContent />
    </aside>
  );
}
