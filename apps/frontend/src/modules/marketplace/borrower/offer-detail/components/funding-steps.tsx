const STEPS = [
  { title: 'Sign the LOI', body: 'Terms lock at signature. You work with this lender only until you fund or cancel.' },
  { title: 'Clear the stips', body: 'The lender asks for documents after the LOI. Checks already on your profile carry over.' },
  { title: 'Funded', body: 'Every stip approved means funds disburse to your bank — about 38 hours.' },
];

/**
 * "How funding works" — a preview only. Stips are requested by the lender
 * AFTER the LOI is signed, never before (BUSINESS-LOGIC §6).
 */
export function FundingSteps() {
  return (
    <section className="rounded-2xl border border-mk-line bg-mk-card p-5">
      <h2 className="text-[13px] font-semibold">How funding works</h2>
      <ol className="mt-3 space-y-3.5">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mk-ink-08 text-[10.5px] font-semibold tabular-nums">
              {i + 1}
            </span>
            <span>
              <span className="block text-[12.5px] font-medium">{step.title}</span>
              <span className="mt-0.5 block text-[11.5px] leading-relaxed text-mk-ink-60">
                {step.body}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
