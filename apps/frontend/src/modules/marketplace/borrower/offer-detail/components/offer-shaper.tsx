'use client';

import { Sparkles } from 'lucide-react';
import { cn } from '@repo/ui/utils/cn';
import { useAppDispatch, useAppSelector } from '@/store/store';
import type { Offer, PaymentFrequency } from '@/mock/marketplace';
import { offerDetailA, offerDetailS } from '@/store/modules/marketplace/borrower/offer-detail';
import { formatMoney } from '../../../shared/format';

const TERMS = [12, 18, 24, 36, 48, 60];
const FREQUENCIES: Array<{ id: PaymentFrequency; label: string }> = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'weekly', label: 'Weekly' },
];

/**
 * Live controls over the lender's approval: draw, term, sweep frequency.
 * Every change re-prices instantly through the selector.
 */
export function OfferShaper({ offer }: { offer: Offer }) {
  const dispatch = useAppDispatch();
  const amount = useAppSelector(offerDetailS.selectAmount);
  const term = useAppSelector(offerDetailS.selectTerm);
  const frequency = useAppSelector(offerDetailS.selectFrequency);
  const sharpened = useAppSelector(offerDetailS.selectSharpened);

  return (
    <section className="space-y-5 rounded-2xl border border-mk-line bg-mk-card p-5">
      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="offer-amount" className="text-[12.5px] font-medium">
            Amount
          </label>
          <span className="text-[15px] font-semibold tabular-nums">{formatMoney(amount)}</span>
        </div>
        <input
          id="offer-amount"
          type="range"
          min={Math.round(offer.amount * 0.25)}
          max={offer.amount}
          step={1000}
          value={amount}
          onChange={(e) => dispatch(offerDetailA.setAmount(Number(e.target.value)))}
          className="mt-2.5 w-full accent-mk-ink"
        />
        <p className="mt-1 text-[11px] text-mk-ink-45">
          Approved up to {formatMoney(offer.amount)}
        </p>
      </div>

      <div>
        <p className="text-[12.5px] font-medium">Term</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {TERMS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => dispatch(offerDetailA.setTerm(t))}
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
              onClick={() => dispatch(offerDetailA.setFrequency(id))}
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

      <button
        type="button"
        disabled={sharpened}
        onClick={() => dispatch(offerDetailA.sharpen())}
        className={cn(
          'flex h-9 w-full items-center justify-center gap-2 rounded-full border text-[12.5px] font-medium transition-colors',
          sharpened
            ? 'cursor-not-allowed border-mk-line bg-mk-paper-2 text-mk-ink-45'
            : 'border-mk-line text-mk-ink-60 hover:border-mk-line-2 hover:text-mk-ink',
        )}
      >
        <Sparkles className="h-3.5 w-3.5" />
        {sharpened ? 'Rate already sharpened' : 'Request a better rate'}
      </button>
    </section>
  );
}
