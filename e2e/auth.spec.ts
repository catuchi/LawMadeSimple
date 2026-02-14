import { test, expect } from './fixtures';

test.describe('Authentication', () => {
  test.describe('Sign-in page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/sign-in');
    });

    test('displays sign-in form correctly', async ({ page }) => {
      // Check page title
      await expect(page).toHaveTitle(/Sign In/i);

      // Check heading
      await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();

      // Check email input
      await expect(page.getByLabel(/email/i).first()).toBeVisible();

      // Check password input (use locator to avoid matching "Show password" button)
      await expect(page.locator('input[name="password"]')).toBeVisible();

      // Check sign in button
      await expect(page.getByRole('button', { name: /sign in$/i })).toBeVisible();
    });

    test('displays OAuth buttons', async ({ page }) => {
      // Check for all OAuth providers
      await expect(page.getByRole('button', { name: /continue with google/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /continue with apple/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /continue with facebook/i })).toBeVisible();
    });

    test('has forgot password link', async ({ page }) => {
      const forgotLink = page.getByRole('link', { name: /forgot password/i });
      await expect(forgotLink).toBeVisible();
      await expect(forgotLink).toHaveAttribute('href', '/forgot-password');
    });

    test('has sign up link', async ({ page }) => {
      const signUpLink = page.getByRole('link', { name: /sign up/i });
      await expect(signUpLink).toBeVisible();
      await expect(signUpLink).toHaveAttribute('href', '/sign-up');
    });

    test('has alternative sign-in methods', async ({ page }) => {
      // Check for code sign-in option
      await expect(page.getByRole('button', { name: /sign in with a code/i })).toBeVisible();

      // Check for magic link option
      await expect(page.getByRole('button', { name: /use magic link/i })).toBeVisible();
    });

    test('validates empty form submission', async ({ page }) => {
      // Try to submit without filling in the form
      const submitButton = page.getByRole('button', { name: /sign in$/i });
      await submitButton.click();

      // Form should not submit due to required fields (browser validation)
      // Email input should show validation
      const emailInput = page.getByLabel(/email/i).first();
      await expect(emailInput).toHaveAttribute('required', '');
    });

    test('validates email format', async ({ page }) => {
      const emailInput = page.getByLabel(/email/i).first();
      const passwordInput = page.locator('input[name="password"]');

      // Enter invalid email
      await emailInput.fill('invalid-email');
      await passwordInput.fill('password123');

      // HTML5 validation should prevent submission
      await expect(emailInput).toHaveAttribute('type', 'email');
    });
  });

  test.describe('Sign-up page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/sign-up');
    });

    test('displays sign-up form correctly', async ({ page }) => {
      // Check page title
      await expect(page).toHaveTitle(/Sign Up/i);

      // Check heading
      await expect(page.getByRole('heading', { name: /create an account/i })).toBeVisible();

      // Check for form elements
      await expect(page.getByLabel(/email/i)).toBeVisible();
    });

    test('displays OAuth buttons', async ({ page }) => {
      // Check for all OAuth providers
      await expect(page.getByRole('button', { name: /continue with google/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /continue with apple/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /continue with facebook/i })).toBeVisible();
    });

    test('has sign in link for existing users', async ({ page }) => {
      const signInLink = page.getByRole('link', { name: /sign in/i });
      await expect(signInLink).toBeVisible();
    });
  });

  test.describe('Forgot password page', () => {
    test('displays reset password form', async ({ page }) => {
      await page.goto('/forgot-password');

      // Check heading
      await expect(
        page.getByRole('heading', { name: /reset.*password|forgot.*password/i })
      ).toBeVisible();

      // Check email input
      await expect(page.getByLabel(/email/i)).toBeVisible();

      // Check submit button
      await expect(page.getByRole('button', { name: /send|reset/i })).toBeVisible();
    });

    test('has back to sign in link', async ({ page }) => {
      await page.goto('/forgot-password');

      const signInLink = page.getByRole('link', { name: /sign in|back/i });
      await expect(signInLink).toBeVisible();
    });
  });

  test.describe('Protected routes redirect', () => {
    test('redirects /saved to sign-in when unauthenticated', async ({ page }) => {
      await page.goto('/saved');

      // Should redirect to sign-in with redirectTo parameter
      await expect(page).toHaveURL(/\/sign-in\?redirectTo=/);
    });

    test('redirects /settings to sign-in when unauthenticated', async ({ page }) => {
      await page.goto('/settings');

      // Should redirect to sign-in with redirectTo parameter
      await expect(page).toHaveURL(/\/sign-in\?redirectTo=/);
    });

    test('redirects /dashboard to sign-in when unauthenticated', async ({ page }) => {
      await page.goto('/dashboard');

      // Should redirect to sign-in with redirectTo parameter
      await expect(page).toHaveURL(/\/sign-in\?redirectTo=/);
    });

    test('preserves redirectTo in URL', async ({ page }) => {
      await page.goto('/saved');

      // Check that redirectTo contains the original path
      await expect(page).toHaveURL(/redirectTo=%2Fsaved/);
    });
  });

  test.describe('Code sign-in mode', () => {
    test('can switch to code sign-in mode', async ({ page }) => {
      await page.goto('/sign-in');

      // Click the "Sign in with a code" button
      await page.getByRole('button', { name: /sign in with a code/i }).click();

      // Should show email input for code mode
      await expect(page.getByText(/send a 6-digit code/i)).toBeVisible();
    });
  });

  test.describe('Magic link mode', () => {
    test('can switch to magic link mode', async ({ page }) => {
      await page.goto('/sign-in');

      // Click the "Use magic link" button
      await page.getByRole('button', { name: /use magic link/i }).click();

      // Should show magic link explanation
      await expect(page.getByText(/send a sign-in link/i)).toBeVisible();
    });
  });

  test.describe('Resend confirmation page', () => {
    test('displays resend confirmation form', async ({ page }) => {
      await page.goto('/resend-confirmation');

      // Check for email input
      await expect(page.getByLabel(/email/i)).toBeVisible();

      // Check for submit button
      await expect(page.getByRole('button', { name: /resend|send/i })).toBeVisible();
    });
  });
});
