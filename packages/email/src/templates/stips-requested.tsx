import { Layout, type BaseEmailProps } from '../components/layout';
import { Heading, Paragraph } from '../components/heading';
import { CtaButton } from '../components/cta-button';
import { Callout, ItemList } from '../components/callout';

export interface StipsRequestedProps extends BaseEmailProps {
  borrowerName: string;
  lenderName: string;
  /** Conditions the borrower must act on. Carried-over ones are counted, not listed. */
  requested: string[];
  /** Auto-satisfied from the unified profile — reassurance, not work. */
  carriedOverCount: number;
  fundingRoomUrl: string;
}

export const subject = (p: StipsRequestedProps): string =>
  p.requested.length === 1
    ? `${p.lenderName} needs 1 document to fund`
    : `${p.lenderName} needs ${p.requested.length} documents to fund`;

export default function StipsRequestedEmail(props: StipsRequestedProps) {
  const { borrowerName, lenderName, requested, carriedOverCount, fundingRoomUrl } = props;

  return (
    <Layout
      manageNotificationsUrl={props.manageNotificationsUrl}
      preview={`Clear these and the deal funds — there is no separate approval step.`}
      footNote="Submitting a document is not the same as it being approved. Each one goes to the lender for review, and can come back for re-submission."
    >
      <Heading sub="Once every condition is approved, the deal funds.">Conditions for your funding</Heading>

      <Paragraph>
        {borrowerName}, {lenderName} has set the conditions on your signed deal. These are the ones that need you:
      </Paragraph>

      <ItemList items={requested} />

      {carriedOverCount > 0 ? (
        <Callout tone="good">
          {carriedOverCount} further {carriedOverCount === 1 ? 'condition was' : 'conditions were'} satisfied
          automatically from your verified profile. You do not need to re-upload {carriedOverCount === 1 ? 'it' : 'them'}
          .
        </Callout>
      ) : null}

      <CtaButton href={fundingRoomUrl}>Upload documents</CtaButton>
    </Layout>
  );
}

StipsRequestedEmail.PreviewProps = {
  borrowerName: 'Dana',
  lenderName: 'Meridian Capital',
  requested: ['Year-to-date profit & loss statement', 'Certificate of insurance', 'Personal guarantee'],
  carriedOverCount: 4,
  fundingRoomUrl: 'https://app.canmorestays.dev/marketplace/borrower/funding-room',
  manageNotificationsUrl: 'https://app.canmorestays.dev/settings/notifications',
} satisfies StipsRequestedProps;
