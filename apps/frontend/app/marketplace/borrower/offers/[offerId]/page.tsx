import { OfferDetailPageFeature } from '@/modules/marketplace/borrower/offer-detail/offer-detail-page-feature';

export default async function MarketplaceOfferDetailPage({
  params,
}: {
  params: Promise<{ offerId: string }>;
}) {
  const { offerId } = await params;
  return <OfferDetailPageFeature offerId={offerId} />;
}
