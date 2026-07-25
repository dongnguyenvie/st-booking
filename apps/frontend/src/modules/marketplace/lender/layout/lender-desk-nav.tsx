'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ArrowLeftRight } from 'lucide-react';
import { cn } from '@repo/ui/utils/cn';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { MOCK_LENDER_DESK } from '@/mock/marketplace';
import { lenderWorkspaceA, lenderWorkspaceS } from '@/store/modules/marketplace/lender/workspace';
import { LenderMark } from '../../shared/lender-mark';
import { LENDER_NAV_LINKS } from './lender-nav-links';

/**
 * Desk chrome. The prototype gives the lender a sidebar rather than the
 * borrower's top nav: a desk triages a queue all day, so the nav has to carry
 * live counts and stay on screen.
 */
export function LenderDeskNav() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const needsReply = useAppSelector(lenderWorkspaceS.selectNeedsReplyCount);

  // The shell owns this count, so it survives page navigation.
  useEffect(() => {
    dispatch(lenderWorkspaceA.init());
  }, [dispatch]);

  return (
    <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col border-r border-mk-line px-4 py-5">
      <div className="flex items-center gap-2.5">
        <LenderMark short={MOCK_LENDER_DESK.short} size={30} />
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold">{MOCK_LENDER_DESK.name}</p>
          <p className="text-[10.5px] text-mk-ink-45">Lender desk</p>
        </div>
      </div>

      <nav className="mt-6 flex flex-col gap-0.5">
        {LENDER_NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13px] transition-colors',
                active ? 'bg-mk-ink text-mk-paper' : 'text-mk-ink-60 hover:bg-mk-ink-08 hover:text-mk-ink',
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
              {needsReply > 0 && (
                <span
                  className={cn(
                    'ml-auto rounded-full px-1.5 text-[11px] tabular-nums',
                    active ? 'bg-white/20 text-mk-paper' : 'bg-mk-ink-08 text-mk-ink-60',
                  )}
                >
                  {needsReply}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-mk-line pt-3">
        <p className="px-2.5 text-[12.5px] font-medium">{MOCK_LENDER_DESK.operator}</p>
        <p className="px-2.5 text-[10.5px] text-mk-ink-45">{MOCK_LENDER_DESK.role}</p>
        {/* The prototype keeps a switch between the two sides of the venue. */}
        <Link
          href="/marketplace/borrower/offers"
          className="mt-3 flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[12.5px] text-mk-ink-60 transition-colors hover:bg-mk-ink-08 hover:text-mk-ink"
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
          Borrower view
        </Link>
      </div>
    </aside>
  );
}
