import { cn } from '../../utils/cn';

interface LayoutSplitPanelHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

/** Full-width header spanning both panels */
export function LayoutSplitPanelHeader({ children, className }: LayoutSplitPanelHeaderProps) {
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
