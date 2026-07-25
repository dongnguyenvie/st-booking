'use client';

import { useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { profileA, profileS } from '@/store/modules/marketplace/borrower/profile';
import { workspaceS } from '@/store/modules/marketplace/borrower/workspace';
import { formatMoneyCompact } from '../../shared/format';
import { VerificationList } from './components/verification-list';

/**
 * Profile hub — the unified, verify-once profile every lender reads.
 * Verifications go stale after a funded cycle; stale data means slower replies
 * and weaker offers, so the refresh path is surfaced prominently
 * (BUSINESS-LOGIC §8).
 */
export function ProfilePageFeature() {
  const dispatch = useAppDispatch();
  const activeAccountId = useAppSelector(workspaceS.selectActiveAccountId);
  const account = useAppSelector(profileS.selectAccount);
  const checks = useAppSelector(profileS.selectChecks);
  const staleChecks = useAppSelector(profileS.selectStaleChecks);
  const hasStale = useAppSelector(profileS.selectHasStale);
  const strength = useAppSelector(profileS.selectStrength);
  const eligible = useAppSelector(profileS.selectEligible);
  const refreshing = useAppSelector(profileS.selectRefreshing);
  const loading = useAppSelector(profileS.selectLoading);

  useEffect(() => {
    dispatch(profileA.init());
    return () => {
      dispatch(profileA.destroy());
    };
  }, [dispatch, activeAccountId]);

  if (loading || !account) {
    return (
      <div className="mx-auto w-full max-w-[1100px] px-5 py-8">
        <div className="h-64 animate-pulse rounded-2xl border border-mk-line bg-mk-card" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-5 px-5 py-8">
      <header className="rounded-2xl border border-mk-line bg-mk-card p-6">
        <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-mk-ink-45">
          {account.kind} profile
        </p>
        <h1 className="mt-1.5 text-[32px] leading-none font-semibold tracking-tight">
          {account.name}
        </h1>
        <p className="mt-2 text-[13px] text-mk-ink-60">
          {account.who} · {account.flag} {account.region}
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-6 border-t border-mk-line pt-5 sm:grid-cols-4">
          {[
            ['Profile strength', `${strength}%`],
            [account.revenueLabel, account.revenueValue],
            ['Net worth', formatMoneyCompact(account.worth)],
            ['Lenders matched', String(account.lenders)],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-mk-ink-45">
                {label}
              </dt>
              <dd className="mt-1 text-[20px] font-semibold tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </header>

      {hasStale && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-mk-warn/30 bg-mk-warn-soft px-4 py-3">
          <p className="text-[12.5px] text-mk-warn">
            {staleChecks.length} check{staleChecks.length === 1 ? '' : 's'} aged out. Stale data means
            slower replies and weaker offers.
          </p>
          <button
            type="button"
            disabled={refreshing}
            onClick={() => dispatch(profileA.refreshVerifications())}
            className="inline-flex h-8 shrink-0 items-center gap-2 rounded-full bg-mk-ink px-3.5 text-[12px] font-medium text-mk-paper transition-colors hover:bg-mk-ink-2 disabled:opacity-50"
          >
            <RefreshCw className={refreshing ? 'h-3.5 w-3.5 animate-spin' : 'h-3.5 w-3.5'} />
            {refreshing ? 'Refreshing…' : 'Refresh checks'}
          </button>
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-mk-line bg-mk-card">
        <header className="border-b border-mk-line px-5 py-3.5">
          <h2 className="text-[13px] font-semibold">Verifications</h2>
          <p className="mt-0.5 text-[11.5px] text-mk-ink-45">
            Verified once and reused — you never re-onboard.
          </p>
        </header>
        <VerificationList checks={checks} />
      </section>

      <section className="overflow-hidden rounded-2xl border border-mk-line bg-mk-card">
        <header className="border-b border-mk-line px-5 py-3.5">
          <h2 className="text-[13px] font-semibold">You already qualify for</h2>
          <p className="mt-0.5 text-[11.5px] text-mk-ink-45">
            No re-verification needed — start any of these from your profile.
          </p>
        </header>
        <ul className="grid gap-px bg-mk-line sm:grid-cols-2">
          {eligible.map((product) => (
            <li key={product.id} className="bg-mk-card p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-[13.5px] font-semibold">{product.name}</h3>
                <span className="shrink-0 text-[11.5px] tabular-nums text-mk-gain">{product.rate}</span>
              </div>
              <p className="mt-1 text-[11.5px] text-mk-ink-45">{product.blurb}</p>
              <p className="mt-2.5 text-[12.5px] tabular-nums text-mk-ink-60">
                {product.range} · {product.lenders} lenders
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
