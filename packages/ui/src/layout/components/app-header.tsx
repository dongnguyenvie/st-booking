import { cn } from '../../utils/cn';

interface AppHeaderProps {
  children: React.ReactNode;
  className?: string;
}

/** Shared header bar — 56px height, border bottom, flex between */
export function AppHeader({ children, className }: AppHeaderProps) {
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
