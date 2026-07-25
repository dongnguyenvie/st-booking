'use client';

import { cn } from '@repo/ui/utils/cn';
import type { PaymentFrequency, RequestListing } from '@/mock/marketplace';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { dealDetailA, dealDetailS } from '@/store/modules/marketplace/lender/deal-detail';
import { formatApr, formatMoney } from '../../../shared/format';

const TERMS = [12, 24, 36, 48, 60, 84];
const FREQUENCIES: Array<{ id: PaymentFrequency; label: string }> = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'weekly', label: 'Weekly' },
];

/**
 * The desk composes its offer here. The APR set on this screen is the desk's
 * own price; what the borrower ultimately sees carries Carousel's margin on top
 * (BUSINESS-LOGIC — broker pricing), which is why no spread is shown here.
 */
export function OfferComposer({ deal }: { deal: RequestListing }) {
  const dispatch = useAppDispatch();
  const amount = useAppSelector(dealDetailS.selectAmount);
  const term = useAppSelector(dealDetailS.selectTerm);
  const apr = useAppSelector(dealDetailS.selectApr);
  const frequency = useAppSelector(dealDetailS.selectFrequency);
  const payment = useAppSelector(dealDetailS.selectComposedPayment);
  const gap = useAppSelector(dealDetailS.selectAprGapToBest);
  const wouldLead = useAppSelector(dealDetailS.selectWouldLead);

  return (
    <section className="space-y-5 rounded-2xl border border-mk-line bg-mk-card p-5">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[13px] font-semibold">
          {deal.myOffer ? 'Revise your offer' : 'Compose an offer'}
        </h2>
        <span
          className={cn(
            'text-[11.5px] tabular-nums',
            wouldLead ? 'text-mk-gain' : 'text-mk-ink-45',
          )}
        >
          {gap === null
            ? ''
            : wouldLead
              ? `Leads by ${Math.abs(gap).toFixed(2)} pts`
              : `${gap.toFixed(2)} pts behind best`}
        </span>
      </div>

      <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
        <div>
          <p className="text-[30px] leading-none font-semibold tabular-nums">{formatApr(apr)}</p>
          <p className="mt-1.5 text-[11px] text-mk-ink-45">your APR</p>
        </div>
        <div>
          <p className="text-[20px] leading-none font-semibold tabular-nums">{formatMoney(payment)}</p>
          <p className="mt-1.5 text-[11px] text-mk-ink-45">per {frequency === 'weekly' ? 'week' : 'month'}</p>
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="desk-apr" className="text-[12.5px] font-medium">
            Rate
          </label>
          <span className="text-[11.5px] tabular-nums text-mk-ink-45">
            board best {formatApr(deal.bestApr)}
          </span>
        </div>
        <input
          id="desk-apr"
          type="range"
          min={Math.max(1, deal.bestApr - 2)}
          max={deal.bestApr + 6}
          step={0.01}
          value={apr}
          onChange={(e) => dispatch(dealDetailA.setApr(Number(e.target.value)))}
          className="mt-2.5 w-full accent-mk-ink"
        />
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="desk-amount" className="text-[12.5px] font-medium">
            Amount
          </label>
          <span className="text-[13px] font-semibold tabular-nums">{formatMoney(amount)}</span>
        </div>
        <input
          id="desk-amount"
          type="range"
          min={Math.round(deal.amount * 0.25)}
          max={deal.amount}
          step={1000}
          value={amount}
          onChange={(e) => dispatch(dealDetailA.setAmount(Number(e.target.value)))}
          className="mt-2.5 w-full accent-mk-ink"
        />
        <p className="mt-1 text-[11px] text-mk-ink-45">
          Requested {formatMoney(deal.amount)} — offering less is allowed and shows as
          &ldquo;offered a lower amount&rdquo; on their side.
        </p>
      </div>

      <div>
        <p className="text-[12.5px] font-medium">Term</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {TERMS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => dispatch(dealDetailA.setTerm(t))}
              className={cn(
                'h-7 rounded-full px-3 text-[11.5px] font-medium tabular-nums transition-colors',
                term === t ? 'bg-mk-ink text-mk-paper' : 'bg-mk-paper-3 text-mk-ink-60 hover:text-mk-ink',
              )}
            >
              {t} mo
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[12.5px] font-medium">Payment frequency</p>
        <div className="mt-2 inline-flex gap-0.5 rounded-full bg-mk-paper-2 p-[3px]">
          {FREQUENCIES.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => dispatch(dealDetailA.setFrequency(id))}
              className={cn(
                'h-7 rounded-full px-3.5 text-[11.5px] font-medium transition-all',
                frequency === id ? 'bg-mk-card text-mk-ink shadow-sm' : 'text-mk-ink-60 hover:text-mk-ink',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 border-t border-mk-line pt-4">
        <button
          type="button"
          className="h-9 flex-1 rounded-full bg-mk-ink text-[12.5px] font-medium text-mk-paper transition-colors hover:bg-mk-ink-2"
        >
          {deal.myOffer ? 'Send revised terms' : 'Post offer'}
        </button>
        <button
          type="button"
          className="h-9 rounded-full border border-mk-line px-4 text-[12.5px] font-medium text-mk-ink-60 transition-colors hover:border-mk-line-2 hover:text-mk-ink"
        >
          Pass
        </button>
      </div>
    </section>
  );
}
