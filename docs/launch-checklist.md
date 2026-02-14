# LawMadeSimple Launch Checklist

Pre-launch verification checklist for MVP deployment.

## Content

- [ ] All 11 laws seeded
- [ ] All 60 scenarios seeded
- [ ] All embeddings generated (422 sections + 60 scenarios)
- [ ] Search working (keyword, semantic, hybrid modes)
- [ ] AI explanations generating correctly

## Authentication

- [ ] Google OAuth working
- [ ] Apple OAuth working
- [ ] Facebook OAuth working
- [ ] Email/password sign-up working
- [ ] Email/password sign-in working
- [ ] Magic link working
- [ ] OTP (6-digit code) working
- [ ] Forgot password flow working
- [ ] Email confirmation working

## Core Features

- [ ] Homepage loads correctly
- [ ] Laws browser displays all laws
- [ ] Law detail pages show sections
- [ ] Scenarios list displays categories
- [ ] Scenario detail shows related laws
- [ ] Search returns relevant results
- [ ] AI explanations stream correctly
- [ ] Explanations cache working
- [ ] Bookmarks add/remove working
- [ ] Rate limiting active

## Security

- [ ] CSP header enforcing (switch from report-only)
- [ ] All security headers present
- [ ] npm audit clean (or documented exceptions)
- [ ] No exposed secrets in code
- [ ] Protected routes redirect correctly
- [ ] Session management working

## NDPR Compliance

- [ ] Privacy policy published at `/privacy`
- [ ] Terms of service published at `/terms`
- [ ] Disclaimer published at `/disclaimer`
- [ ] About page published at `/about`
- [ ] Cookie consent banner working
- [ ] Data export endpoint working (`/api/v1/user/export`)
- [ ] Account deletion working in Settings

## Monitoring

- [ ] Sentry capturing errors
- [ ] Vercel Analytics enabled
- [ ] Uptime monitoring active (e.g., UptimeRobot)

## Infrastructure

- [ ] Domain configured (lawmadesimple.ng)
- [ ] SSL certificate valid
- [ ] www redirect working
- [ ] Production env vars set in Vercel
- [ ] Supabase production project configured
- [ ] OpenAI API key has billing set up

## Testing Verification

```bash
# Run all tests before launch
npm run test
npm run test:e2e
npm run build
npm run typecheck
```

- [ ] All unit tests passing (245+)
- [ ] All E2E tests passing (124+)
- [ ] Build succeeds without errors
- [ ] TypeScript check passes

## Production Smoke Test

After deploying, verify these critical paths on production:

1. [ ] Homepage loads
2. [ ] Search returns results (all 3 modes)
3. [ ] Scenario detail shows related laws
4. [ ] Law detail shows sections
5. [ ] AI explanation streams
6. [ ] Sign up / sign in works
7. [ ] Bookmark add/remove works
8. [ ] Legal pages accessible
9. [ ] Data export downloads
10. [ ] Mobile responsiveness verified

## Cross-Browser Testing

- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Mobile Chrome (iOS/Android)
- [ ] Mobile Safari (iOS)

## Post-Launch Tasks

- [ ] Monitor Sentry for errors
- [ ] Check Vercel Analytics for traffic
- [ ] Review rate limiting effectiveness
- [ ] Collect user feedback
- [ ] Plan next iteration based on usage

---

**Launch Date:** ________________

**Verified By:** ________________

**Notes:**
