'use client';

import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@repo/ui/utils/cn';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { findLender } from '@/mock/marketplace';
import { workspaceA, workspaceS } from '@/store/modules/marketplace/borrower/workspace';
import { LenderMark } from '../../shared/lender-mark';

/**
 * Switches between the Business and Personal worlds. Not a filter — picking an
 * account swaps the request, offers, LOI and funding room wholesale
 * (BUSINESS-LOGIC §2), which is why it lives in the layout rather than a page.
 */
export function AccountSwitcher() {
  const dispatch = useAppDispatch();
  const account = useAppSelector(workspaceS.selectActiveAccount);
  const accounts = useAppSelector(workspaceS.selectAccounts);
  const open = useAppSelector(workspaceS.selectAccountSwitcherOpen);

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => dispatch(workspaceA.toggleAccountSwitcher())}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          'flex items-center gap-2.5 rounded-xl border py-1 pl-1.5 pr-2.5 transition-colors',
          open ? 'border-mk-line-2 bg-mk-paper-2' : 'border-mk-line hover:bg-mk-paper-2',
        )}
      >
        <LenderMark short={findLender(account.mark)?.short ?? '·'} size={30} />
        <span className="text-left leading-tight">
          <span className="flex items-center gap-1.5 text-[13px] font-semibold whitespace-nowrap">
            {account.name}
            <ChevronDown className="h-3.5 w-3.5" />
          </span>
          <span className="block text-[10.5px] whitespace-nowrap text-mk-ink-45">
            {account.kind} account
          </span>
        </span>
      </button>

      {open && (
        <>
          {/* Click-away layer — cheaper and more predictable than a global listener. */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => dispatch(workspaceA.setAccountSwitcherOpen(false))}
          />
          <div
            role="menu"
            className="absolute left-0 top-[calc(100%+8px)] z-50 w-[260px] overflow-hidden rounded-2xl border border-mk-line bg-mk-card shadow-lg"
          >
            <p className="px-3.5 pb-2 pt-3 text-[10.5px] font-medium uppercase tracking-[0.16em] text-mk-ink-45">
              Switch account
            </p>
            {accounts.map((a) => {
              const active = a.id === account.id;
              return (
                <button
                  key={a.id}
                  type="button"
                  role="menuitem"
                  onClick={() => dispatch(workspaceA.setActiveAccount(a.id))}
                  className={cn(
                    'flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition-colors',
                    active ? 'bg-mk-paper-2' : 'hover:bg-mk-paper',
                  )}
                >
                  <LenderMark short={findLender(a.mark)?.short ?? '·'} size={34} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-semibold">{a.name}</span>
                    <span className="block text-[11px] text-mk-ink-45">
                      {a.flag} {a.kind} · {a.region}
                    </span>
                  </span>
                  {active && <Check className="h-4 w-4" strokeWidth={2.4} />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
