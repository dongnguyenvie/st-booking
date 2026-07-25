/** Formatting helpers shared across marketplace pages. */

const CURRENCY = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
  maximumFractionDigits: 0,
});

/** $67,000 — whole dollars, the only money format the marketplace shows. */
export function formatMoney(value: number): string {
  return CURRENCY.format(value);
}

/** $67K / $1.9M — for stat tiles where the full number would crowd the layout. */
export function formatMoneyCompact(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(2).replace(/\.00$/, '')}M`;
  if (Math.abs(value) >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${value}`;
}

/** 7.84% — APRs always carry two decimals so rows stay column-aligned. */
export function formatApr(apr: number): string {
  return `${apr.toFixed(2)}%`;
}

/** 36 mo */
export function formatTerm(months: number): string {
  return `${months} mo`;
}

/** Signed delta vs. the previous APR: negative means the rate got cheaper. */
export function aprDelta(apr: number, previousApr: number): number {
  return Number((apr - previousApr).toFixed(2));
}
