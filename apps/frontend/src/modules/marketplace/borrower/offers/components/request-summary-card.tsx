import type { Account } from '@/mock/marketplace';
import { formatApr, formatMoney } from '../../../shared/format';

interface RequestSummaryCardProps {
  account: Account;
  offerCount: number;
  bestRate: number | null;
}

/** The live ask, plus the two numbers that describe how the market answered. */
export function RequestSummaryCard({ account, offerCount, bestRate }: RequestSummaryCardProps) {
  const { request } = account;

  return (
    <section className="rounded-2xl border border-mk-line bg-mk-card p-6">
      <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-mk-ink-45">
        Your request
      </p>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-[32px] leading-none font-semibold tracking-tight tabular-nums">
            {formatMoney(request.amount)}
          </h1>
          <p className="mt-2 text-[13px] text-mk-ink-60">
            {request.product} · {request.purpose}
          </p>
          <p className="mt-1 text-[11.5px] text-mk-ink-45">
            Requested {request.appliedOn} · valid {request.validDays} days · {account.flag}{' '}
            {account.region}
          </p>
        </div>

        <dl className="flex gap-8">
          <div>
            <dt className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-mk-ink-45">
              Offers in
            </dt>
            <dd className="mt-1 text-[22px] font-semibold tabular-nums">{offerCount}</dd>
          </div>
          <div>
            <dt className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-mk-ink-45">
              Best rate
            </dt>
            <dd className="mt-1 text-[22px] font-semibold tabular-nums text-mk-gain">
              {bestRate === null ? '—' : formatApr(bestRate)}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
