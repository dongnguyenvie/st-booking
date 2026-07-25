import { cn } from '../../utils/cn';

interface LayoutCenteredRootProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
  className?: string;
}

/**
 * Centered content with optional header + footer.
 * Use for: auth pages, settings, forms, onboarding, error pages.
 */
export function LayoutCenteredRoot({
  header,
  footer,
  children,
  maxWidth = 'max-w-2xl',
  className,
}: LayoutCenteredRootProps) {
  return (
    <div className={cn('flex h-screen flex-col bg-background', className)}>
      {header}
      <main className="flex-1 overflow-y-auto">
        <div className={cn('mx-auto w-full px-4 py-8', maxWidth)}>{children}</div>
      </main>
      {footer}
    </div>
  );
}
