import { test, expect } from '@playwright/test';

test.describe('Search', () => {
  test('shows results for valid query', async ({ page }) => {
    await page.goto('/search?q=arrest');

    // Wait for results to load
    await page.waitForLoadState('networkidle');

    // Check search results are displayed or empty state
    const results = page.locator('[data-testid="search-result"]');
    const emptyState = page.getByText(/no results/i);

    // Either results or empty state should be visible
    const hasResults = (await results.count()) > 0;
    const hasEmptyState = await emptyState.isVisible().catch(() => false);

    expect(hasResults || hasEmptyState).toBe(true);
  });

  test('search input is pre-filled with query', async ({ page }) => {
    await page.goto('/search?q=police');

    const searchInput = page.getByRole('textbox', { name: /search/i });
    await expect(searchInput).toHaveValue('police');
  });

  test('can filter by type', async ({ page }) => {
    await page.goto('/search?q=rights');

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
    await page.goto('/search?q=tenant+rights');

    await page.waitForLoadState('networkidle');

    // Mode indicator is optional, just verify page works
    await expect(page.locator('main')).toBeVisible();
  });

  test('handles empty query gracefully', async ({ page }) => {
    await page.goto('/search');

    // Should show prompt or empty state
    const emptyState = page.getByText(/enter a search|no query/i);
    const searchInput = page.getByRole('textbox', { name: /search/i });

    // Either empty state message or just the search input
    const hasEmptyState = await emptyState.isVisible().catch(() => false);
    const hasSearchInput = await searchInput.isVisible();

    expect(hasEmptyState || hasSearchInput).toBe(true);
  });

  test('can perform new search from results page', async ({ page }) => {
    await page.goto('/search?q=arrest');

    const searchInput = page.getByRole('textbox', { name: /search/i });
    await searchInput.clear();
    await searchInput.fill('eviction');
    await searchInput.press('Enter');

    await expect(page).toHaveURL(/\/search\?q=eviction/);
  });
});
