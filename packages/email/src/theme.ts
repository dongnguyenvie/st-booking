/**
 * Email design tokens.
 *
 * These mirror the `--color-mk-*` set in apps/frontend/app/globals.css — the
 * editorial paper/ink/clay palette the marketplace surface uses, not the
 * indigo/zinc set the admin back office runs on. Marketplace mail should look
 * like the product the recipient just came from.
 *
 * Values are literal hex rather than CSS variables on purpose: mail clients
 * strip `<style>` blocks and have no `var()` support worth relying on, so every
 * colour has to arrive inline.
 */
export const theme = {
  color: {
    paper: '#faf9f5',
    paperAlt: '#f5f3ec',
    card: '#ffffff',

    ink: '#1a1815',
    inkSoft: '#5c5750',
    inkFaint: '#8a847a',

    line: '#e6e2d8',
    lineStrong: '#d4cfc2',

    clay: '#c8632d',
    clayDeep: '#a04d1f',
    claySoft: '#f4e6dc',

    gain: '#2f7a4d',
    gainSoft: '#e3ecde',
    warn: '#8a6515',
    warnSoft: '#efe6cf',
    loss: '#b13a30',
    lossSoft: '#f3dedb',
  },

  font: {
    /** Georgia leads: the marketplace UI is deliberately editorial. */
    body: "Georgia, 'Times New Roman', ui-serif, serif",
    /** Figures line up in tables only with a tabular/mono face. */
    mono: "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace",
  },

  size: {
    container: 560,
    radius: 10,
  },
} as const;

export type Theme = typeof theme;
