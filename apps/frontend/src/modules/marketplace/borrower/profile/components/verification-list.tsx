import { Check, RefreshCw } from 'lucide-react';
import { cn } from '@repo/ui/utils/cn';
import type { VerificationCheck } from '@/store/modules/marketplace/borrower/profile/profile-types';

export function VerificationList({ checks }: { checks: VerificationCheck[] }) {
  return (
    <ul>
      {checks.map((check) => {
        const fresh = check.freshness === 'fresh';
        return (
          <li
            key={check.id}
            className="flex items-center gap-3 border-b border-mk-line px-5 py-3.5 last:border-b-0"
          >
            <span
              className={cn(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                fresh ? 'bg-mk-gain-soft text-mk-gain' : 'bg-mk-warn-soft text-mk-warn',
              )}
            >
              {fresh ? (
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium">{check.label}</p>
              <p className="truncate text-[11.5px] text-mk-ink-45">{check.detail}</p>
            </div>
            <span
              className={cn(
                'inline-flex h-5 items-center rounded-full px-2 text-[10.5px] font-medium',
                fresh ? 'bg-mk-gain-soft text-mk-gain' : 'bg-mk-warn-soft text-mk-warn',
              )}
            >
              {fresh ? 'Fresh' : 'Needs refresh'}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
