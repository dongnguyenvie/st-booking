import { Star } from 'lucide-react';
import { cn } from '@repo/ui/utils/cn';
import type { Lender } from '@/mock/marketplace';
import { LenderMark } from '../../../shared/lender-mark';

export function LenderCard({ lender, dimmed = false }: { lender: Lender; dimmed?: boolean }) {
  return (
    <article
      className={cn(
        'rounded-2xl border border-mk-line bg-mk-card p-4 transition-opacity',
        dimmed && 'opacity-40',
      )}
    >
      <div className="flex items-start gap-3">
        <LenderMark short={lender.short} size={38} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[13.5px] font-semibold">{lender.name}</h3>
          <p className="text-[11.5px] text-mk-ink-45">{lender.kind}</p>
        </div>
        <span className="flex shrink-0 items-center gap-1 text-[11.5px] tabular-nums text-mk-ink-60">
          <Star className="h-3 w-3 fill-mk-warn text-mk-warn" />
          {lender.rating.toFixed(1)}
        </span>
      </div>

      <dl className="mt-3 flex gap-5 border-t border-mk-line pt-3">
        <div>
          <dt className="text-[10.5px] uppercase tracking-[0.12em] text-mk-ink-45">Since</dt>
          <dd className="text-[13px] tabular-nums">{lender.since}</dd>
        </div>
        <div>
          <dt className="text-[10.5px] uppercase tracking-[0.12em] text-mk-ink-45">Deals funded</dt>
          <dd className="text-[13px] tabular-nums">{lender.funded.toLocaleString('en-CA')}</dd>
        </div>
      </dl>
    </article>
  );
}
