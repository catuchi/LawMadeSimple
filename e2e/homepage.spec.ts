import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays hero section with search', async ({ page }) => {
    // Check hero heading
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Check search input exists (placeholder is "What legal situation are you dealing with?")
    const searchInput = page.locator('input[type="search"]');
    await expect(searchInput).toBeVisible();
  });

  test('displays legal disclaimer', async ({ page }) => {
    // Legal disclaimer should be visible
    const disclaimer = page.getByText(/not legal advice/i);
    await expect(disclaimer).toBeVisible();
  });

  test('displays scenario pills', async ({ page }) => {
    // Check for clickable scenario pills/categories
    const scenarioPills = page.locator('[data-testid="scenario-pill"]');
    // If no test id, look for common scenario links
    const scenarioLinks = page.getByRole('link', { name: /arrest|eviction|employment|rights/i });

    // At least one should be visible
    const pillCount = await scenarioPills.count();
    const linkCount = await scenarioLinks.count();
    expect(pillCount + linkCount).toBeGreaterThan(0);
  });

  test('displays popular topics section', async ({ page }) => {
    // Check for topics/categories section
    const topicsHeading = page.getByRole('heading', { name: /popular|topics|categories/i });
    await expect(topicsHeading).toBeVisible();
  });

  test('search redirects to search results', async ({ page }) => {
    const searchInput = page.locator('input[type="search"]');
    await searchInput.fill('arrest');
    await searchInput.press('Enter');

    // Should navigate to search page with query
    await expect(page).toHaveURL(/\/search\?q=arrest/);
  });

  test('has accessible navigation', async ({ page }) => {
    // On desktop, check for navigation bar
    // On mobile, navigation is in a hamburger menu
    const viewport = await page.viewportSize();

    if (viewport && viewport.width >= 768) {
      // Desktop: Check for visible navigation
      const nav = page.getByRole('navigation', { name: 'Main navigation' });
      await expect(nav).toBeVisible();

      // Check for main links within the nav (nav uses "Browse" instead of "Laws")
      await expect(nav.getByRole('link', { name: 'Browse', exact: true })).toBeVisible();
      await expect(nav.getByRole('link', { name: 'Scenarios' })).toBeVisible();
    } else {
      // Mobile: Check for hamburger menu button
      const menuButton = page.getByRole('button', { name: /open navigation menu/i });
      await expect(menuButton).toBeVisible();
    }
  });
});
