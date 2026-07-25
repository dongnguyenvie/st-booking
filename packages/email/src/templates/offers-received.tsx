import { Layout, type BaseEmailProps } from '../components/layout';
import { Heading, Paragraph } from '../components/heading';
import { CtaButton } from '../components/cta-button';
import { TermsTable } from '../components/terms-table';
import { Callout } from '../components/callout';
import { money, rate, term, moneyExact } from '../format';

export interface OffersReceivedProps extends BaseEmailProps {
  borrowerName: string;
  /** How many lenders have priced. Lenders still pricing are counted separately. */
  offerCount: number;
  stillPricingCount: number;
  requestAmount: number;
  /** Top of the ranked list — best rate first. */
  best: {
    lenderName: string;
    amount: number;
    apr: number;
    termMonths: number;
    payment: number;
  };
  offersUrl: string;
}

export const subject = (p: OffersReceivedProps): string =>
  p.offerCount === 1
    ? `1 offer on your ${money(p.requestAmount)} request`
    : `${p.offerCount} offers on your ${money(p.requestAmount)} request`;

export default function OffersReceivedEmail(props: OffersReceivedProps) {
  const { borrowerName, offerCount, stillPricingCount, best, offersUrl } = props;

  return (
    <Layout
      manageNotificationsUrl={props.manageNotificationsUrl}
      preview={`Best rate so far: ${rate(best.apr)} from ${best.lenderName}`}
      footNote="Offers are ranked best rate first. Nothing is committed until you sign a letter of intent."
    >
      <Heading sub={`Ranked best rate first. Here is the top of your list.`}>
        {offerCount === 1 ? 'You have an offer' : `You have ${offerCount} offers`}
      </Heading>

      <Paragraph>
        {borrowerName}, lenders have finished pricing your {money(props.requestAmount)} request.
      </Paragraph>

      <TermsTable
        rows={[
          { label: 'Lender', value: best.lenderName },
          { label: 'Amount', value: money(best.amount) },
          { label: 'APR', value: rate(best.apr) },
          { label: 'Term', value: term(best.termMonths) },
          { label: 'Monthly payment', value: moneyExact(best.payment) },
        ]}
      />

      {stillPricingCount > 0 ? (
        <Callout>
          {stillPricingCount} more {stillPricingCount === 1 ? 'lender is' : 'lenders are'} still pricing. They are listed
          below the ranked offers until they come back with a number.
        </Callout>
      ) : null}

      <CtaButton href={offersUrl}>Compare all offers</CtaButton>
    </Layout>
  );
}

OffersReceivedEmail.PreviewProps = {
  borrowerName: 'Dana',
  offerCount: 4,
  stillPricingCount: 2,
  requestAmount: 48000,
  best: {
    lenderName: 'Meridian Capital',
    amount: 48000,
    apr: 6.91,
    termMonths: 24,
    payment: 2144,
  },
  offersUrl: 'https://app.carousel-marketplace.dev/marketplace/borrower/offers',
  manageNotificationsUrl: 'https://app.carousel-marketplace.dev/settings/notifications',
} satisfies OffersReceivedProps;
