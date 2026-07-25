import { Layout, type BaseEmailProps } from '../components/layout';
import { Heading, Paragraph } from '../components/heading';
import { CtaButton } from '../components/cta-button';
import { TermsTable } from '../components/terms-table';
import { Callout } from '../components/callout';
import { money, rate, term, moneyExact, date } from '../format';

export interface LoiSignedProps extends BaseEmailProps {
  borrowerName: string;
  lenderName: string;
  /** Terms as frozen at signature — these do not move without a revision. */
  amount: number;
  apr: number;
  termMonths: number;
  payment: number;
  signedAt: Date | string;
  fundingRoomUrl: string;
}

export const subject = (p: LoiSignedProps): string => `Your letter of intent with ${p.lenderName} is signed`;

export default function LoiSignedEmail(props: LoiSignedProps) {
  const { borrowerName, lenderName, amount, apr, termMonths, payment, signedAt, fundingRoomUrl } = props;

  return (
    <Layout
      manageNotificationsUrl={props.manageNotificationsUrl}
      preview={`Terms locked at ${rate(apr)}. You can cancel any time before funding.`}
      footNote="Cancelling before funding releases exclusivity and re-opens the market, but forfeits this locked rate. Conditions you have already cleared stay on your profile."
    >
      <Heading sub={`Signed ${date(signedAt)}. These terms are now locked.`}>Letter of intent signed</Heading>

      <Paragraph>
        {borrowerName}, you committed to {lenderName}. Here is exactly what was frozen at signature.
      </Paragraph>

      <TermsTable
        rows={[
          { label: 'Lender', value: lenderName },
          { label: 'Amount', value: money(amount) },
          { label: 'APR', value: rate(apr) },
          { label: 'Term', value: term(termMonths) },
          { label: 'Monthly payment', value: moneyExact(payment) },
        ]}
      />

      <Callout tone="warn">
        You are now exclusive with {lenderName}. Your other offers are paused and the market is read-only until this
        deal funds or you cancel.
      </Callout>

      <Paragraph>
        Next, {lenderName} will request the conditions they need. Nothing is required from you until they do.
      </Paragraph>

      <CtaButton href={fundingRoomUrl}>Open the funding room</CtaButton>
    </Layout>
  );
}

LoiSignedEmail.PreviewProps = {
  borrowerName: 'Dana',
  lenderName: 'Meridian Capital',
  amount: 48000,
  apr: 6.91,
  termMonths: 24,
  payment: 2144,
  signedAt: '2026-07-21T15:04:00.000Z',
  fundingRoomUrl: 'https://app.canmorestays.dev/marketplace/borrower/funding-room',
  manageNotificationsUrl: 'https://app.canmorestays.dev/settings/notifications',
} satisfies LoiSignedProps;
