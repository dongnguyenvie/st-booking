# @repo/email

Transactional email templates for Canmore Stays, built with
[React Email](https://react.email/docs/introduction).

## What this package does and does not do

It **renders**. Given a template name and its props it returns a subject, an
HTML body and a plain-text body.

It **does not send**. There is no transport, no API key, no retry policy and no
address book here. Delivery belongs to whoever owns the queue, so that editing a
template never puts you near sending credentials.

```typescript
import { renderEmail } from '@repo/email';

const mail = await renderEmail('loi-signed', {
  borrowerName: 'Dana',
  lenderName: 'Meridian Capital',
  amount: 48_000,
  apr: 6.91,
  termMonths: 24,
  payment: 2144,
  signedAt: new Date(),
  fundingRoomUrl: `${appUrl}/marketplace/borrower/funding-room`,
  manageNotificationsUrl: `${appUrl}/settings/notifications`,
});

await transport.send({ to: borrower.email, ...mail });
```

## Previewing

```bash
pnpm --filter @repo/email dev     # http://localhost:3003
```

Each template declares `PreviewProps`, so the dev server renders it with
realistic data on load. Those same `PreviewProps` are the fixtures the test
suite renders against — a template whose preview data drifts from its prop type
fails in CI rather than in someone's inbox.

The preview UI's **Linter** tab flags dead links and mail-client
incompatibilities. `FETCH ATTEMPT` warnings against `app.canmorestays.dev`
are expected: that host is deliberately fictional so preview data never touches
a real server.

## Templates

| Name | Side | Sent when |
|---|---|---|
| `offers-received` | Borrower | Lenders have priced; the ranked list is ready |
| `loi-signed` | Borrower | LOI signed — terms locked, exclusivity begins |
| `stips-requested` | Borrower | The lender has set conditions on the signed deal |
| `terms-revised` | Borrower | The lender proposes new terms after the LOI |
| `funding-complete` | Borrower | Every condition approved, funds disbursing |
| `verification-stale` | Borrower | Profile checks have aged out of freshness |
| `lender-request-posted` | Lender | A matching request landed in the desk queue |

Template names are a **wire value**: a job enqueued before a deploy has to still
resolve after it, so renaming a key is a breaking change even though the type
system will not say so. Use `isEmailTemplateName()` to validate a name coming off
a queue before handing it to `renderEmail`.

## Conventions worth knowing

- **Every colour arrives inline.** Mail clients strip `<style>` blocks and
  cannot be relied on for `var()`. `src/theme.ts` mirrors the `--color-mk-*`
  tokens from the marketplace surface as literal hex.
- **No `{{placeholders}}`.** Anything variable is a prop, including
  `manageNotificationsUrl`. A mustache placeholder would ship as a dead link
  because nothing in this package substitutes it — the test suite asserts none
  survive into the output.
- **Absolute dates, never relative.** Mail is read at an unknown delay from when
  it was sent, so "in 3 days" can be wrong by the time anyone sees it.
- **Plain text is always sent.** Some clients render it instead of the HTML, and
  a multipart message without it is far likelier to be marked as spam.

## Testing

```bash
pnpm --filter @repo/email test
```

`@react-email/render` dynamically imports `react-dom/server`, which needs
`--experimental-vm-modules`; the `test` script sets it via `cross-env`.

## Wiring into apps/api

Not wired up yet. This package exports TypeScript source (like `@repo/ui`), so a
consumer has to transpile it — `apps/api` currently compiles only its own
`src/`, and would need `@repo/email` added to its build before it can import
this.
