import { cn } from '../../utils/cn';

interface LayoutCenteredFooterProps {
  children?: React.ReactNode;
  className?: string;
}

/** Centered footer — copyright, links */
export function LayoutCenteredFooter({ children, className }: LayoutCenteredFooterProps) {
  return (
    <footer
      className={cn(
        'flex items-center justify-center border-t px-4 py-3 text-xs text-muted-foreground shrink-0',
        className,
      )}
    >
      {children ?? <span>&copy; {new Date().getFullYear()} Carousel Marketplace</span>}
    </footer>
  );
}
