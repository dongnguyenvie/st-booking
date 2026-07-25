'use client';

import { ChevronDown } from 'lucide-react';
import { cn } from '@repo/ui/utils/cn';
import { useAppDispatch, useAppSelector } from '@/store/store';
import type { Funding } from '@/mock/marketplace';
import { findLender } from '@/mock/marketplace';
import { fundingsA, fundingsS } from '@/store/modules/marketplace/borrower/fundings';
import { LenderMark } from '../../../shared/lender-mark';
import { formatApr, formatMoney, formatTerm } from '../../../shared/format';

export function FundingRow({ funding }: { funding: Funding }) {
  const dispatch = useAppDispatch();
  const expandedId = useAppSelector(fundingsS.selectExpandedId);
  const expanded = expandedId === funding.id;
  const lender = findLender(funding.lenderId);

  return (
    <li className="border-b border-mk-line last:border-b-0">
      <button
        type="button"
        onClick={() => dispatch(fundingsA.toggleExpanded(funding.id))}
        aria-expanded={expanded}
        className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-mk-paper"
      >
        <LenderMark short={lender?.short ?? '·'} size={34} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-semibold">{lender?.name ?? funding.lenderId}</p>
          <p className="truncate text-[11.5px] text-mk-ink-45">
            {funding.product} · {funding.date}
          </p>
        </div>
        <p className="text-[15px] font-semibold tabular-nums">{formatMoney(funding.amount)}</p>
        <span
          className={cn(
            'hidden h-5 items-center rounded-full px-2 text-[10.5px] font-medium sm:inline-flex',
            funding.status === 'active'
              ? 'bg-mk-info-soft text-mk-info'
              : 'bg-mk-ink-08 text-mk-ink-60',
          )}
        >
          {funding.status === 'active' ? 'Active' : 'Closed'}
        </span>
        <ChevronDown
          className={cn('h-4 w-4 shrink-0 text-mk-ink-45 transition-transform', expanded && 'rotate-180')}
        />
      </button>

      {expanded && (
        <dl className="grid grid-cols-2 gap-4 border-t border-mk-line bg-mk-paper-2 px-5 py-4 sm:grid-cols-4">
          {[
            ['APR', formatApr(funding.apr)],
            ['Term', formatTerm(funding.term)],
            ['Product', funding.product],
            ['Funded', funding.date],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-[10.5px] uppercase tracking-[0.12em] text-mk-ink-45">{label}</dt>
              <dd className="mt-0.5 text-[13px] tabular-nums">{value}</dd>
            </div>
          ))}
          <div className="col-span-2 sm:col-span-4">
            <dt className="text-[10.5px] uppercase tracking-[0.12em] text-mk-ink-45">Purpose</dt>
            <dd className="mt-0.5 text-[13px] text-mk-ink-60">{funding.purpose}</dd>
          </div>
        </dl>
      )}
    </li>
  );
}
