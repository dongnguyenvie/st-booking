import Link from 'next/link';
import { cn } from '@repo/ui/utils/cn';
import type { RequestListing } from '@/mock/marketplace';
import { formatApr, formatMoney } from '../../../shared/format';

const STATUS_PILL: Record<string, { label: string; className: string }> = {
  open: { label: 'Not priced', className: 'bg-mk-ink-08 text-mk-ink-60' },
  offered: { label: 'Offered', className: 'bg-mk-gain-soft text-mk-gain' },
  passed: { label: 'Passed', className: 'bg-mk-loss-soft text-mk-loss' },
  signed: { label: 'Signed', className: 'bg-mk-clay-soft text-mk-clay-deep' },
  funded: { label: 'Funded', className: 'bg-mk-info-soft text-mk-info' },
};

/** True when the borrower moved last — this row is waiting on us. */
function needsReply(deal: RequestListing): boolean {
  const kind = deal.myOffer?.activity.kind;
  return kind === 'countered' || kind === 'shaped';
}

export function DealRow({ deal }: { deal: RequestListing }) {
  const pill = STATUS_PILL[deal.deskStatus] ?? STATUS_PILL.open!;
  const waiting = needsReply(deal);

  return (
    <li className="border-b border-mk-line last:border-b-0">
      <Link
        href={`/marketplace/lender/deals/${deal.id}`}
        className={cn(
          'grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-3.5 transition-colors hover:bg-mk-paper md:grid-cols-[1fr_auto_auto_auto_auto]',
          waiting && 'shadow-[inset_3px_0_0_var(--color-mk-clay)]',
        )}
      >
        <div className="min-w-0">
          <p className="truncate text-[13.5px] font-semibold">
            {deal.borrower}
            {waiting && <span className="ml-2 text-[11px] font-medium text-mk-clay">Needs reply</span>}
          </p>
          <p className="truncate text-[11.5px] text-mk-ink-45">
            {deal.product} · {deal.purpose} · posted {deal.postedAgo}
          </p>
        </div>

        <p className="text-right text-[14px] font-semibold tabular-nums">{formatMoney(deal.amount)}</p>

        {/* Competitive signal — how crowded this deal already is. */}
        <p className="hidden text-right text-[12.5px] tabular-nums text-mk-ink-60 md:block">
          {deal.offerCount} offers
        </p>
        <p className="hidden text-right text-[12.5px] tabular-nums text-mk-ink-60 md:block">
          best {formatApr(deal.bestApr)}
        </p>

        <div className="flex justify-end">
          <span className={cn('inline-flex h-5 items-center rounded-full px-2 text-[10.5px] font-medium', pill.className)}>
            {pill.label}
          </span>
        </div>
      </Link>
    </li>
  );
}
