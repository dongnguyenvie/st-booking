import { cn } from '../../utils/cn';

interface AppFooterProps {
  children: React.ReactNode;
  className?: string;
}

/** Shared footer bar — border top, flex between */
export function AppFooter({ children, className }: AppFooterProps) {
  return (
    <footer
      className={cn(
        'flex items-center justify-between border-t bg-card px-4 md:px-6 py-3 shrink-0',
        className,
      )}
    >
      {children}
    </footer>
  );
}
