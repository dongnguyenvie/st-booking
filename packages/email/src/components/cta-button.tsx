import { Button, Section } from '@react-email/components';
import { theme } from '../theme';

export interface CtaButtonProps {
  href: string;
  children: string;
  /** Secondary renders as an outline — use when the mail has two actions. */
  variant?: 'primary' | 'secondary';
}

export function CtaButton({ href, children, variant = 'primary' }: CtaButtonProps) {
  const primary = variant === 'primary';
  return (
    <Section style={{ margin: '24px 0 4px' }}>
      <Button
        href={href}
        style={{
          display: 'inline-block',
          padding: '12px 22px',
          borderRadius: 8,
          fontSize: 15,
          fontWeight: 700,
          fontFamily: theme.font.body,
          textDecoration: 'none',
          backgroundColor: primary ? theme.color.clay : 'transparent',
          color: primary ? '#ffffff' : theme.color.ink,
          border: `1px solid ${primary ? theme.color.clay : theme.color.lineStrong}`,
        }}
      >
        {children}
      </Button>
    </Section>
  );
}
