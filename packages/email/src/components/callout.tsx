import { Section, Text } from '@react-email/components';
import type { ReactNode } from 'react';
import { theme } from '../theme';

export type CalloutTone = 'neutral' | 'good' | 'warn';

const tones: Record<CalloutTone, { bg: string; border: string; text: string }> = {
  neutral: { bg: theme.color.paperAlt, border: theme.color.line, text: theme.color.ink },
  good: { bg: theme.color.gainSoft, border: theme.color.gain, text: theme.color.gain },
  warn: { bg: theme.color.warnSoft, border: theme.color.warn, text: theme.color.warn },
};

/** A single emphasised statement — the rule the recipient must not miss. */
export function Callout({ tone = 'neutral', children }: { tone?: CalloutTone; children: ReactNode }) {
  const t = tones[tone];
  return (
    <Section
      style={{
        margin: '20px 0 0',
        padding: '12px 16px',
        backgroundColor: t.bg,
        borderLeft: `3px solid ${t.border}`,
        borderRadius: 4,
      }}
    >
      <Text style={{ margin: 0, fontSize: 14, lineHeight: '21px', color: t.text }}>{children}</Text>
    </Section>
  );
}

/** An ordered checklist — conditions the borrower still has to clear. */
export function ItemList({ items }: { items: string[] }) {
  return (
    <Section style={{ margin: '16px 0 0' }}>
      {items.map((item) => (
        <Text
          key={item}
          style={{
            margin: '0 0 6px',
            fontSize: 14,
            lineHeight: '21px',
            color: theme.color.ink,
            paddingLeft: 16,
            textIndent: -16,
          }}
        >
          <span style={{ color: theme.color.clay, fontWeight: 700 }}>&bull;&nbsp;&nbsp;</span>
          {item}
        </Text>
      ))}
    </Section>
  );
}
