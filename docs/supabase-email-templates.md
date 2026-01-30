# Supabase Email Templates for LawMadeSimple

Copy and paste these templates into your Supabase Dashboard > Authentication > Email Templates.

**Design System:**
- Primary (Teal): `#1a5f7a`
- Accent (Gold): `#f4b942`
- Fonts: Georgia (headings), system sans-serif (body)

---

## 1. Confirm Sign Up

**Subject:** `Welcome to LawMadeSimple - Confirm Your Email`

**Body (Source):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <!-- Header -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 32px 40px 24px; border-bottom: 3px solid #f4b942;">
              <a href="{{ .SiteURL }}" style="text-decoration: none;">
                <h1 style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 24px; color: #1a5f7a; font-weight: 600;">
                  LawMadeSimple
                </h1>
              </a>
            </td>
          </tr>
        </table>

        <!-- Content -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 32px 40px;">
              <h2 style="margin: 0 0 16px; font-family: Georgia, 'Times New Roman', serif; font-size: 20px; color: #171717; font-weight: 600;">
                Welcome! Confirm your email
              </h2>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #525252;">
                Thanks for signing up for <a href="{{ .SiteURL }}" style="color: #1a5f7a; text-decoration: none; font-weight: 600;">LawMadeSimple</a>. To get started exploring Nigerian law in plain language, please confirm your email address.
              </p>

              <!-- Button -->
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color: #1a5f7a; border-radius: 6px;">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 14px 32px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none;">
                      Confirm Email Address
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0; font-size: 14px; line-height: 1.6; color: #737373;">
                If you didn't create an account, you can safely ignore this email.
              </p>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 24px 40px; background-color: #fafafa; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #737373; text-align: center;">
                LawMadeSimple helps you understand Nigerian law in plain language.<br>
                This is an automated message. Please do not reply directly to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 2. Magic Link (with 6-digit OTP Code)

**Subject:** `Your LawMadeSimple Sign-In Code: {{ .Token }}`

**Body (Source):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <!-- Header -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 32px 40px 24px; border-bottom: 3px solid #f4b942;">
              <a href="{{ .SiteURL }}" style="text-decoration: none;">
                <h1 style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 24px; color: #1a5f7a; font-weight: 600;">
                  LawMadeSimple
                </h1>
              </a>
            </td>
          </tr>
        </table>

        <!-- Content -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 32px 40px;">
              <h2 style="margin: 0 0 16px; font-family: Georgia, 'Times New Roman', serif; font-size: 20px; color: #171717; font-weight: 600;">
                Your sign-in code
              </h2>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #525252;">
                Enter this code to sign in to <a href="{{ .SiteURL }}" style="color: #1a5f7a; text-decoration: none; font-weight: 600;">LawMadeSimple</a>. It expires in 1 hour.
              </p>

              <!-- OTP Code Display -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 24px; background-color: #f5f5f5; border-radius: 8px; text-align: center;">
                    <span style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #1a5f7a;">
                      {{ .Token }}
                    </span>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 16px; font-size: 14px; line-height: 1.6; color: #737373; text-align: center;">
                Or click the button below to sign in automatically:
              </p>

              <!-- Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #1a5f7a; border-radius: 6px;">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none;">
                      Sign In Automatically
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0; font-size: 14px; line-height: 1.6; color: #737373;">
                If you didn't request this code, you can safely ignore this email. Your account is secure.
              </p>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 24px 40px; background-color: #fafafa; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #737373; text-align: center;">
                LawMadeSimple helps you understand Nigerian law in plain language.<br>
                This is an automated message. Please do not reply directly to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 3. Reset Password

**Subject:** `Reset Your LawMadeSimple Password`

**Body (Source):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <!-- Header -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 32px 40px 24px; border-bottom: 3px solid #f4b942;">
              <a href="{{ .SiteURL }}" style="text-decoration: none;">
                <h1 style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 24px; color: #1a5f7a; font-weight: 600;">
                  LawMadeSimple
                </h1>
              </a>
            </td>
          </tr>
        </table>

        <!-- Content -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 32px 40px;">
              <h2 style="margin: 0 0 16px; font-family: Georgia, 'Times New Roman', serif; font-size: 20px; color: #171717; font-weight: 600;">
                Reset your password
              </h2>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #525252;">
                We received a request to reset your password. Click the button below to choose a new password. This link will expire in 1 hour.
              </p>

              <!-- Button -->
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color: #1a5f7a; border-radius: 6px;">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 14px 32px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0; font-size: 14px; line-height: 1.6; color: #737373;">
                If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 24px 40px; background-color: #fafafa; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #737373; text-align: center;">
                LawMadeSimple helps you understand Nigerian law in plain language.<br>
                This is an automated message. Please do not reply directly to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 4. Invite User

**Subject:** `You're Invited to LawMadeSimple`

**Body (Source):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <!-- Header -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 32px 40px 24px; border-bottom: 3px solid #f4b942;">
              <a href="{{ .SiteURL }}" style="text-decoration: none;">
                <h1 style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 24px; color: #1a5f7a; font-weight: 600;">
                  LawMadeSimple
                </h1>
              </a>
            </td>
          </tr>
        </table>

        <!-- Content -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 32px 40px;">
              <h2 style="margin: 0 0 16px; font-family: Georgia, 'Times New Roman', serif; font-size: 20px; color: #171717; font-weight: 600;">
                You've been invited!
              </h2>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #525252;">
                You've been invited to join <a href="{{ .SiteURL }}" style="color: #1a5f7a; text-decoration: none; font-weight: 600;">LawMadeSimple</a>, where Nigerian law is explained in plain, easy-to-understand language. Click below to accept your invitation and create your account.
              </p>

              <!-- Button -->
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color: #1a5f7a; border-radius: 6px;">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 14px 32px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none;">
                      Accept Invitation
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0; font-size: 14px; line-height: 1.6; color: #737373;">
                If you weren't expecting this invitation, you can safely ignore this email.
              </p>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 24px 40px; background-color: #fafafa; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #737373; text-align: center;">
                LawMadeSimple helps you understand Nigerian law in plain language.<br>
                This is an automated message. Please do not reply directly to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 5. Change Email Address

**Subject:** `Confirm Your New Email Address - LawMadeSimple`

**Body (Source):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <!-- Header -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 32px 40px 24px; border-bottom: 3px solid #f4b942;">
              <a href="{{ .SiteURL }}" style="text-decoration: none;">
                <h1 style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 24px; color: #1a5f7a; font-weight: 600;">
                  LawMadeSimple
                </h1>
              </a>
            </td>
          </tr>
        </table>

        <!-- Content -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 32px 40px;">
              <h2 style="margin: 0 0 16px; font-family: Georgia, 'Times New Roman', serif; font-size: 20px; color: #171717; font-weight: 600;">
                Confirm your new email
              </h2>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #525252;">
                You requested to change your email address on <a href="{{ .SiteURL }}" style="color: #1a5f7a; text-decoration: none; font-weight: 600;">LawMadeSimple</a> from <strong>{{ .Email }}</strong> to <strong>{{ .NewEmail }}</strong>. Click the button below to confirm this change.
              </p>

              <!-- Button -->
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color: #1a5f7a; border-radius: 6px;">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 14px 32px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none;">
                      Confirm New Email
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0; font-size: 14px; line-height: 1.6; color: #737373;">
                If you didn't request this change, please secure your account immediately by resetting your password.
              </p>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 24px 40px; background-color: #fafafa; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #737373; text-align: center;">
                LawMadeSimple helps you understand Nigerian law in plain language.<br>
                This is an automated message. Please do not reply directly to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## How to Apply These Templates

1. Go to **Supabase Dashboard** > **Authentication** > **Email**
2. Click on each template type (Confirm sign up, Magic link, etc.)
3. Update the **Subject** field
4. Switch to **Source** view in the Body editor
5. Replace the content with the HTML above
6. Click **Save**

## Email Design Features

- **Branded header** with LawMadeSimple name and gold accent border
- **Teal primary buttons** (#1a5f7a) matching your design system
- **Clean typography** using system fonts for maximum compatibility
- **Responsive design** that works on mobile and desktop
- **Professional footer** with context about your service
- **Security-conscious copy** telling users what to do if they didn't request the email

## 6. Password Changed (Security Notification)

**Subject:** `Your LawMadeSimple Password Was Changed`

**Body (Source):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <!-- Header -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 32px 40px 24px; border-bottom: 3px solid #f4b942;">
              <a href="{{ .SiteURL }}" style="text-decoration: none;">
                <h1 style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 24px; color: #1a5f7a; font-weight: 600;">
                  LawMadeSimple
                </h1>
              </a>
            </td>
          </tr>
        </table>

        <!-- Content -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 32px 40px;">
              <h2 style="margin: 0 0 16px; font-family: Georgia, 'Times New Roman', serif; font-size: 20px; color: #171717; font-weight: 600;">
                Your password was changed
              </h2>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #525252;">
                The password for your <a href="{{ .SiteURL }}" style="color: #1a5f7a; text-decoration: none; font-weight: 600;">LawMadeSimple</a> account ({{ .Email }}) was recently changed.
              </p>

              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #525252;">
                If you made this change, no further action is needed.
              </p>

              <!-- Warning Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 16px; background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
                    <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #92400e;">
                      <strong>Didn't make this change?</strong><br>
                      Your account may be compromised. Please reset your password immediately and review your account activity.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 24px 40px; background-color: #fafafa; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #737373; text-align: center;">
                LawMadeSimple helps you understand Nigerian law in plain language.<br>
                This is an automated security notification.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 7. Email Address Changed (Security Notification)

**Subject:** `Your LawMadeSimple Email Address Was Changed`

**Body (Source):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <!-- Header -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 32px 40px 24px; border-bottom: 3px solid #f4b942;">
              <a href="{{ .SiteURL }}" style="text-decoration: none;">
                <h1 style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 24px; color: #1a5f7a; font-weight: 600;">
                  LawMadeSimple
                </h1>
              </a>
            </td>
          </tr>
        </table>

        <!-- Content -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 32px 40px;">
              <h2 style="margin: 0 0 16px; font-family: Georgia, 'Times New Roman', serif; font-size: 20px; color: #171717; font-weight: 600;">
                Your email address was changed
              </h2>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #525252;">
                The email address for your <a href="{{ .SiteURL }}" style="color: #1a5f7a; text-decoration: none; font-weight: 600;">LawMadeSimple</a> account was changed from <strong>{{ .OldEmail }}</strong> to <strong>{{ .Email }}</strong>.
              </p>

              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #525252;">
                If you made this change, no further action is needed. You'll now use your new email address to sign in.
              </p>

              <!-- Warning Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 16px; background-color: #fee2e2; border-radius: 8px; border-left: 4px solid #ef4444;">
                    <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #991b1b;">
                      <strong>Didn't make this change?</strong><br>
                      Your account may have been compromised. Please contact us immediately as you may have lost access to your account.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 24px 40px; background-color: #fafafa; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #737373; text-align: center;">
                LawMadeSimple helps you understand Nigerian law in plain language.<br>
                This is an automated security notification.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## Placeholders Summary

| Template | Placeholders Used |
|----------|------------------|
| Confirm Sign Up | `{{ .SiteURL }}`, `{{ .ConfirmationURL }}` |
| Magic Link | `{{ .SiteURL }}`, `{{ .Token }}` (6-digit OTP), `{{ .ConfirmationURL }}` |
| Reset Password | `{{ .SiteURL }}`, `{{ .ConfirmationURL }}` |
| Invite User | `{{ .SiteURL }}`, `{{ .ConfirmationURL }}` |
| Change Email | `{{ .SiteURL }}`, `{{ .ConfirmationURL }}`, `{{ .Email }}`, `{{ .NewEmail }}` |
| Password Changed | `{{ .SiteURL }}`, `{{ .Email }}` |
| Email Address Changed | `{{ .SiteURL }}`, `{{ .OldEmail }}`, `{{ .Email }}` |
