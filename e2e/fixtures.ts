/* eslint-disable react-hooks/rules-of-hooks */
import { test as base, expect } from '@playwright/test';

// Extend the base test with cookie consent handling
export const test = base.extend({
  page: async ({ page }, use) => {
    // Set cookie consent to skip the dialog before any navigation
    await page.addInitScript(() => {
      localStorage.setItem('lms-cookie-consent', 'true');
    });
    await use(page);
  },
});

export { expect };

// Helper to navigate with proper waiting
export async function navigateAndWait(
  page: import('@playwright/test').Page,
  url: string,
  timeout = 30000
) {
  await page.goto(url, { timeout });
  await page.waitForLoadState('networkidle', { timeout });
}
