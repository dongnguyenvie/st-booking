'use client';

import { MOCK_MARKET_EVENTS } from '@/mock/marketplace';

/**
 * Thin activity strip under the nav. Static in the sample — the prototype
 * animates it, but the marquee adds nothing to the code-organisation story and
 * an always-moving strip is hostile to prefers-reduced-motion.
 */
export function MarketTicker() {
  return (
    <div className="border-b border-mk-line bg-mk-paper px-5">
      <ul className="flex h-9 items-center gap-8 overflow-x-auto text-[11.5px] text-mk-ink-60 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {MOCK_MARKET_EVENTS.map((e) => (
          <li key={e.id} className="flex shrink-0 items-center gap-2 whitespace-nowrap">
            <span
              className={
                e.kind === 'tightened'
                  ? 'h-1.5 w-1.5 rounded-full bg-mk-gain'
                  : 'h-1.5 w-1.5 rounded-full bg-mk-ink-30'
              }
            />
            {e.text}
            <span className="text-mk-ink-45">{e.at}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
