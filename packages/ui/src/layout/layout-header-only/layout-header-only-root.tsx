import { cn } from '../../utils/cn';

interface LayoutHeaderOnlyRootProps {
  header: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  mainClassName?: string;
  className?: string;
}

/**
 * Header + content + optional footer (no sidebar).
 * Use for: POS terminals, kiosk mode, simple apps.
 */
export function LayoutHeaderOnlyRoot({
  header,
  footer,
  children,
  mainClassName,
  className,
}: LayoutHeaderOnlyRootProps) {
  return (
    <div className={cn('flex h-screen flex-col bg-background', className)}>
      {header}
      <main className={cn('flex-1 overflow-y-auto p-4', mainClassName)}>{children}</main>
      {footer}
    </div>
  );
}
