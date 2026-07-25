'use client';

import { Check, ChevronDown, Clock } from 'lucide-react';
import { cn } from '@repo/ui/utils/cn';
import { useAppDispatch, useAppSelector } from '@/store/store';
import type { Stip, StipState } from '@/mock/marketplace';
import { fundingRoomA, fundingRoomS } from '@/store/modules/marketplace/borrower/funding-room';

const STATE_LABEL: Record<StipState, string> = {
  todo: 'Requested',
  submitted: 'In review',
  approved: 'Approved',
  returned: 'Returned',
};

export function StipRow({ stip }: { stip: Stip }) {
  const dispatch = useAppDispatch();
  const expandedId = useAppSelector(fundingRoomS.selectExpandedStipId);
  const expanded = expandedId === stip.id;
  const approved = stip.state === 'approved';

  return (
    <li className="border-b border-mk-line last:border-b-0">
      <div className="flex items-center gap-3 px-5 py-3.5">
        <span
          className={cn(
            'flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
            approved ? 'bg-mk-gain-soft text-mk-gain' : 'bg-mk-ink-08 text-mk-ink-45',
          )}
        >
          {approved ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : <Clock className="h-3.5 w-3.5" />}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium">{stip.title}</p>
          <p className="truncate text-[11.5px] text-mk-ink-45">{stip.subtitle}</p>
        </div>

        <span
          className={cn(
            'hidden h-5 items-center rounded-full px-2 text-[10.5px] font-medium sm:inline-flex',
            approved ? 'bg-mk-gain-soft text-mk-gain' : 'bg-mk-warn-soft text-mk-warn',
          )}
        >
          {STATE_LABEL[stip.state]}
        </span>

        {stip.state === 'todo' && stip.cta && (
          <button
            type="button"
            onClick={() => dispatch(fundingRoomA.submitStip(stip.id))}
            className="h-7 shrink-0 rounded-full bg-mk-ink px-3 text-[11.5px] font-medium text-mk-paper transition-colors hover:bg-mk-ink-2"
          >
            {stip.cta}
          </button>
        )}

        <button
          type="button"
          onClick={() => dispatch(fundingRoomA.toggleStip(stip.id))}
          aria-expanded={expanded}
          aria-label={`${expanded ? 'Hide' : 'Show'} history for ${stip.title}`}
          className="shrink-0 rounded-full p-1 text-mk-ink-45 hover:bg-mk-ink-08 hover:text-mk-ink"
        >
          <ChevronDown className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')} />
        </button>
      </div>

      {expanded && (
        <ol className="space-y-2 border-t border-mk-line bg-mk-paper-2 px-5 py-3.5">
          {stip.history.map((h, i) => (
            <li key={`${h.at}-${i}`} className="flex gap-3 text-[11.5px]">
              <span className="w-32 shrink-0 tabular-nums text-mk-ink-45">{h.at}</span>
              <span className="w-16 shrink-0 font-medium">{h.who}</span>
              <span className="text-mk-ink-60">{h.what}</span>
            </li>
          ))}
        </ol>
      )}
    </li>
  );
}
