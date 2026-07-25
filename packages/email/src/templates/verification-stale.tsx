import { Layout, type BaseEmailProps } from '../components/layout';
import { Heading, Paragraph } from '../components/heading';
import { CtaButton } from '../components/cta-button';
import { Callout, ItemList } from '../components/callout';

export interface VerificationStaleProps extends BaseEmailProps {
  borrowerName: string;
  /** Which of the four unified-profile checks have aged out. */
  staleChecks: string[];
  profileUrl: string;
}

export const subject = (p: VerificationStaleProps): string =>
  p.staleChecks.length === 1
    ? 'One of your verifications has gone stale'
    : `${p.staleChecks.length} of your verifications have gone stale`;

export default function VerificationStaleEmail(props: VerificationStaleProps) {
  const { borrowerName, staleChecks, profileUrl } = props;

  return (
    <Layout
      manageNotificationsUrl={props.manageNotificationsUrl}
      preview="Stale checks mean slower replies and weaker offers on your next request."
      footNote="Refreshing takes a few minutes and runs as a single flow — you will not be bounced between screens."
    >
      <Heading sub="This costs you money on your next request, not today.">Time to refresh your profile</Heading>

      <Paragraph>
        {borrowerName}, bank data and registry checks age out after a funded cycle. These have:
      </Paragraph>

      <ItemList items={staleChecks} />

      <Callout tone="warn">
        Lenders see stale checks on your request. In practice that means slower replies, weaker pricing, and some
        lenders declining to price you at all until the data is fresh.
      </Callout>

      <CtaButton href={profileUrl}>Refresh verifications</CtaButton>
    </Layout>
  );
}

VerificationStaleEmail.PreviewProps = {
  borrowerName: 'Dana',
  staleChecks: ['Business bank connection', 'Business registration'],
  profileUrl: 'https://app.carousel-marketplace.dev/marketplace/borrower/profile',
  manageNotificationsUrl: 'https://app.carousel-marketplace.dev/settings/notifications',
} satisfies VerificationStaleProps;
