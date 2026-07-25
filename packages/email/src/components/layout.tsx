import { Body, Container, Head, Hr, Html, Link, Preview, Section, Text } from '@react-email/components';
import type { ReactNode } from 'react';
import { theme } from '../theme';

/**
 * Carried by every template.
 *
 * The preferences link is a real prop rather than a `{{placeholder}}` the
 * transport is expected to substitute: this package has no transport, so a
 * placeholder would ship a broken href in every message and nothing here would
 * catch it.
 */
export interface BaseEmailProps {
  /** Where the footer's "Manage notifications" link points. */
  manageNotificationsUrl: string;
}

export interface LayoutProps extends BaseEmailProps {
  /**
   * The line mail clients show next to the subject in the inbox list. Write it
   * as the sentence that earns the open — it is read far more often than the
   * body.
   */
  preview: string;
  children: ReactNode;
  /** Rendered under the rule at the bottom, above the legal footer. */
  footNote?: ReactNode;
}

/**
 * The shell every template sits in.
 *
 * Table-free layout on purpose: @react-email/components emits the table
 * scaffolding Outlook needs, so templates stay readable JSX.
 */
export function Layout({ preview, children, footNote, manageNotificationsUrl }: LayoutProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          margin: 0,
          padding: '32px 12px',
          backgroundColor: theme.color.paper,
          fontFamily: theme.font.body,
          color: theme.color.ink,
        }}
      >
        <Container
          style={{
            maxWidth: theme.size.container,
            margin: '0 auto',
            backgroundColor: theme.color.card,
            border: `1px solid ${theme.color.line}`,
            borderRadius: theme.size.radius,
            overflow: 'hidden',
          }}
        >
          <Section style={{ padding: '20px 28px 0' }}>
            <Text
              style={{
                margin: 0,
                fontSize: 13,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: theme.color.clay,
                fontWeight: 700,
              }}
            >
              Carousel Marketplace
            </Text>
          </Section>

          <Section style={{ padding: '4px 28px 24px' }}>{children}</Section>

          {footNote ? (
            <>
              <Hr style={{ margin: '0 28px', borderColor: theme.color.line }} />
              <Section style={{ padding: '16px 28px' }}>
                <Text style={{ margin: 0, fontSize: 13, lineHeight: '20px', color: theme.color.inkSoft }}>
                  {footNote}
                </Text>
              </Section>
            </>
          ) : null}
        </Container>

        <Container style={{ maxWidth: theme.size.container, margin: '0 auto', padding: '16px 28px' }}>
          <Text style={{ margin: 0, fontSize: 12, lineHeight: '18px', color: theme.color.inkFaint }}>
            You are receiving this because you have an active account on Carousel Marketplace.{' '}
            <Link
              href={manageNotificationsUrl}
              style={{ color: theme.color.inkFaint, textDecoration: 'underline' }}
            >
              Manage notifications
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
