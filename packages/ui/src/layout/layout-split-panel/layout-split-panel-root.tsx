import { cn } from '../../utils/cn';

interface LayoutSplitPanelRootProps {
  header: React.ReactNode;
  footer?: React.ReactNode;
  left: React.ReactNode;
  right: React.ReactNode;
  leftWidth?: string;
  showLeftOnMobile?: boolean;
  className?: string;
}

/**
 * Two-panel master-detail with header + optional footer.
 * Use for: email/chat, file managers, order detail, CRM.
 */
export function LayoutSplitPanelRoot({
  header,
  footer,
  left,
  right,
  leftWidth = 'w-80',
  showLeftOnMobile = false,
  className,
}: LayoutSplitPanelRootProps) {
  return (
    <div className={cn('flex h-screen flex-col bg-background', className)}>
      {header}
      <div className="flex flex-1 overflow-hidden">
        <div
          className={cn(
            'shrink-0 border-r overflow-y-auto',
            leftWidth,
            showLeftOnMobile ? 'block' : 'hidden md:block',
          )}
        >
          {left}
        </div>
        <div className="flex-1 overflow-y-auto">{right}</div>
      </div>
      {footer}
    </div>
  );
}
