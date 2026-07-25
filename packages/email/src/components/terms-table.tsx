import { Row, Column, Section, Text } from '@react-email/components';
import { theme } from '../theme';

export interface TermRow {
  label: string;
  value: string;
  /** Renders struck-through next to the new value — used for LOI revisions. */
  was?: string;
}

/**
 * The amount / APR / term / payment block.
 *
 * Figures are mono so the column lines up, which is what makes the `was ->
 * value` diff legible when a lender revises terms after the LOI.
 */
export function TermsTable({ rows }: { rows: TermRow[] }) {
  return (
    <Section
      style={{
        margin: '20px 0 0',
        padding: '4px 16px',
        backgroundColor: theme.color.paperAlt,
        border: `1px solid ${theme.color.line}`,
        borderRadius: 8,
      }}
    >
      {rows.map((row, index) => (
        <Row key={row.label} style={{ borderTop: index === 0 ? 'none' : `1px solid ${theme.color.line}` }}>
          <Column style={{ padding: '10px 0' }}>
            <Text style={{ margin: 0, fontSize: 14, color: theme.color.inkSoft }}>{row.label}</Text>
          </Column>
          <Column align="right" style={{ padding: '10px 0' }}>
            <Text style={{ margin: 0, fontSize: 14, fontFamily: theme.font.mono, color: theme.color.ink }}>
              {row.was ? (
                <span style={{ color: theme.color.inkFaint, textDecoration: 'line-through', marginRight: 8 }}>
                  {row.was}
                </span>
              ) : null}
              <strong>{row.value}</strong>
            </Text>
          </Column>
        </Row>
      ))}
    </Section>
  );
}
