# LawMadeSimple

Democratizing Nigerian law by translating legal jargon into plain, easy-to-understand language with practical examples.

## Quick Context

- **Target Users:** Common Nigerians + SMEs + Young Creatives
- **Platform:** Next.js web app with PWA
- **AI Approach:** AI-only with disclaimers (hybrid when budget allows)
- **Business Model:** Freemium
- **Developer:** Solo developer
- **Companion Product:** NigerianLawsAPI (B2B API, built alongside)

## Dual Product Strategy

LawMadeSimple has a **companion B2B product**: **NigerianLawsAPI**

```
LawMadeSimple (B2C)          NigerianLawsAPI (B2B)
─────────────────────        ─────────────────────
Consumer app                 Developer API
"Understand Nigerian Law"    "Build with Nigerian Law"
Scenarios + Explanations     Raw law data only
                    ↓
            Same Database
            Same Law Content
            Built Together
```

### Scope Separation

| NigerianLawsAPI Includes | NigerianLawsAPI Excludes (LawMadeSimple IP) |
|--------------------------|---------------------------------------------|
| Laws, Sections, Articles | Scenarios |
| Amendments, Citations    | Scenario-to-Section mappings |
| Source metadata          | AI Explanations |
| Search/filtering         | User data |

**Primary focus remains LawMadeSimple.** NigerianLawsAPI is built as a byproduct of the same data work.

See `docs/nigerian-laws-api-plan.md` for full strategy.

## Tech Stack

- **Frontend:** Next.js 14+, React 18, Tailwind CSS 4, shadcn/ui
- **Backend:** Next.js API Routes
- **Database:** Supabase (PostgreSQL) + Prisma ORM
- **Cache/Rate Limiting:** Upstash Redis
- **Auth:** Supabase Auth (OAuth + magic links)
- **AI:** OpenAI API (GPT-4o-mini) + Vercel AI SDK
- **Hosting:** Vercel

## Project Structure

```
src/
├── app/                # App Router pages & API routes
├── components/         # React components
│   ├── ui/            # Base components (shadcn)
│   └── features/      # Feature-specific
├── lib/               # Utilities, API client
├── services/          # Business logic
├── hooks/             # Custom React hooks
├── types/             # TypeScript types
└── constants/         # Theme, config

docs/
├── pre-dev/           # Architecture docs (12-20)
├── design/            # UI/UX design specs
└── *.md               # Research docs
```

## Commands

```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Lint code (errors, no warnings)
npm run lint:fix     # Auto-fix lint issues
npm run typecheck    # TypeScript check
npm run format       # Format with Prettier
npm run format:check # Check formatting

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # Seed sample data
npm run db:studio    # Open Prisma Studio (GUI)
```

## Development Guidelines

- Quality over speed
- Strong disclaimers required on all legal content
- Mobile-responsive design mandatory
- Accessibility (WCAG compliance)
- NDPR compliance for data handling
- TypeScript strict mode enforced
- ESLint as errors (not warnings)

---

## Current Phase

**Phase 7: Integration & Polish** — Up Next

### Progress (aligned with plan.md)
- ✅ Phase 1: Project Foundation — Complete
- ✅ Phase 2: Database & Backend — Complete
- ✅ Phase 3: Core API Endpoints — Complete (13 API routes)
- ✅ Phase 4: AI Integration — Complete
- ✅ Phase 5: Frontend Foundation — Complete (design system + components)
- ✅ **Phase 6: Frontend Pages — Complete** (all pages built)
- ⚠️ Phase 7: Integration & Polish — Partial (auth state done)
- ⏳ Phase 8: Content & Data — Pending
- ⏳ Phase 9-12: Testing, Security, Docs, Launch — Pending

### Phase 6 Summary (Completed Jan 29, 2026)

**All frontend pages built:**

| Page | Route | Description |
|------|-------|-------------|
| Homepage | `/` | Hero, search bar, scenario pills, topic cards |
| Scenarios Index | `/scenarios` | Lists all 8 scenario categories |
| Scenario Detail | `/scenarios/[slug]` | Scenario info + related law sections |
| Search Results | `/search?q=...` | Full-text search with type filters |
| Laws Browser | `/laws` | Laws grouped by category |
| Law Detail | `/laws/[lawSlug]` | Law info + sections list |
| Explanation | `/explain/[lawSlug]/[sectionSlug]` | AI explanations with accordions |
| Saved Items | `/saved` | User bookmarks (auth required) |
| Auth Pages | `/sign-in`, `/sign-up`, etc. | Authentication flows |

**New component created:**
- `src/components/ui/breadcrumb.tsx` — Navigation path indicator

**Phase 6 files:**
- `src/app/scenarios/page.tsx` — Scenarios index
- `src/app/scenarios/[slug]/page.tsx` — Scenario detail
- `src/app/search/page.tsx` — Search results
- `src/app/laws/page.tsx` — Laws browser
- `src/app/laws/[lawSlug]/page.tsx` — Law detail
- `src/app/explain/[lawSlug]/[sectionSlug]/page.tsx` — Explanation page
- `src/app/(protected)/saved/page.tsx` — Saved items

### Known Limitations (Address When Scaling)

| Issue | Impact | When to Fix |
|-------|--------|-------------|
| Race condition on explanation cache | Concurrent requests for same uncached content = duplicate AI calls | When traffic increases; add "generation in progress" flag or distributed lock |
| No data seeded | Pages show "Coming Soon" placeholders | Phase 8: seed law content |
| Supabase built-in email limit | 2 emails/hour max (confirmations, magic links, password resets) | Before production launch: set up custom SMTP (Resend, SendGrid, or Postmark) |

### Next Session: Pending Tasks

**Completed (Jan 30, 2026):**
- [x] ~~Change post-login redirect from `/dashboard` to `/` (homepage)~~ ✅
- [x] ~~Set up Facebook OAuth~~ ✅
- [x] ~~Auth security audit and fixes~~ ✅ (reset password validation, soft delete, sync failure handling)

**Phase 7 - Integration & Polish:**
- [ ] Polish API integration (typed client wrapper, error handling)
- [ ] Search suggestions with debouncing
- [ ] Loading/error states polish
- [ ] Mobile optimization testing
- [ ] Page transition animations

**Phase 8 - Content & Data:**
- [ ] Seed 9 MVP laws (Constitution, Criminal Code, CAMA, Labour Act, etc.)
- [ ] Create scenarios and map to sections
- [ ] Generate initial AI explanations for key sections

**Future: Build Proper Dashboard**
When user data exists, build `/dashboard` with:
- Recent views / search history
- Saved items summary
- Personalized scenario recommendations
- Usage stats (explanations remaining)
- Premium upsell for free users

Reference `plan.md` for full task lists.

---

## MVP Content Plan

### Law Categories (LawCategory enum)

```prisma
enum LawCategory {
  constitution
  criminal
  business
  labour
  property
  tax
  intellectual_property  // Added Jan 28, 2026
}
```

### MVP Laws (9 total)

| Law | Category | Source | Status |
|-----|----------|--------|--------|
| Constitution 1999 (updated) | constitution | [PLAC](https://placng.org/i/wp-content/uploads/2023/11/Constitution-of-the-Federal-Republic-of-Nigeria-1999-Updated.pdf) | Ready |
| Criminal Code Act | criminal | PLAC | Ready |
| CAMA 2020 | business | [ICNL](https://www.icnl.org/resources/library/companies-and-allied-matters-act-2020) | Ready |
| Labour Act | labour | [PLAC](https://lawsofnigeria.placng.org/laws/L1.pdf) | Ready |
| Lagos Tenancy Law 2011 | property | [Lagos MOJ](http://lagosministryofjustice.org/wp-content/uploads/2022/01/Tenancy-Law-2011.pdf) | Ready |
| FIRS Act | tax | [PLAC](https://www.placng.org/lawsofnigeria/laws/F36.pdf) | Ready |
| **Copyright Act 2022** | intellectual_property | [PLAC](https://placng.org/i/wp-content/uploads/2023/04/Copyright-Act-2022.pdf) | Ready |
| Trademarks Act (Cap T13) | intellectual_property | [PLAC](https://placng.org/lawsofnigeria/laws/TRADE%20MARKS%20ACT.pdf) | Ready |
| Patents & Designs Act (Cap P2) | intellectual_property | [PLAC](http://lawsofnigeria.placng.org/laws/P2.pdf) | Ready |

**Full source research:** `docs/law-sources-research.md`

### Target Personas

1. **Adaeze** (Tenant) — Tenancy rights
2. **Chukwuemeka** (SME Owner) — Business compliance
3. **Tunde** (Employee) — Labour rights
4. **Ngozi** (Citizen) — Constitutional rights
5. **Kelechi** (Content Creator) — IP/Copyright protection

---

## Key Infrastructure

### Authentication
- **Providers:** Apple OAuth ✅, Google OAuth ✅, Facebook OAuth ✅, Email/Password ✅, Magic Link ✅, OTP (6-digit code) ✅
- **Auto-rotation:** Apple client secret rotates monthly via GitHub Actions
- **Routes:** `/sign-in`, `/sign-up`, `/forgot-password`, `/reset-password`, `/dashboard`
- **Production URL:** `https://law-made-simple.vercel.app`
- **Security Features:**
  - Server-validated sessions (`getUser()` not `getSession()`)
  - Reset password link expiry validation
  - Soft delete for account deletion (blocks re-login)
  - User sync failure handling (prevents inconsistent state)
  - Open redirect prevention on all callbacks

### Subscription & Usage (Freemium)
- **Models:** `Subscription`, `UsageRecord`, `GuestUsage` ✅
- **Tiers:** guest (anonymous), free (signed in), premium
- **Guest limits:** 3 explanations/day, 10 searches/day (IP-based, hashed for privacy)
- **Free limits:** 5 explanations/day, 50/month, 20 searches/day
- **Premium:** Unlimited
- **Rate limiting:** Upstash Redis (serverless-compatible)
- **Service:** `src/services/subscription/subscription.service.ts`
- **Config:** `src/constants/subscription.ts`

### API Endpoints (13 total)

| Endpoint | Methods | Auth |
|----------|---------|------|
| `/api/v1/laws` | GET | Optional |
| `/api/v1/laws/[lawSlug]` | GET | Optional |
| `/api/v1/laws/[lawSlug]/sections/[sectionSlug]` | GET | Optional |
| `/api/v1/scenarios` | GET | Optional |
| `/api/v1/scenarios/[slug]` | GET | Optional |
| `/api/v1/search` | GET | Optional |
| `/api/v1/search/suggestions` | GET | Optional |
| `/api/v1/bookmarks` | GET, POST | Required |
| `/api/v1/bookmarks/[id]` | DELETE | Required |
| `/api/v1/feedback` | POST | Optional |
| `/api/v1/explanations/stream` | POST | Optional (rate limited) |
| `/api/v1/explanations/[contentType]/[contentId]` | GET | Optional |

### Design System
- **Colors:** Warm Trust (Teal #1A5F7A + Gold #F4B942)
- **Fonts:** Lora (headings) + Inter (body)
- **Mode:** Light only for MVP

### Database Connection
- **Type:** Session Pooler (IPv4 compatible)
- **Host:** `aws-1-us-east-1.pooler.supabase.com:5432`
- **Note:** Direct connection deprecated on Supabase free tier (IPv6-only)

---

## Key Documentation

| Document | Purpose |
|----------|---------|
| `prd.md` | Product Requirements Document |
| `plan.md` | Development plan (source of truth for phases) |
| `docs/nigerian-laws-api-plan.md` | NigerianLawsAPI B2B strategy |
| `docs/law-sources-research.md` | Law source evaluation & download links |
| `docs/pre-dev/18-api-specifications.md` | API endpoint specs |
| `prisma/schema.prisma` | Database schema (13 models) |

---

## Schema Enhancements (Planned for Phase 8)

New fields for `Law` model:
- `officialCitation`, `jurisdiction`, `status`, `version`
- `sourceId`, `sourceFetchedAt`, `sourceVerifiedAt`
- `gazetteNumber`, `gazetteDate`, `commencementDate`

New models:
- `LawSource` — Track where data comes from
- `Amendment` — Track law amendments
- `ApiKey`, `ApiUsage` — For NigerianLawsAPI (post-MVP)

**Recently Added (Jan 30, 2026):**
- `User.deletedAt` — Soft delete timestamp (blocks login when set)

---

*Last updated: January 30, 2026 (Auth security fixes: soft delete, session validation, sync failure handling)*
