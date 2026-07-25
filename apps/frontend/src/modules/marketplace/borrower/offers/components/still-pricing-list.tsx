import type { Offer } from '@/mock/marketplace';
import { findLender } from '@/mock/marketplace';
import { LenderMark } from '../../../shared/lender-mark';

/**
 * Lenders that have the request but haven't priced it yet. Listed below the
 * ranked offers, never among them — an unpriced lender has nothing to compare.
 */
export function StillPricingList({ offers }: { offers: Offer[] }) {
  if (offers.length === 0) return null;

  return (
    <section className="rounded-2xl border border-mk-line bg-mk-card">
      <header className="border-b border-mk-line px-5 py-3.5">
        <h2 className="text-[13px] font-semibold">Still pricing</h2>
        <p className="mt-0.5 text-[11.5px] text-mk-ink-45">They&rsquo;ll get back to you.</p>
      </header>
      <ul>
        {offers.map((offer) => {
          const lender = findLender(offer.lenderId);
          return (
            <li
              key={offer.id}
              className="flex items-center gap-3 border-b border-mk-line px-5 py-3 last:border-b-0"
            >
              <LenderMark short={lender?.short ?? '·'} size={28} className="opacity-50" />
              <span className="text-[13px] text-mk-ink-60">{lender?.name ?? offer.lenderId}</span>
              <span className="ml-auto inline-flex h-5 items-center rounded-full bg-mk-ink-08 px-2 text-[10.5px] font-medium text-mk-ink-60">
                Reviewing
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
