import { Layout, type BaseEmailProps } from '../components/layout';
import { Heading, Paragraph } from '../components/heading';
import { CtaButton } from '../components/cta-button';
import { TermsTable } from '../components/terms-table';
import { Callout } from '../components/callout';
import { money, rate, term, moneyExact, date } from '../format';

export interface FundingCompleteProps extends BaseEmailProps {
  borrowerName: string;
  lenderName: string;
  amount: number;
  apr: number;
  termMonths: number;
  payment: number;
  /** Masked — never the full number. */
  bankAccountLast4: string;
  /** Disbursement lands in roughly 38 hours, so this is a real date, not "soon". */
  expectedArrival: Date | string;
  firstPaymentDue: Date | string;
  fundingHistoryUrl: string;
}

export const subject = (p: FundingCompleteProps): string => `${money(p.amount)} is on its way`;

export default function FundingCompleteEmail(props: FundingCompleteProps) {
  const {
    borrowerName,
    lenderName,
    amount,
    apr,
    termMonths,
    payment,
    bankAccountLast4,
    expectedArrival,
    firstPaymentDue,
    fundingHistoryUrl,
  } = props;

  return (
    <Layout
      manageNotificationsUrl={props.manageNotificationsUrl}
      preview={`Every condition approved. Funds arrive by ${date(expectedArrival)}.`}
      footNote="This request is now closed and archived to your funding history. Your next request starts fresh."
    >
      <Heading sub={`Every condition was approved, so ${lenderName} released the funds.`}>Your funding is complete</Heading>

      <Paragraph>
        {borrowerName}, {money(amount)} is on its way to your account ending {bankAccountLast4}, expected by{' '}
        {date(expectedArrival)}.
      </Paragraph>

      <TermsTable
        rows={[
          { label: 'Lender', value: lenderName },
          { label: 'Amount funded', value: money(amount) },
          { label: 'APR', value: rate(apr) },
          { label: 'Term', value: term(termMonths) },
          { label: 'Monthly payment', value: moneyExact(payment) },
          { label: 'First payment due', value: date(firstPaymentDue) },
        ]}
      />

      <Callout tone="good">
        Exclusivity has ended and the market is open to you again whenever you need it.
      </Callout>

      <CtaButton href={fundingHistoryUrl}>View funding record</CtaButton>
    </Layout>
  );
}

FundingCompleteEmail.PreviewProps = {
  borrowerName: 'Dana',
  lenderName: 'Meridian Capital',
  amount: 48000,
  apr: 6.91,
  termMonths: 24,
  payment: 2144,
  bankAccountLast4: '4417',
  expectedArrival: '2026-07-23T00:00:00.000Z',
  firstPaymentDue: '2026-08-21T00:00:00.000Z',
  fundingHistoryUrl: 'https://app.canmorestays.dev/marketplace/borrower/fundings',
  manageNotificationsUrl: 'https://app.canmorestays.dev/settings/notifications',
} satisfies FundingCompleteProps;
