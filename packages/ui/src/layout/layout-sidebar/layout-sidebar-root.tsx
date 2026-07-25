import { cn } from '../../utils/cn';

interface LayoutSidebarRootProps {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  sidebarWidth?: string;
  mainClassName?: string;
  className?: string;
}

/**
 * Sidebar layout — left nav + header + content + optional footer.
 * Use for: admin panels, dashboards, management consoles.
 */
export function LayoutSidebarRoot({
  sidebar,
  header,
  footer,
  children,
  sidebarWidth = 'w-60',
  mainClassName,
  className,
}: LayoutSidebarRootProps) {
  return (
    <div className={cn('flex h-screen bg-background', className)}>
      <aside className={cn('hidden md:block h-full shrink-0', sidebarWidth)}>{sidebar}</aside>
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {header}
        <main className={cn('flex-1 overflow-y-auto p-6', mainClassName)}>{children}</main>
        {footer}
      </div>
    </div>
  );
}
