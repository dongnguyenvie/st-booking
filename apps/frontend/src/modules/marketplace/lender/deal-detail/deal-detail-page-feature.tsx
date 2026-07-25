'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { cn } from '@repo/ui/utils/cn';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { dealDetailA, dealDetailS } from '@/store/modules/marketplace/lender/deal-detail';
import { formatApr, formatMoney, formatTerm } from '../../shared/format';
import { OfferComposer } from './components/offer-composer';
import { NegotiationTrail } from './components/negotiation-trail';

/**
 * One request, from the desk's side: the applicant's file, the competitive
 * picture, the offer we are composing, and the trail so far.
 */
export function LenderDealDetailPageFeature({ dealId }: { dealId: string }) {
  const dispatch = useAppDispatch();
  const deal = useAppSelector(dealDetailS.selectDeal);
  const loading = useAppSelector(dealDetailS.selectLoading);
  const error = useAppSelector(dealDetailS.selectError);
  const gaps = useAppSelector(dealDetailS.selectVerificationGaps);
  const history = useAppSelector(dealDetailS.selectHistory);

  useEffect(() => {
    dispatch(dealDetailA.init(dealId));
    return () => {
      dispatch(dealDetailA.destroy());
    };
  }, [dispatch, dealId]);

  if (loading || (!deal && !error)) {
    return (
      <div className="mx-auto w-full max-w-[1100px] px-6 py-8">
        <div className="h-64 animate-pulse rounded-2xl border border-mk-line bg-mk-card" />
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="mx-auto w-full max-w-[1100px] px-6 py-8">
        <p className="rounded-2xl border border-mk-line bg-mk-card px-5 py-12 text-center text-[13px] text-mk-ink-45">
          {error ?? 'That request is no longer on the board.'}
        </p>
      </div>
    );
  }

  const p = deal.profile;

  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-5 px-6 py-8">
      <Link
        href="/marketplace/lender/deals"
        className="inline-flex items-center gap-1.5 text-[12.5px] text-mk-ink-60 hover:text-mk-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All deals
      </Link>

      <header className="rounded-2xl border border-mk-line bg-mk-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-semibold tracking-tight">{deal.borrower}</h1>
            <p className="mt-1 text-[12.5px] text-mk-ink-45">
              {deal.who} · {deal.industry} · {deal.flag} {deal.region} · {p.yearsTrading}y trading
            </p>
            <p className="mt-3 text-[13px] text-mk-ink-60">
              Wants <strong className="font-semibold text-mk-ink">{formatMoney(deal.amount)}</strong> for{' '}
              {deal.product.toLowerCase()} — {deal.purpose}
            </p>
            <p className="mt-1 text-[11.5px] text-mk-ink-45">
              Posted {deal.postedAgo} · expires in {deal.expiresInDays} days
            </p>
          </div>

          {/* What every desk on the board can see — the competitive picture. */}
          <dl className="flex gap-8">
            <div>
              <dt className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-mk-ink-45">
                Offers in
              </dt>
              <dd className="mt-1 text-[22px] font-semibold tabular-nums">{deal.offerCount}</dd>
            </div>
            <div>
              <dt className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-mk-ink-45">
                Best on board
              </dt>
              <dd className="mt-1 text-[22px] font-semibold tabular-nums text-mk-gain">
                {formatApr(deal.bestApr)}
              </dd>
            </div>
          </dl>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-5 border-t border-mk-line pt-5 sm:grid-cols-5">
          {[
            ['Tier', p.tier],
            [p.revenueLabel, formatMoney(p.revenue)],
            ['Net worth', formatMoney(p.netWorth)],
            ['Score', String(p.score)],
            ['Runway', `${p.runwayMonths} mo`],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-[10.5px] uppercase tracking-[0.12em] text-mk-ink-45">{label}</dt>
              <dd className="mt-0.5 text-[15px] font-semibold tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </header>

      {gaps.length > 0 && (
        <p className="flex items-center gap-2 rounded-xl border border-mk-warn/30 bg-mk-warn-soft px-4 py-3 text-[12.5px] text-mk-warn">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Verification gaps: {gaps.join(' · ')}. You may require fresher checks before funding.
        </p>
      )}

      <div className={cn('grid gap-5', history.length > 0 ? 'lg:grid-cols-[1.2fr_1fr]' : '')}>
        <OfferComposer deal={deal} />
        {history.length > 0 && <NegotiationTrail history={history} />}
      </div>

      {deal.deskStatus === 'passed' && deal.passReason && (
        <p className="rounded-xl border border-mk-line bg-mk-paper-2 px-4 py-3 text-[12.5px] text-mk-ink-60">
          You passed on this deal — {deal.passReason}. It stays visible so the desk can see what it
          already reviewed; pricing it again re-opens it.
        </p>
      )}

      {deal.myOffer && (
        <p className="text-[11.5px] text-mk-ink-45">
          Current offer sent {deal.myOffer.sentAt} ·{' '}
          {formatMoney(deal.myOffer.terms.amount)} · {formatApr(deal.myOffer.terms.apr)} ·{' '}
          {formatTerm(deal.myOffer.terms.term)}
        </p>
      )}
    </div>
  );
}
