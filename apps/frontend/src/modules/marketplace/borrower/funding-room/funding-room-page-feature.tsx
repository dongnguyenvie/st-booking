'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { fundingRoomA, fundingRoomS } from '@/store/modules/marketplace/borrower/funding-room';
import { workspaceS } from '@/store/modules/marketplace/borrower/workspace';
import { LenderMark } from '../../shared/lender-mark';
import { formatApr, formatMoney, formatTerm } from '../../shared/format';
import { StipRow } from './components/stip-row';

/**
 * The funding room — everything after the LOI is signed.
 * Stips are requested here (never before the LOI), and every stip approved
 * means funded (BUSINESS-LOGIC §6).
 */
export function FundingRoomPageFeature() {
  const dispatch = useAppDispatch();
  const activeAccountId = useAppSelector(workspaceS.selectActiveAccountId);
  const loi = useAppSelector(fundingRoomS.selectLoi);
  const lender = useAppSelector(fundingRoomS.selectLender);
  const verifyStips = useAppSelector(fundingRoomS.selectVerifyStips);
  const requestedStips = useAppSelector(fundingRoomS.selectRequestedStips);
  const approvedCount = useAppSelector(fundingRoomS.selectApprovedCount);
  const isFunded = useAppSelector(fundingRoomS.selectIsFunded);
  const progress = useAppSelector(fundingRoomS.selectProgress);
  const loading = useAppSelector(fundingRoomS.selectLoading);
  const stipCount = verifyStips.length + requestedStips.length;

  useEffect(() => {
    dispatch(fundingRoomA.init());
    return () => {
      dispatch(fundingRoomA.destroy());
    };
  }, [dispatch, activeAccountId]);

  if (loading || !loi) {
    return (
      <div className="mx-auto w-full max-w-[1100px] px-5 py-8">
        <div className="h-64 animate-pulse rounded-2xl border border-mk-line bg-mk-card" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-5 px-5 py-8">
      <header className="rounded-2xl border border-mk-line bg-mk-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <LenderMark short={lender?.short ?? '·'} size={46} />
            <div>
              <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-mk-ink-45">
                Under letter of intent
              </p>
              <h1 className="mt-1 text-[22px] font-semibold tracking-tight">
                {lender?.name ?? loi.lenderId}
              </h1>
              <p className="mt-0.5 text-[11.5px] text-mk-ink-45">Signed {loi.signedOn}</p>
            </div>
          </div>

          <dl className="flex flex-wrap gap-x-8 gap-y-3">
            {[
              ['Amount', formatMoney(loi.terms.amount)],
              ['APR', formatApr(loi.terms.apr)],
              ['Term', formatTerm(loi.terms.term)],
              ['Payment', `${formatMoney(loi.terms.payment)}/mo`],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-mk-ink-45">
                  {label}
                </dt>
                <dd className="mt-1 text-[17px] font-semibold tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-5">
          <div className="flex items-baseline justify-between text-[11.5px]">
            <span className="text-mk-ink-60">
              {approvedCount} of {stipCount} conditions approved
            </span>
            <span className="tabular-nums text-mk-ink-45">{progress}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-mk-ink-08">
            <div
              className={isFunded ? 'h-full rounded-full bg-mk-gain' : 'h-full rounded-full bg-mk-ink'}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {isFunded ? (
        <p className="rounded-xl border border-mk-gain/30 bg-mk-gain-soft px-4 py-3 text-[12.5px] text-mk-gain">
          Every condition is approved — funds are on their way to your bank (about 38 hours).
        </p>
      ) : (
        <p className="rounded-xl border border-mk-clay/30 bg-mk-clay-soft px-4 py-3 text-[12.5px] text-mk-clay-deep">
          Exclusivity is active: you work with {lender?.name ?? 'this lender'} only until you fund or
          cancel. Cancelling re-opens the market but forfeits this locked rate.
        </p>
      )}

      <section className="overflow-hidden rounded-2xl border border-mk-line bg-mk-card">
        <header className="border-b border-mk-line px-5 py-3.5">
          <h2 className="text-[13px] font-semibold">Carried over from your profile</h2>
          <p className="mt-0.5 text-[11.5px] text-mk-ink-45">
            Verified once, reused — you never re-upload these.
          </p>
        </header>
        <ul>
          {verifyStips.map((stip) => (
            <StipRow key={stip.id} stip={stip} />
          ))}
        </ul>
      </section>

      <section className="overflow-hidden rounded-2xl border border-mk-line bg-mk-card">
        <header className="border-b border-mk-line px-5 py-3.5">
          <h2 className="text-[13px] font-semibold">Requested by the lender</h2>
          <p className="mt-0.5 text-[11.5px] text-mk-ink-45">
            Each one goes to the lender for review after you submit.
          </p>
        </header>
        <ul>
          {requestedStips.map((stip) => (
            <StipRow key={stip.id} stip={stip} />
          ))}
        </ul>
      </section>
    </div>
  );
}
