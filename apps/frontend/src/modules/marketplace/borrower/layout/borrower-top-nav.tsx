'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeftRight } from 'lucide-react';
import { cn } from '@repo/ui/utils/cn';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { workspaceA, workspaceS } from '@/store/modules/marketplace/borrower/workspace';
import { AccountSwitcher } from './account-switcher';
import { BORROWER_NAV_LINKS } from './borrower-nav-links';

/** Sticky top bar: account switcher on the left, surface tabs on the right. */
export function BorrowerTopNav() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const activeAccountId = useAppSelector(workspaceS.selectActiveAccountId);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-mk-line bg-mk-paper/85 px-5 backdrop-blur-md">
      <div className="flex min-w-0 items-center gap-2.5">
        <AccountSwitcher />
        <span className="hidden h-6 w-px shrink-0 bg-mk-line-2 lg:block" />
        {/* Fast toggle for the same switch the dropdown offers — the prototype
            keeps both because switching worlds is the most common action. */}
        <div className="hidden gap-0.5 rounded-full bg-mk-paper-2 p-[3px] lg:inline-flex">
          {(
            [
              ['business', 'For my business'],
              ['personal', 'For myself'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => dispatch(workspaceA.setActiveAccount(id))}
              className={cn(
                'h-[30px] whitespace-nowrap rounded-full px-3.5 text-[12.5px] font-semibold transition-all',
                activeAccountId === id
                  ? 'bg-mk-card text-mk-ink shadow-sm'
                  : 'text-mk-ink-60 hover:text-mk-ink',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <nav className="flex shrink-0 items-center gap-1">
        {BORROWER_NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex h-9 items-center gap-2 rounded-full px-3 text-[13px] transition-colors',
                active ? 'bg-mk-ink text-mk-paper' : 'text-mk-ink-60 hover:bg-mk-ink-08 hover:text-mk-ink',
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden xl:inline">{label}</span>
            </Link>
          );
        })}

        {/* The prototype keeps a switch between the two sides of the venue. */}
        <Link
          href="/marketplace/lender/deals"
          title="Switch to the lender desk"
          className="ml-1 flex h-9 items-center gap-2 rounded-full border border-mk-line px-3 text-[13px] text-mk-ink-60 transition-colors hover:border-mk-line-2 hover:text-mk-ink"
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
          <span className="hidden xl:inline">Lender desk</span>
        </Link>
      </nav>
    </header>
  );
}
