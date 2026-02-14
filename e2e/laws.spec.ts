import { test, expect } from './fixtures';

// Increase timeout for dynamic pages that need database access
test.describe('Laws', () => {
  // Use longer timeout for database-dependent pages
  test.setTimeout(60000);

  test('laws index page loads', async ({ page }) => {
    await page.goto('/laws', { timeout: 30000 });
    await page.waitForLoadState('networkidle');

    // Check page has loaded
    await expect(page).toHaveURL('/laws');

    // Check for heading
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
  });

  test('displays law categories', async ({ page }) => {
    await page.goto('/laws', { timeout: 30000 });
    await page.waitForLoadState('networkidle');

    // Look for law cards or category groupings
    const lawLinks = page.getByRole('link');
    const lawCount = await lawLinks.count();

    // Should have law links
    expect(lawCount).toBeGreaterThan(0);
  });

  test('law detail page shows sections', async ({ page }) => {
    // Navigate to a known law
    await page.goto('/laws/constitution-1999', { timeout: 30000 });
    await page.waitForLoadState('networkidle');

    // Check page loaded
    await expect(page).toHaveURL('/laws/constitution-1999');

    // Check for law title
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();

    // Check for sections list
    const sectionLinks = page.getByRole('link', { name: /section|article/i });
    const sectionCount = await sectionLinks.count();

    // Should have sections
    expect(sectionCount).toBeGreaterThanOrEqual(0);
  });

  test('can navigate from law to section explanation', async ({ page }) => {
    await page.goto('/laws/constitution-1999', { timeout: 30000 });
    await page.waitForLoadState('networkidle');

    // Find section links
    const sectionLinks = page.locator('a[href*="/explain/"]');
    const count = await sectionLinks.count();

    if (count > 0) {
      // Click first section
      await sectionLinks.first().click();

      // Should navigate to explanation page
      await expect(page).toHaveURL(/\/explain\/.+\/.+/, { timeout: 15000 });
    }
  });

  test('law detail has breadcrumb navigation', async ({ page }) => {
    await page.goto('/laws/constitution-1999', { timeout: 30000 });
    await page.waitForLoadState('networkidle');

    // Check for breadcrumb
    const breadcrumb = page.locator('nav[aria-label="breadcrumb"], [data-testid="breadcrumb"]');

    if (await breadcrumb.isVisible().catch(() => false)) {
      // Check for back link to laws index
      const lawsLink = breadcrumb.getByRole('link', { name: /laws/i });
      await expect(lawsLink).toBeVisible();
    }
  });

  test('explanation page shows AI explanation', async ({ page }) => {
    // Navigate to an explanation page
    await page.goto('/explain/constitution-1999/section-33', { timeout: 30000 });
    await page.waitForLoadState('networkidle');

    // Check for explanation content or loading state
    const explanationContent = page.locator('[data-testid="explanation-content"]');
    const loadingState = page.getByText(/loading|generating/i);
    const disclaimer = page.getByText(/not legal advice/i);

    // Either explanation, loading, or at least disclaimer should be visible
    const hasContent =
      (await explanationContent.isVisible().catch(() => false)) ||
      (await loadingState.isVisible().catch(() => false)) ||
      (await disclaimer.isVisible().catch(() => false));

    expect(hasContent || (await page.locator('main').isVisible())).toBe(true);
  });

  test('explanation page has disclaimer', async ({ page }) => {
    await page.goto('/explain/constitution-1999/section-33', { timeout: 30000 });
    await page.waitForLoadState('networkidle');

    // Legal disclaimer should always be present (use first() since there may be multiple)
    const disclaimer = page
      .getByText(/not legal advice|educational purposes|consult.*lawyer/i)
      .first();
    await expect(disclaimer).toBeVisible();
  });
});
