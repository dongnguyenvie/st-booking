import { renderEmail, emailTemplateNames, isEmailTemplateName, type EmailTemplates } from './index';

import OffersReceivedEmail from './templates/offers-received';
import LoiSignedEmail from './templates/loi-signed';
import StipsRequestedEmail from './templates/stips-requested';
import TermsRevisedEmail from './templates/terms-revised';
import FundingCompleteEmail from './templates/funding-complete';
import VerificationStaleEmail from './templates/verification-stale';
import LenderRequestPostedEmail from './templates/lender-request-posted';

/**
 * The PreviewProps each template already declares for the react-email dev
 * server double as test fixtures — so a template whose preview data drifts from
 * its prop type fails here rather than in someone's inbox.
 */
const fixtures: { [K in keyof EmailTemplates]: EmailTemplates[K] } = {
  'offers-received': OffersReceivedEmail.PreviewProps,
  'loi-signed': LoiSignedEmail.PreviewProps,
  'stips-requested': StipsRequestedEmail.PreviewProps,
  'terms-revised': TermsRevisedEmail.PreviewProps,
  'funding-complete': FundingCompleteEmail.PreviewProps,
  'verification-stale': VerificationStaleEmail.PreviewProps,
  'lender-request-posted': LenderRequestPostedEmail.PreviewProps,
};

describe('renderEmail', () => {
  it('has a fixture for every registered template', () => {
    expect(Object.keys(fixtures).sort()).toEqual([...emailTemplateNames].sort());
  });

  it.each(emailTemplateNames)('renders %s to html, text and a subject', async (name) => {
    const mail = await renderEmail(name, fixtures[name]);

    expect(mail.subject.trim()).not.toHaveLength(0);
    expect(mail.html).toContain('<html');
    expect(mail.text.trim()).not.toHaveLength(0);

    // A template that silently dropped an interpolation would still render, so
    // assert no placeholder survived into the output.
    expect(mail.html).not.toContain('undefined');
    expect(mail.html).not.toContain('NaN');
    expect(mail.subject).not.toContain('undefined');

    // No `{{mustache}}` may survive into the output. This package has no
    // transport doing substitution, so a placeholder here ships as a dead link.
    expect(mail.html).not.toMatch(/\{\{|\}\}/);

    // Every href must be a real absolute URL for the same reason.
    for (const href of [...mail.html.matchAll(/href="([^"]*)"/g)].map((m) => m[1])) {
      expect(href).toMatch(/^https?:\/\//);
    }
  });

  it('guards template names coming off a queue', () => {
    expect(isEmailTemplateName('loi-signed')).toBe(true);
    expect(isEmailTemplateName('loi-signed-v2')).toBe(false);
    expect(isEmailTemplateName(undefined)).toBe(false);
  });
});

describe('template content', () => {
  it('states the locked terms on the LOI mail', async () => {
    const mail = await renderEmail('loi-signed', fixtures['loi-signed']);

    expect(mail.subject).toBe('Your letter of intent with Meridian Capital is signed');
    expect(mail.text).toContain('6.91%');
    expect(mail.text).toContain('$48,000');
    expect(mail.text).toContain('$2,144.00');
  });

  it('shows only the terms that actually moved as a revision diff', async () => {
    const mail = await renderEmail('terms-revised', fixtures['terms-revised']);

    // APR and payment changed; amount and term did not, so they carry no
    // strike-through — a false diff would read as a change the lender never made.
    expect(mail.html).toContain('line-through');
    const struck = [...mail.html.matchAll(/line-through[^>]*>([^<]+)</g)].map((m) => m[1]);
    expect(struck).toEqual(['6.91%', '$2,144.00']);
  });

  it('counts submitted-but-unapproved conditions as outstanding work', async () => {
    const mail = await renderEmail('stips-requested', fixtures['stips-requested']);

    expect(mail.text).toContain('Year-to-date profit & loss statement');
    // The funding room spec is explicit that submitting is not approving; the
    // mail must not imply otherwise.
    expect(mail.text.toLowerCase()).toContain('not the same as it being approved');
  });

  it('never leaks a full bank account number on the funding mail', async () => {
    const mail = await renderEmail('funding-complete', fixtures['funding-complete']);

    expect(mail.text).toContain('4417');
    expect(mail.text).not.toMatch(/\b\d{7,}\b/);
  });
});
