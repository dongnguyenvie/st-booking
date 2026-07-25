// Captures evidence screenshots of canmorestays.com for the spec.
// Run: node apps/specs/canmorestays-clone/capture-screenshots.mjs
import { chromium } from '/Users/dongnguyenquy/Desktop/project-all/freelancer/ST_software/st-booking/node_modules/.pnpm/playwright@1.59.1/node_modules/playwright/index.mjs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, 'screenshots');
const BASE = 'https://www.canmorestays.com';

const DESKTOP = { width: 1280, height: 720 };
const MOBILE = { width: 375, height: 812 };

/** Best-effort dismissal of the Osano cookie consent banner (prefer decline). */
async function dismissConsent(page) {
  const labels = ['Deny', 'Decline', 'Reject All', 'Reject', 'Manage', 'Accept'];
  for (const label of labels) {
    try {
      const btn = page.getByRole('button', { name: new RegExp(label, 'i') });
      if (await btn.first().isVisible({ timeout: 800 })) {
        await btn.first().click({ timeout: 1500 });
        await page.waitForTimeout(600);
        return;
      }
    } catch {
      /* try next label */
    }
  }
}

async function goto(page, path) {
  await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(1500);
}

async function shot(page, name, fullPage = true) {
  const file = join(OUT, name);
  await page.screenshot({ path: file, fullPage });
  console.log('captured', name);
}

const shots = [
  // [file, path, viewport, fullPage, interact?]
  { name: 'home-desktop.png', path: '/', vp: DESKTOP, fullPage: true },
  { name: 'home-mobile.png', path: '/', vp: MOBILE, fullPage: true },
  { name: 'all-listings-desktop.png', path: '/all-listings', vp: DESKTOP, fullPage: true },
  { name: 'search-results-map.png', path: '/search?numberOfGuests=1', vp: DESKTOP, fullPage: false },
  { name: 'listing-detail-gallery.png', path: '/listings/355029', vp: DESKTOP, fullPage: true },
  { name: 'contact-desktop.png', path: '/contact-us', vp: DESKTOP, fullPage: true },
];

const browser = await chromium.launch({ headless: true });
try {
  for (const s of shots) {
    const context = await browser.newContext({ viewport: s.vp, deviceScaleFactor: 1 });
    const page = await context.newPage();
    try {
      await goto(page, s.path);
      await dismissConsent(page);
      await page.waitForTimeout(800);
      await shot(page, s.name, s.fullPage);
    } catch (e) {
      console.error('FAILED', s.name, e?.message);
    } finally {
      await context.close();
    }
  }

  // --- Interactive states (best-effort) ---

  // home: open the location dropdown
  {
    const context = await browser.newContext({ viewport: DESKTOP });
    const page = await context.newPage();
    try {
      await goto(page, '/');
      await dismissConsent(page);
      const loc = page.getByText(/Any location|location/i).first();
      await loc.click({ timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(1000);
      await shot(page, 'home-search-location-open.png', false);
    } catch (e) {
      console.error('FAILED home-search-location-open.png', e?.message);
    } finally {
      await context.close();
    }
  }

  // search: open the filter modal
  {
    const context = await browser.newContext({ viewport: DESKTOP });
    const page = await context.newPage();
    try {
      await goto(page, '/search');
      await dismissConsent(page);
      const filter = page.getByRole('button', { name: /filter/i }).first();
      await filter.click({ timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(1200);
      await shot(page, 'search-filter-modal.png', false);
    } catch (e) {
      console.error('FAILED search-filter-modal.png', e?.message);
    } finally {
      await context.close();
    }
  }

  // listing: booking widget (viewport crop) + calendar open
  {
    const context = await browser.newContext({ viewport: DESKTOP });
    const page = await context.newPage();
    try {
      await goto(page, '/listings/355029');
      await dismissConsent(page);
      await shot(page, 'listing-booking-widget.png', false);
      const dates = page.getByText(/Select dates|Select Dates|Check-in/i).first();
      await dates.click({ timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(1200);
      await shot(page, 'listing-calendar.png', false);
    } catch (e) {
      console.error('FAILED listing booking/calendar', e?.message);
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
}
console.log('DONE');
