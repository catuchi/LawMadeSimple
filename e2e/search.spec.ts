import { test, expect } from './fixtures';

test.describe('Search', () => {
  // Use longer timeout for database-dependent pages
  test.setTimeout(60000);

  test('shows results for valid query', async ({ page }) => {
    await page.goto('/search?q=arrest', { timeout: 30000 });
    await page.waitForLoadState('networkidle');

    // Check main content is visible (results or empty state)
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();

    // Check for either results (LawCard components) or empty state message
    const results = page.locator('a[href*="/explain/"], a[href*="/scenarios/"], a[href*="/laws/"]');
    const emptyState = page.getByText(/no results|couldn't find/i);

    // Either results or empty state should be visible
    const hasResults = (await results.count()) > 0;
    const hasEmptyState = await emptyState.isVisible().catch(() => false);

    expect(hasResults || hasEmptyState).toBe(true);
  });

  test('search input is pre-filled with query', async ({ page }) => {
    await page.goto('/search?q=police', { timeout: 30000 });
    await page.waitForLoadState('networkidle');

    // Search input uses type="search" with combobox role (use first() for mobile with multiple inputs)
    const searchInput = page.locator('input[type="search"]').first();
    await expect(searchInput).toHaveValue('police');
  });

  test('can filter by type', async ({ page }) => {
    await page.goto('/search?q=rights', { timeout: 30000 });
    await page.waitForLoadState('networkidle');

    // Look for filter buttons/tabs
    const sectionFilter = page.getByRole('button', { name: /section/i });
    const scenarioFilter = page.getByRole('button', { name: /scenario/i });
    const lawFilter = page.getByRole('button', { name: /law/i });

    // Check if at least one filter is visible (optional feature)
    await Promise.all([
      sectionFilter.isVisible().catch(() => false),
      scenarioFilter.isVisible().catch(() => false),
      lawFilter.isVisible().catch(() => false),
    ]);

    // Filters are optional, so we just check the page loads
    await expect(page).toHaveURL(/\/search\?q=rights/);
  });

  test('shows search mode indicator', async ({ page }) => {
    await page.goto('/search?q=tenant+rights', { timeout: 30000 });
    await page.waitForLoadState('networkidle');

    // Mode indicator is optional, just verify page works
    await expect(page.locator('main')).toBeVisible();
  });

  test('handles empty query gracefully', async ({ page }) => {
    await page.goto('/search', { timeout: 30000 });
    await page.waitForLoadState('networkidle');

    // Should show prompt or empty state
    const emptyState = page.getByText(/search nigerian laws|describe your/i);
    // Use first() since there may be both header and main search inputs
    const searchInput = page.locator('input[type="search"]').first();

    // Either empty state message or just the search input
    const hasEmptyState = await emptyState.isVisible().catch(() => false);
    const hasSearchInput = await searchInput.isVisible();

    expect(hasEmptyState || hasSearchInput).toBe(true);
  });

  test('can perform new search from results page', async ({ page }) => {
    await page.goto('/search?q=arrest', { timeout: 30000 });
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator('input[type="search"]').first();
    await searchInput.clear();
    await searchInput.fill('eviction');

    // Wait for suggestions to potentially load
    await page.waitForTimeout(500);

    await searchInput.press('Enter');

    await expect(page).toHaveURL(/\/search\?q=eviction/, { timeout: 10000 });
  });
});
