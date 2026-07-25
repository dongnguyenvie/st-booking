'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { fundingsA, fundingsS } from '@/store/modules/marketplace/borrower/fundings';
import { workspaceS } from '@/store/modules/marketplace/borrower/workspace';
import { formatMoney } from '../../shared/format';
import { FundingRow } from './components/funding-row';

/**
 * Past fundings — every funding ever, newest first.
 * Only "total funded" and "count" are shown: repayment happens off-platform,
 * so a repayment KPI would be fabricated (BUSINESS-LOGIC §1, §7).
 */
export function FundingsPageFeature() {
  const dispatch = useAppDispatch();
  const activeAccountId = useAppSelector(workspaceS.selectActiveAccountId);
  const fundings = useAppSelector(fundingsS.selectAll);
  const total = useAppSelector(fundingsS.selectTotalFunded);
  const count = useAppSelector(fundingsS.selectCount);
  const loading = useAppSelector(fundingsS.selectLoading);

  useEffect(() => {
    dispatch(fundingsA.init());
    return () => {
      dispatch(fundingsA.destroy());
    };
  }, [dispatch, activeAccountId]);

  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-5 px-5 py-8">
      <header className="rounded-2xl border border-mk-line bg-mk-card p-6">
        <h1 className="text-[32px] leading-none font-semibold tracking-tight">Past fundings</h1>
        <dl className="mt-5 flex gap-10">
          <div>
            <dt className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-mk-ink-45">
              Total funded
            </dt>
            <dd className="mt-1 text-[26px] font-semibold tabular-nums">{formatMoney(total)}</dd>
          </div>
          <div>
            <dt className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-mk-ink-45">
              Fundings
            </dt>
            <dd className="mt-1 text-[26px] font-semibold tabular-nums">{count}</dd>
          </div>
        </dl>
      </header>

      <section className="overflow-hidden rounded-2xl border border-mk-line bg-mk-card">
        {loading ? (
          <ul className="divide-y divide-mk-line">
            {[0, 1, 2].map((i) => (
              <li key={i} className="flex items-center gap-3 px-5 py-4">
                <span className="h-[34px] w-[34px] shrink-0 animate-pulse rounded-lg bg-mk-ink-08" />
                <span className="h-3 w-1/3 animate-pulse rounded bg-mk-ink-08" />
              </li>
            ))}
          </ul>
        ) : fundings.length === 0 ? (
          <p className="px-5 py-12 text-center text-[13px] text-mk-ink-45">
            Nothing funded on this account yet.
          </p>
        ) : (
          <ul>
            {fundings.map((funding) => (
              <FundingRow key={funding.id} funding={funding} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
