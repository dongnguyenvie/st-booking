import { cn } from '@repo/ui/utils/cn';
import type { OfferStage } from '@/mock/marketplace';

/** Badge copy + tone per offer stage, mirroring STAGE in the prototype. */
const STAGE_PILL: Record<OfferStage, { label: string; className: string }> = {
  new: { label: 'New offer', className: 'bg-mk-gain-soft text-mk-gain' },
  review: { label: 'Action needed', className: 'bg-mk-clay-soft text-mk-clay-deep' },
  waiting: { label: 'Waiting on lender', className: 'bg-mk-warn-soft text-mk-warn' },
  viewed: { label: 'Viewed', className: 'bg-mk-ink-08 text-mk-ink' },
  signed: { label: 'Signed', className: 'bg-mk-gain-soft text-mk-gain' },
};

export function StagePill({ stage, className }: { stage: OfferStage; className?: string }) {
  const pill = STAGE_PILL[stage];
  return (
    <span
      className={cn(
        'inline-flex h-5 items-center rounded-full px-2 text-[10.5px] font-medium',
        pill.className,
        className,
      )}
    >
      {pill.label}
    </span>
  );
}
