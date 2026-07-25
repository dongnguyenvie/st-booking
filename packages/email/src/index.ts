import { createElement, type ComponentType } from 'react';
import { render } from '@react-email/render';

import OffersReceivedEmail, {
  subject as offersReceivedSubject,
  type OffersReceivedProps,
} from './templates/offers-received';
import LoiSignedEmail, { subject as loiSignedSubject, type LoiSignedProps } from './templates/loi-signed';
import StipsRequestedEmail, {
  subject as stipsRequestedSubject,
  type StipsRequestedProps,
} from './templates/stips-requested';
import TermsRevisedEmail, { subject as termsRevisedSubject, type TermsRevisedProps } from './templates/terms-revised';
import FundingCompleteEmail, {
  subject as fundingCompleteSubject,
  type FundingCompleteProps,
} from './templates/funding-complete';
import VerificationStaleEmail, {
  subject as verificationStaleSubject,
  type VerificationStaleProps,
} from './templates/verification-stale';
import LenderRequestPostedEmail, {
  subject as lenderRequestPostedSubject,
  type LenderRequestPostedProps,
} from './templates/lender-request-posted';

/**
 * Every template, keyed by the name a queued job carries.
 *
 * The name is a stable wire value: a job enqueued before a deploy must still
 * resolve after it, so renaming a key is a breaking change even though nothing
 * in the type system says so.
 */
export interface EmailTemplates {
  'offers-received': OffersReceivedProps;
  'loi-signed': LoiSignedProps;
  'stips-requested': StipsRequestedProps;
  'terms-revised': TermsRevisedProps;
  'funding-complete': FundingCompleteProps;
  'verification-stale': VerificationStaleProps;
  'lender-request-posted': LenderRequestPostedProps;
}

export type EmailTemplateName = keyof EmailTemplates;

interface TemplateEntry<P> {
  component: ComponentType<P>;
  subject: (props: P) => string;
}

const registry: { [K in EmailTemplateName]: TemplateEntry<EmailTemplates[K]> } = {
  'offers-received': { component: OffersReceivedEmail, subject: offersReceivedSubject },
  'loi-signed': { component: LoiSignedEmail, subject: loiSignedSubject },
  'stips-requested': { component: StipsRequestedEmail, subject: stipsRequestedSubject },
  'terms-revised': { component: TermsRevisedEmail, subject: termsRevisedSubject },
  'funding-complete': { component: FundingCompleteEmail, subject: fundingCompleteSubject },
  'verification-stale': { component: VerificationStaleEmail, subject: verificationStaleSubject },
  'lender-request-posted': { component: LenderRequestPostedEmail, subject: lenderRequestPostedSubject },
};

export interface RenderedEmail {
  subject: string;
  html: string;
  /**
   * Always sent alongside the HTML. Some clients render it instead, and a
   * multipart message without it is far more likely to be marked as spam.
   */
  text: string;
}

/**
 * Render a template to the three parts a transport needs.
 *
 * This package deliberately does not send: it has no transport, no API key and
 * no retry policy. Delivery belongs to whoever owns the queue, so that a
 * template change never touches sending credentials.
 *
 * @example
 * ```typescript
 * const mail = await renderEmail('loi-signed', {
 *   borrowerName: 'Dana',
 *   lenderName: 'Meridian Capital',
 *   amount: 48_000, apr: 6.91, termMonths: 24, payment: 2144,
 *   signedAt: new Date(),
 *   fundingRoomUrl: `${appUrl}/marketplace/borrower/funding-room`,
 * });
 * await transport.send({ to, ...mail });
 * ```
 */
export async function renderEmail<K extends EmailTemplateName>(
  name: K,
  props: EmailTemplates[K],
): Promise<RenderedEmail> {
  const entry = registry[name];
  // The registry is keyed by the same union `name` comes from, but TS resolves
  // the lookup to a union of entries rather than the matching one, so the
  // component type has to be re-asserted here.
  const element = createElement(entry.component as ComponentType<EmailTemplates[K]>, props);

  const [html, text] = await Promise.all([render(element), render(element, { plainText: true })]);

  return { subject: entry.subject(props), html, text };
}

/** Template names, for validating a job payload before it reaches renderEmail. */
export const emailTemplateNames = Object.keys(registry) as EmailTemplateName[];

export function isEmailTemplateName(value: unknown): value is EmailTemplateName {
  return typeof value === 'string' && value in registry;
}

export { theme } from './theme';
export type {
  OffersReceivedProps,
  LoiSignedProps,
  StipsRequestedProps,
  TermsRevisedProps,
  FundingCompleteProps,
  VerificationStaleProps,
  LenderRequestPostedProps,
};
