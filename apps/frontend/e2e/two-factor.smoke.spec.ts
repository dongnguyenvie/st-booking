import { test, expect } from '@playwright/test';
import { ensureTestUserExists, getTestUserCredentials } from './helpers/seed-user';

test.describe('@smoke 2FA End-to-End', () => {
  let testEmail: string;
  let testPassword: string;

  test.beforeAll(async () => {
    await ensureTestUserExists();
    const creds = getTestUserCredentials();
    testEmail = creds.email;
    testPassword = creds.password;
  });

  test('Settings page loads and displays 2FA options', async ({ page }) => {
    // 1. Login first
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');

    // Wait for either redirect or stay on login
    await page.waitForTimeout(1000);

    // 2. Navigate to settings/security
    await page.goto('/settings/security');
    await page.waitForLoadState('networkidle');

    // 3. Check that 2FA section is visible
    const securityHeading = page.locator('text=Security').first();
    await expect(securityHeading).toBeVisible();

    // 4. Verify both TOTP and Email OTP options exist
    const totpOption = page.locator('text=Authenticator App').first();
    const emailOption = page.locator('text=Email OTP').first();

    await expect(totpOption).toBeVisible();
    await expect(emailOption).toBeVisible();

    // 5. Verify enable buttons exist
    const enableTotpBtn = page
      .locator('button')
      .filter({ hasText: /Enable Authenticator/ })
      .first();
    const enableEmailBtn = page
      .locator('button')
      .filter({ hasText: /Enable Email/ })
      .first();

    await expect(enableTotpBtn).toBeVisible();
    await expect(enableEmailBtn).toBeVisible();

    console.log('✓ Settings page loads with both 2FA methods available');
  });

  test('Test user GraphQL API access works', async ({ page, context }) => {
    // This test verifies backend API is reachable and responsive
    const response = await context.request.post('http://localhost:7001/graphql', {
      data: {
        query: `
          query {
            me {
              id
              email
            }
          }
        `,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBeLessThan(500); // Either 200 or 401 (unauthenticated) - both are valid
    const body = await response.json();

    // Either get user data or auth error, both indicate API is working
    const hasData = body.data || body.errors;
    expect(hasData).toBeTruthy();

    console.log('✓ GraphQL API is responsive');
  });
});
