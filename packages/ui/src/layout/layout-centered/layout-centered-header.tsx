import { cn } from '../../utils/cn';

interface LayoutCenteredHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

/** Minimal header for centered layout */
export function LayoutCenteredHeader({ children, className }: LayoutCenteredHeaderProps) {
  return (
    <header
      className={cn(
        'flex h-14 items-center justify-between border-b bg-card px-4 md:px-6 shrink-0',
        className,
      )}
    >
      {children}
    </header>
  );
}
