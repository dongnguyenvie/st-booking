import { cn } from '../../utils/cn';

interface LayoutHeaderOnlyHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

/** Full-width header for header-only layout */
export function LayoutHeaderOnlyHeader({ children, className }: LayoutHeaderOnlyHeaderProps) {
  return (
    <header
      className={cn('flex h-14 items-center justify-between border-b bg-card px-4 shrink-0', className)}
    >
      {children}
    </header>
  );
}
