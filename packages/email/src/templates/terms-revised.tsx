import { Layout, type BaseEmailProps } from '../components/layout';
import { Heading, Paragraph } from '../components/heading';
import { CtaButton } from '../components/cta-button';
import { TermsTable, type TermRow } from '../components/terms-table';
import { Callout } from '../components/callout';
import { money, rate, term, moneyExact } from '../format';

interface Terms {
  amount: number;
  apr: number;
  termMonths: number;
  payment: number;
}

export interface TermsRevisedProps extends BaseEmailProps {
  borrowerName: string;
  lenderName: string;
  /** What was locked at signature. */
  previous: Terms;
  /** What the lender is proposing instead. */
  revised: Terms;
  /** Documents being re-issued alongside the revision. */
  reissuedDocuments: string[];
  reviewUrl: string;
}

export const subject = (p: TermsRevisedProps): string => `${p.lenderName} has revised your terms — action needed`;

/**
 * Only the fields that actually moved are shown as a diff. Repeating unchanged
 * figures with a strike-through would imply a change that did not happen.
 */
function diffRows(previous: Terms, revised: Terms): TermRow[] {
  const rows: TermRow[] = [];
  const push = (label: string, was: string, now: string) =>
    rows.push(was === now ? { label, value: now } : { label, value: now, was });

  push('Amount', money(previous.amount), money(revised.amount));
  push('APR', rate(previous.apr), rate(revised.apr));
  push('Term', term(previous.termMonths), term(revised.termMonths));
  push('Monthly payment', moneyExact(previous.payment), moneyExact(revised.payment));
  return rows;
}

export default function TermsRevisedEmail(props: TermsRevisedProps) {
  const { borrowerName, lenderName, previous, revised, reissuedDocuments, reviewUrl } = props;

  return (
    <Layout
      manageNotificationsUrl={props.manageNotificationsUrl}
      preview="Your locked terms have not changed yet — they change only if you re-sign."
      footNote="If you do not accept, your original signed terms stay in force. You can also cancel the letter of intent and re-open the market."
    >
      <Heading sub="Nothing changes until you review and re-sign.">Revised terms from {lenderName}</Heading>

      <Paragraph>
        {borrowerName}, {lenderName} has proposed a change to your signed deal. Here is what moves:
      </Paragraph>

      <TermsTable rows={diffRows(previous, revised)} />

      {reissuedDocuments.length > 0 ? (
        <Callout>
          Re-issued with this revision: {reissuedDocuments.join(', ')}.
        </Callout>
      ) : null}

      <CtaButton href={reviewUrl}>Review &amp; re-sign</CtaButton>
    </Layout>
  );
}

TermsRevisedEmail.PreviewProps = {
  borrowerName: 'Dana',
  lenderName: 'Meridian Capital',
  previous: { amount: 48000, apr: 6.91, termMonths: 24, payment: 2144 },
  revised: { amount: 48000, apr: 7.4, termMonths: 24, payment: 2156.31 },
  reissuedDocuments: ['Letter of intent', 'Loan agreement'],
  reviewUrl: 'https://app.canmorestays.dev/marketplace/borrower/funding-room',
  manageNotificationsUrl: 'https://app.canmorestays.dev/settings/notifications',
} satisfies TermsRevisedProps;
