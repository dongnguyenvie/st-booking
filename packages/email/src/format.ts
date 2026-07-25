/**
 * Formatting shared by every template.
 *
 * Money and rates appear in mail that people forward to their accountant, so
 * these deliberately never guess: an amount is always rendered with its
 * currency, and a rate always carries the `%`.
 */

/** `48000` -> `$48,000`. Cents are dropped — marketplace figures are whole dollars. */
export function money(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** `1234.5` -> `$1,234.50`. For payments, where the cents matter. */
export function moneyExact(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** `7.84` -> `7.84%`. Input is already a percentage, not a ratio. */
export function rate(apr: number): string {
  return `${apr.toFixed(2)}%`;
}

/** `24` -> `24 months`. */
export function term(months: number): string {
  return `${months} ${months === 1 ? 'month' : 'months'}`;
}

/**
 * Absolute dates only — no "in 3 days". Mail is read at an unknown delay from
 * when it was sent, so a relative date can be wrong by the time it is seen.
 */
export function date(value: Date | string): string {
  const d = typeof value === 'string' ? new Date(value) : value;
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}
