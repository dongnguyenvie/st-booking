import { Layout, type BaseEmailProps } from '../components/layout';
import { Heading, Paragraph } from '../components/heading';
import { CtaButton } from '../components/cta-button';
import { TermsTable } from '../components/terms-table';
import { Callout } from '../components/callout';
import { money } from '../format';

export interface LenderRequestPostedProps extends BaseEmailProps {
  lenderContactName: string;
  /** Reference only — the desk queue is the source of truth for borrower detail. */
  requestRef: string;
  product: string;
  amount: number;
  purpose?: string;
  /** How many lenders already priced it. Pricing is a race; this is the reason to open. */
  competingOffers: number;
  /** Set when the borrower's checks have aged out — it changes how you price. */
  hasStaleVerification: boolean;
  dealUrl: string;
}

export const subject = (p: LenderRequestPostedProps): string => `New ${money(p.amount)} request — ${p.product}`;

export default function LenderRequestPostedEmail(props: LenderRequestPostedProps) {
  const { lenderContactName, requestRef, product, amount, purpose, competingOffers, hasStaleVerification, dealUrl } =
    props;

  return (
    <Layout
      manageNotificationsUrl={props.manageNotificationsUrl}
      preview={
        competingOffers > 0
          ? `${competingOffers} ${competingOffers === 1 ? 'lender has' : 'lenders have'} already priced this one.`
          : 'No one has priced this yet.'
      }
      footNote="Borrowers see one ranked list, best rate first. Unpriced lenders are listed below every priced offer."
    >
      <Heading sub="It matches your box and is live now.">A request landed in your queue</Heading>

      <Paragraph>{lenderContactName}, here is the shape of it.</Paragraph>

      <TermsTable
        rows={[
          { label: 'Reference', value: requestRef },
          { label: 'Product', value: product },
          { label: 'Amount', value: money(amount) },
          ...(purpose ? [{ label: 'Purpose', value: purpose }] : []),
        ]}
      />

      {hasStaleVerification ? (
        <Callout tone="warn">
          This borrower has verifications that have aged out. Review the freshness of their bank and registry data
          before you price.
        </Callout>
      ) : null}

      {competingOffers > 0 ? (
        <Callout>
          {competingOffers} {competingOffers === 1 ? 'lender has' : 'lenders have'} already priced this request. Until
          you price, you sit below all of them.
        </Callout>
      ) : null}

      <CtaButton href={dealUrl}>Price this deal</CtaButton>
    </Layout>
  );
}

LenderRequestPostedEmail.PreviewProps = {
  lenderContactName: 'Ray',
  requestRef: 'REQ-20847',
  product: 'Working capital',
  amount: 48000,
  purpose: 'Inventory for Q4',
  competingOffers: 2,
  hasStaleVerification: true,
  dealUrl: 'https://app.canmorestays.dev/marketplace/lender/deals/REQ-20847',
  manageNotificationsUrl: 'https://app.canmorestays.dev/settings/notifications',
} satisfies LenderRequestPostedProps;
