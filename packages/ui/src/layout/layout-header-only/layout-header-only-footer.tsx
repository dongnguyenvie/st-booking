import { cn } from '../../utils/cn';

interface LayoutHeaderOnlyFooterProps {
  children?: React.ReactNode;
  className?: string;
}

/** Bottom footer for header-only layout */
export function LayoutHeaderOnlyFooter({ children, className }: LayoutHeaderOnlyFooterProps) {
  return (
    <footer
      className={cn(
        'flex items-center justify-between border-t bg-card px-4 py-2 text-xs text-muted-foreground shrink-0',
        className,
      )}
    >
      {children}
    </footer>
  );
}
