import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@repo/ui/utils/cn';
import type { Offer } from '@/mock/marketplace';
import { findLender } from '@/mock/marketplace';
import { LenderMark } from '../../../shared/lender-mark';
import { StagePill } from '../../../shared/stage-pill';
import { aprDelta, formatApr, formatMoney, formatTerm } from '../../../shared/format';

interface OfferRowProps {
  offer: Offer;
  /** Best offer on the board gets a clay spine and the rank badge. */
  isBest?: boolean;
  /** Under LOI every other offer is dimmed and unclickable (BUSINESS-LOGIC §5). */
  locked?: boolean;
}

export function OfferRow({ offer, isBest = false, locked = false }: OfferRowProps) {
  const lender = findLender(offer.lenderId);
  const delta = aprDelta(offer.apr, offer.previousApr);
  const cheaper = delta < 0;

  const content = (
    <>
      <div className="flex min-w-0 items-center gap-3">
        <LenderMark short={lender?.short ?? '·'} size={34} />
        <div className="min-w-0">
          <p className="truncate text-[13.5px] font-semibold">{lender?.name ?? offer.lenderId}</p>
          <p className="truncate text-[11.5px] text-mk-ink-45">
            {offer.note ?? `${lender?.kind ?? 'Financing'} · received ${offer.receivedOn}`}
          </p>
        </div>
      </div>

      <div className="text-right tabular-nums">
        <p className="text-[15px] font-semibold">{formatApr(offer.apr)}</p>
        {delta !== 0 && (
          <p
            className={cn(
              'flex items-center justify-end gap-0.5 text-[11px]',
              cheaper ? 'text-mk-gain' : 'text-mk-loss',
            )}
          >
            {cheaper ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
            {Math.abs(delta).toFixed(2)}
          </p>
        )}
      </div>

      <p className="hidden text-right text-[13px] tabular-nums text-mk-ink-60 sm:block">
        {formatMoney(offer.payment)}/mo
      </p>
      <p className="hidden text-right text-[13px] tabular-nums text-mk-ink-60 md:block">
        {formatTerm(offer.term)}
      </p>
      <p className="hidden text-right text-[13px] tabular-nums text-mk-ink-60 lg:block">
        {formatMoney(offer.amount)}
      </p>

      <div className="flex justify-end">
        <StagePill stage={offer.stage} />
      </div>
    </>
  );

  const gridClass = cn(
    'grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-3.5 sm:grid-cols-[1fr_auto_auto_auto] md:grid-cols-[1fr_auto_auto_auto_auto] lg:grid-cols-[1fr_auto_auto_auto_auto_auto]',
    isBest && 'shadow-[inset_3px_0_0_var(--color-mk-clay)]',
  );

  if (locked) {
    return (
      <div className={cn(gridClass, 'cursor-not-allowed opacity-40')} aria-disabled>
        {content}
      </div>
    );
  }

  return (
    <Link href={`/borrower/offers/${offer.id}`} className={cn(gridClass, 'transition-colors hover:bg-mk-paper')}>
      {content}
    </Link>
  );
}
