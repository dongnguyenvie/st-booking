import { Heading as BaseHeading, Text } from '@react-email/components';
import type { ReactNode } from 'react';
import { theme } from '../theme';

export interface HeadingProps {
  children: ReactNode;
  /** Sits under the heading in muted text — the one-line "so what". */
  sub?: ReactNode;
}

export function Heading({ children, sub }: HeadingProps) {
  return (
    <>
      <BaseHeading
        as="h1"
        style={{
          margin: '20px 0 0',
          fontSize: 24,
          lineHeight: '32px',
          fontWeight: 400,
          letterSpacing: '-0.01em',
          color: theme.color.ink,
        }}
      >
        {children}
      </BaseHeading>
      {sub ? (
        <Text style={{ margin: '8px 0 0', fontSize: 15, lineHeight: '23px', color: theme.color.inkSoft }}>{sub}</Text>
      ) : null}
    </>
  );
}

export function Paragraph({ children }: { children: ReactNode }) {
  return (
    <Text style={{ margin: '16px 0 0', fontSize: 15, lineHeight: '23px', color: theme.color.ink }}>{children}</Text>
  );
}
