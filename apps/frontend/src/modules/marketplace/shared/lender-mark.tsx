import { cn } from '@repo/ui/utils/cn';

interface LenderMarkProps {
  /** Single letter from Lender.short. */
  short: string;
  size?: number;
  className?: string;
}

/**
 * Minimal mono logo tile standing in for a lender's brand mark.
 * The prototype uses flat ink tiles rather than real logos — keeps the
 * offer rows visually quiet so the numbers carry the hierarchy.
 */
export function LenderMark({ short, size = 32, className }: LenderMarkProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-lg bg-mk-ink font-semibold text-white',
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
      aria-hidden
    >
      {short}
    </span>
  );
}
