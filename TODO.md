# Pending Tasks

## Database Migration (Blocked by Supabase Maintenance)

**Date:** 2026-01-28

**Issue:** Supabase scheduled maintenance prevented schema push.

**Action Required:** Run the following command once Supabase is back online:

```bash
npm run db:push
```

**What it does:** Applies the new subscription and usage tracking models:
- `Subscription` table (tier, status, payment provider, billing period)
- `UsageRecord` table (tracks explanations generated, searches performed)
- New enums: `SubscriptionTier`, `SubscriptionStatus`, `UsageAction`

**Files created in this session:**
- `prisma/schema.prisma` — Updated with new models
- `src/constants/subscription.ts` — Tier limits config
- `src/services/subscription/subscription.service.ts` — Usage checking utilities

**Verification:** After pushing, run `npm run db:studio` to confirm tables exist.

---

*Delete this file once the migration is complete.*
