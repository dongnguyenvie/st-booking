import { LenderDealDetailPageFeature } from '@/modules/marketplace/lender/deal-detail/deal-detail-page-feature';

export default async function LenderDealDetailPage({
  params,
}: {
  params: Promise<{ dealId: string }>;
}) {
  const { dealId } = await params;
  return <LenderDealDetailPageFeature dealId={dealId} />;
}
