'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { offerDetailA, offerDetailS } from '@/store/modules/marketplace/borrower/offer-detail';
import { workspaceS } from '@/store/modules/marketplace/borrower/workspace';
import { LenderMark } from '../../shared/lender-mark';
import { StagePill } from '../../shared/stage-pill';
import { formatApr, formatMoney } from '../../shared/format';
import { OfferShaper } from './components/offer-shaper';
import { FundingSteps } from './components/funding-steps';

/**
 * One offer, reshapeable. The borrower picks ONE and signs an LOI — that is the
 * commitment point, and terms lock at signature (BUSINESS-LOGIC §5).
 */
export function OfferDetailPageFeature({ offerId }: { offerId: string }) {
  const dispatch = useAppDispatch();
  const offer = useAppSelector(offerDetailS.selectOffer);
  const lender = useAppSelector(offerDetailS.selectLender);
  const priced = useAppSelector(offerDetailS.selectPriced);
  const totalInterest = useAppSelector(offerDetailS.selectTotalInterest);
  const amount = useAppSelector(offerDetailS.selectAmount);
  const loading = useAppSelector(offerDetailS.selectLoading);
  const error = useAppSelector(offerDetailS.selectError);
  const marketLocked = useAppSelector(workspaceS.selectMarketLocked);

  useEffect(() => {
    dispatch(offerDetailA.init(offerId));
    return () => {
      dispatch(offerDetailA.destroy());
    };
  }, [dispatch, offerId]);

  if (loading || (!offer && !error)) {
    return (
      <div className="mx-auto w-full max-w-[1100px] px-5 py-8">
        <div className="h-64 animate-pulse rounded-2xl border border-mk-line bg-mk-card" />
      </div>
    );
  }

  if (error || !offer || !priced) {
    return (
      <div className="mx-auto w-full max-w-[1100px] px-5 py-8">
        <p className="rounded-2xl border border-mk-line bg-mk-card px-5 py-12 text-center text-[13px] text-mk-ink-45">
          {error ?? 'That offer is no longer available.'}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-5 px-5 py-8">
      <Link
        href="/borrower/offers"
        className="inline-flex items-center gap-1.5 text-[12.5px] text-mk-ink-60 hover:text-mk-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All offers
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-mk-line bg-mk-card p-6">
        <div className="flex items-center gap-3.5">
          <LenderMark short={lender?.short ?? '·'} size={46} />
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight">
              {lender?.name ?? offer.lenderId}
            </h1>
            <p className="mt-0.5 text-[12.5px] text-mk-ink-45">
              {lender?.kind} · rated {lender?.rating.toFixed(1)} · since {lender?.since}
            </p>
          </div>
        </div>
        <StagePill stage={offer.stage} />
      </header>

      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-mk-line bg-mk-card p-6">
            <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-mk-ink-45">
              Your shaped offer
            </p>
            <div className="mt-3 flex flex-wrap items-end gap-x-10 gap-y-4">
              <div>
                <p className="text-[36px] leading-none font-semibold tracking-tight tabular-nums">
                  {formatApr(priced.apr)}
                </p>
                <p className="mt-1.5 text-[11.5px] text-mk-ink-45">APR</p>
              </div>
              <div>
                <p className="text-[22px] leading-none font-semibold tabular-nums">
                  {formatMoney(priced.payment)}
                </p>
                <p className="mt-1.5 text-[11.5px] text-mk-ink-45">
                  per payment · {priced.installments} payments
                </p>
              </div>
              <div>
                <p className="text-[22px] leading-none font-semibold tabular-nums">
                  {totalInterest === null ? '—' : formatMoney(totalInterest)}
                </p>
                <p className="mt-1.5 text-[11.5px] text-mk-ink-45">total cost of credit</p>
              </div>
            </div>
          </section>

          <OfferShaper offer={offer} />
        </div>

        <div className="space-y-5">
          <section className="rounded-2xl border border-mk-line bg-mk-card p-5">
            <h2 className="text-[13px] font-semibold">Sign to lock these terms</h2>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-mk-ink-60">
              Signing starts an exclusive window with {lender?.name ?? 'this lender'}. You can cancel
              any time before funding — it releases exclusivity and forfeits this rate.
            </p>
            <button
              type="button"
              disabled={marketLocked}
              onClick={() => dispatch(offerDetailA.setSignOpen(true))}
              className="mt-4 h-10 w-full rounded-full bg-mk-ink text-[13px] font-medium text-mk-paper transition-colors hover:bg-mk-ink-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {marketLocked ? 'Already under an LOI' : `Sign LOI · ${formatMoney(amount)}`}
            </button>
          </section>

          <FundingSteps />
        </div>
      </div>
    </div>
  );
}
