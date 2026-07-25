'use client';

import { Menu } from 'lucide-react';
import { cn } from '../../utils/cn';

interface LayoutSidebarHeaderProps {
  children?: React.ReactNode;
  onMenuToggle?: () => void;
  className?: string;
}

/** Header for sidebar layout — includes mobile hamburger trigger */
export function LayoutSidebarHeader({ children, onMenuToggle, className }: LayoutSidebarHeaderProps) {
  return (
    <header
      className={cn(
        'flex h-14 items-center justify-between border-b bg-card px-4 md:px-6 shrink-0',
        className,
      )}
    >
      {onMenuToggle && (
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-md hover:bg-accent"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}
      <div className="hidden md:block" />
      <div className="flex items-center gap-2">{children}</div>
    </header>
  );
}
