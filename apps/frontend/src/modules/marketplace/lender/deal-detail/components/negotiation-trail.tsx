import type { DeskOfferEvent } from '@/mock/marketplace';
import { formatApr, formatMoney, formatTerm } from '../../../shared/format';

const EVENT_LABEL: Record<DeskOfferEvent['event'], string> = {
  offered: 'Offer posted',
  viewed: 'Borrower opened it',
  counter: 'Borrower countered',
  revised: 'Terms revised',
  signed: 'Signed',
};

/**
 * The full trail on this deal. The borrower sees the same sequence on their
 * side — one negotiation, two views of it (BUSINESS-LOGIC §6a).
 */
export function NegotiationTrail({ history }: { history: DeskOfferEvent[] }) {
  return (
    <section className="rounded-2xl border border-mk-line bg-mk-card p-5">
      <h2 className="text-[13px] font-semibold">Negotiation history</h2>
      <ol className="mt-4 space-y-4">
        {history.map((e, i) => (
          <li key={`${e.event}-${i}`} className="relative pl-5">
            <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-mk-ink-30" />
            {i < history.length - 1 && (
              <span className="absolute left-[3px] top-4 h-full w-px bg-mk-line" />
            )}
            <p className="text-[12.5px] font-medium">{EVENT_LABEL[e.event]}</p>
            <p className="text-[11px] text-mk-ink-45">
              {e.who} · {e.when}
            </p>
            {e.terms && (
              <p className="mt-1 text-[11.5px] tabular-nums text-mk-ink-60">
                {formatMoney(e.terms.amount)} · {formatApr(e.terms.apr)} · {formatTerm(e.terms.term)} ·{' '}
                {formatMoney(e.terms.payment)}/mo
              </p>
            )}
            {e.note && <p className="mt-1 text-[11.5px] text-mk-ink-60">&ldquo;{e.note}&rdquo;</p>}
          </li>
        ))}
      </ol>
    </section>
  );
}
