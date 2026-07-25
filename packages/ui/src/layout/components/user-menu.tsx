'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Avatar, AvatarFallback } from '../../components/avatar';

export interface UserMenuItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'destructive';
  /** Show a divider line before this item */
  separator?: boolean;
}

interface UserMenuProps {
  displayName: string;
  initials: string;
  items: UserMenuItem[];
  className?: string;
}

/** Avatar dropdown menu — use in any header */
export function UserMenu({ displayName, initials, items, className }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className={cn('relative', className)} ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-sm hover:bg-accent transition-colors"
      >
        <Avatar className="h-6 w-6">
          <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
        </Avatar>
        <span className="hidden sm:inline font-medium">{displayName}</span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 rounded-lg border bg-card shadow-md z-50">
          <div className="p-1">
            {items.map((item, i) => (
              <div key={item.label}>
                {(item.separator || item.variant === 'destructive') && i > 0 && (
                  <div className="my-1 h-px bg-border" />
                )}
                <button
                  className={cn(
                    'flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-sm hover:bg-accent transition-colors',
                    item.variant === 'destructive' && 'text-destructive hover:text-destructive',
                  )}
                  onClick={() => {
                    setOpen(false);
                    item.onClick();
                  }}
                >
                  {item.icon}
                  {item.label}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Pre-built menu item factories */
UserMenu.ProfileItem = (onClick: () => void): UserMenuItem => ({
  label: 'Profile',
  icon: <User className="h-3.5 w-3.5" />,
  onClick,
});
UserMenu.SettingsItem = (onClick: () => void): UserMenuItem => ({
  label: 'Settings',
  icon: <Settings className="h-3.5 w-3.5" />,
  onClick,
});
UserMenu.SignOutItem = (onClick: () => void): UserMenuItem => ({
  label: 'Sign out',
  icon: <LogOut className="h-3.5 w-3.5" />,
  onClick,
  variant: 'destructive',
});
