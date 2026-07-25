'use client';

import { cn } from '../../utils/cn';
import { Separator } from '../../components/separator';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export interface SidebarNavProps {
  groups: NavGroup[];
  pathname: string;
  onNavigate?: () => void;
  renderLink: (props: {
    href: string;
    className: string;
    onClick?: () => void;
    children: React.ReactNode;
  }) => React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

/** Sidebar navigation with grouped links — pass data + link renderer */
export function SidebarNav({ groups, pathname, onNavigate, renderLink, header, footer }: SidebarNavProps) {
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {header && (
        <div className="flex h-14 items-center gap-2.5 px-5 border-b border-white/5 shrink-0">{header}</div>
      )}

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {groups.map((group, gi) => (
          <div key={group.label}>
            {gi > 0 && <Separator className="mb-4 bg-white/5" />}
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map(({ label, href, icon: Icon }) => (
                <li key={href}>
                  {renderLink({
                    href,
                    onClick: onNavigate,
                    className: cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive(href)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    ),
                    children: (
                      <>
                        <Icon className="h-4 w-4 shrink-0" />
                        {label}
                      </>
                    ),
                  })}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {footer && <div className="border-t border-white/5 p-3 shrink-0">{footer}</div>}
    </div>
  );
}
