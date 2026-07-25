import { cn } from '../../utils/cn';

interface LayoutSidebarFooterProps {
  children?: React.ReactNode;
  className?: string;
}

/** Footer for sidebar layout */
export function LayoutSidebarFooter({ children, className }: LayoutSidebarFooterProps) {
  return (
    <footer
      className={cn(
        'flex items-center justify-between border-t bg-card px-6 py-2 text-xs text-muted-foreground shrink-0',
        className,
      )}
    >
      {children ?? <span>&copy; {new Date().getFullYear()} Carousel Marketplace</span>}
    </footer>
  );
}
