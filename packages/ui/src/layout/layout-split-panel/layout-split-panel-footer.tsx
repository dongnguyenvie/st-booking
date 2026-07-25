import { cn } from '../../utils/cn';

interface LayoutSplitPanelFooterProps {
  children?: React.ReactNode;
  className?: string;
}

/** Footer spanning both panels */
export function LayoutSplitPanelFooter({ children, className }: LayoutSplitPanelFooterProps) {
  return (
    <footer
      className={cn(
        'flex items-center justify-between border-t bg-card px-4 md:px-6 py-2 text-xs text-muted-foreground shrink-0',
        className,
      )}
    >
      {children}
    </footer>
  );
}
