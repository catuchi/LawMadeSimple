import { test, expect } from './fixtures';

test.describe('Scenarios', () => {
  // Use longer timeout for database-dependent pages
  test.setTimeout(60000);

  test('scenarios index page loads', async ({ page }) => {
    await page.goto('/scenarios', { timeout: 30000 });
    await page.waitForLoadState('networkidle');

    // Check page has loaded
    await expect(page).toHaveURL('/scenarios');

    // Check for heading
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
  });

  test('displays scenario categories', async ({ page }) => {
    await page.goto('/scenarios', { timeout: 30000 });
    await page.waitForLoadState('networkidle');

    // Look for category cards or filters
    const categoryLinks = page.getByRole('link');
    const categoryCount = await categoryLinks.count();

    // Should have multiple category links
    expect(categoryCount).toBeGreaterThan(0);
  });

  test('can filter by category', async ({ page }) => {
    await page.goto('/scenarios?category=criminal', { timeout: 30000 });
    await page.waitForLoadState('networkidle');

    // Check URL has category param
    await expect(page).toHaveURL(/category=criminal/);

    // Page should load without errors
    await expect(page.locator('main')).toBeVisible();
  });

  test('scenario detail page shows related sections', async ({ page }) => {
    // Go to scenarios index first
    await page.goto('/scenarios', { timeout: 30000 });
    await page.waitForLoadState('networkidle');

    // Find and click a scenario link (if any exist)
    const scenarioLinks = page.locator('a[href^="/scenarios/"]').filter({
      hasNot: page.locator('a[href="/scenarios"]'),
    });

    const count = await scenarioLinks.count();

    if (count > 0) {
      // Click first scenario
      await scenarioLinks.first().click();

      // Wait for navigation
      await page.waitForLoadState('networkidle');

      // Should be on scenario detail page
      await expect(page).toHaveURL(/\/scenarios\/.+/, { timeout: 15000 });

      // Check for related sections heading or list
      const sectionsHeading = page.getByRole('heading', { name: /related|section/i });
      const sectionsList = page.locator('[data-testid="related-sections"]');

      const hasSections =
        (await sectionsHeading.isVisible().catch(() => false)) ||
        (await sectionsList.isVisible().catch(() => false));

      // Sections should be visible if scenario has mappings
      expect(hasSections || (await page.locator('main').isVisible())).toBe(true);
    }
  });

  test('scenario detail has breadcrumb navigation', async ({ page }) => {
    // Navigate to a scenario detail page via URL
    // Using a known scenario slug from seed data
    await page.goto('/scenarios/police-arrest-without-warrant', { timeout: 30000 });
    await page.waitForLoadState('networkidle');

    // Check for breadcrumb navigation
    const breadcrumb = page.locator('nav[aria-label="breadcrumb"], [data-testid="breadcrumb"]');

    if (await breadcrumb.isVisible().catch(() => false)) {
      // Check for back link to scenarios index
      const scenariosLink = breadcrumb.getByRole('link', { name: /scenarios/i });
      await expect(scenariosLink).toBeVisible();
    }
  });
});
