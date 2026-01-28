# LawMadeSimple

Democratizing Nigerian law by translating legal jargon into plain, easy-to-understand language with practical examples.

## Quick Context

- **Target Users:** Common Nigerians + SMEs
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
- **Auth:** Supabase Auth (OAuth + magic links)
- **AI:** OpenAI API (GPT-4o/mini) + Vercel AI SDK
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

## Current Phase

**Phase 4: AI Integration** — Up Next

### Progress (aligned with plan.md)
- ✅ Phase 1: Project Foundation — Complete (Next.js, CI/CD, Vercel deployment)
- ✅ Phase 2: Database & Backend — Complete (Prisma schema, Supabase Auth)
- ✅ Phase 3: Core API Endpoints — Complete (11 API routes)
- 🔄 **Phase 4: AI Integration — Up Next** (OpenAI, streaming explanations)
- ⚠️ Phase 5: Frontend Foundation — Partial (auth components done, shadcn/ui setup needed)
- ⚠️ Phase 6: Frontend Pages — Partial (auth pages done, feature pages needed)
- ⚠️ Phase 7: Integration & Polish — Partial (auth state done)
- ⏳ Phase 8: Content & Data — Pending (seed 7 core laws + 2 IP laws, 50+ scenarios)
- ⏳ Phase 9-12: Testing, Security, Docs, Launch — Pending

### Key Files
- `prd.md` — Product Requirements Document
- `plan.md` — Development plan (142 tasks) ← **Source of truth for phases**
- `prisma/schema.prisma` — Database schema (12 models)
- `docs/pre-dev/18-api-specifications.md` — API endpoint specs

### Authentication
- **Providers:** Apple OAuth, Google OAuth (pending), Facebook OAuth (pending), Email/Password, Magic Link
- **Auto-rotation:** Apple client secret rotates monthly via GitHub Actions
- **Routes:** `/sign-in`, `/sign-up`, `/forgot-password`, `/reset-password`, `/dashboard`

### Subscription & Usage (Freemium)
- **Models:** `Subscription`, `UsageRecord` ✅ (applied to database)
- **Tiers:** free, premium
- **Free limits:** 5 explanations/day, 50/month, 20 searches/day
- **Service:** `src/services/subscription/subscription.service.ts`
- **Config:** `src/constants/subscription.ts`

### Design System
- **Colors:** Warm Trust (Teal #1A5F7A + Gold #F4B942)
- **Fonts:** Lora (headings) + Inter (body)
- **Mode:** Light only for MVP

### Database Connection
- **Type:** Session Pooler (IPv4 compatible)
- **Host:** `aws-1-us-east-1.pooler.supabase.com:5432`
- **Note:** Direct connection deprecated on Supabase free tier (IPv6-only)

---

## Session Notes (Jan 28, 2026) - Law Sources & NigerianLawsAPI Planning

### Completed This Session

1. **Law Sources Research** — Complete
   - Evaluated 6+ sources for Nigerian law content
   - Identified PLAC as primary source for 5/6 MVP laws
   - Documented direct download links for all 6 laws
   - Created `docs/law-sources-research.md`

2. **NigerianLawsAPI Strategic Planning** — Complete
   - Defined dual product strategy (B2C + B2B)
   - Established scope separation (API = raw laws only, no scenarios)
   - Designed freemium business model (₦0 - ₦25,000/mo tiers)
   - Planned schema enhancements for API readiness
   - Created `docs/nigerian-laws-api-plan.md`

3. **Content Acquisition Decisions**
   - Primary source: PLAC (placng.org)
   - CAMA 2020: ICNL (not PLAC's old version)
   - Lagos Tenancy Law: Lagos Ministry of Justice
   - Defined content ingestion workflow

### Law Sources Summary

| Law | Source | Status |
|-----|--------|--------|
| Constitution 1999 (updated) | PLAC | Ready to download |
| Labour Act | PLAC | Ready to download |
| CAMA 2020 | ICNL | Ready to download |
| Police Act 2020 | PLAC | Ready to download |
| Tax Acts (FIRS, CITA) | PLAC | Ready to download |
| Lagos Tenancy Law 2011 | Lagos MOJ | Ready to download |

### Schema Enhancements Planned (for Phase 8)

New fields for `Law` model:
- `officialCitation`, `jurisdiction`, `status`, `version`
- `sourceId`, `sourceFetchedAt`, `sourceVerifiedAt`
- `gazetteNumber`, `gazetteDate`, `commencementDate`

New models:
- `LawSource` — Track where data comes from
- `Amendment` — Track law amendments
- `ApiKey`, `ApiUsage` — For future API (post-MVP)

### Action Items for Next Session

1. **Continue Phase 4:** AI Integration (current priority)
   - Install OpenAI SDK and Vercel AI SDK
   - Create prompt templates for plain-language explanations
   - Implement streaming explanation endpoint

2. **When reaching Phase 8:** Content & Data
   - Apply schema enhancements (LawSource, enhanced Law fields)
   - Download and structure 6 MVP laws from identified sources
   - Build content ingestion workflow

### Key Documentation Created

| Document | Purpose |
|----------|---------|
| `docs/nigerian-laws-api-plan.md` | Full NigerianLawsAPI strategy |
| `docs/law-sources-research.md` | Law source evaluation & download links |

### Reference Docs for Phase 4
- `docs/pre-dev/18-api-specifications.md` — Explanation API specs
- `plan.md` — Task checklist (sections 4.1-4.4)
- `prisma/schema.prisma` — Explanation model

---

## Session Notes (Jan 28, 2026) - Intellectual Property Law Addition

### Completed This Session

1. **Added Intellectual Property (IP) Law to MVP** — Complete
   - Target audience: Young Nigerian creatives (content creators, musicians, streamers, designers)
   - Added `intellectual_property` to `LawCategory` enum in Prisma schema
   - Updated Zod validation schemas in `src/lib/api/validation.ts`
   - Pushed schema changes to database

2. **IP Law Sources Research** — Complete
   - Copyright Act 2022: [PLAC PDF](https://placng.org/i/wp-content/uploads/2023/04/Copyright-Act-2022.pdf)
   - Trademarks Act (Cap T13): [PLAC PDF](https://placng.org/lawsofnigeria/laws/TRADE%20MARKS%20ACT.pdf)
   - Patents & Designs Act (Cap P2): [PLAC PDF](http://lawsofnigeria.placng.org/laws/P2.pdf)

3. **Documentation Updates** — Complete
   - Updated `docs/law-sources-research.md` with IP law section
   - Updated `plan.md` Phase 8 tasks (added IP law seeding, IP scenarios)
   - Updated `prd.md` (new persona "Kelechi the Creator", updated law count)
   - Updated content goals: 7 core laws + 2 supplementary IP laws

### IP Law Coverage (MVP)

| Law | Category | Target Audience |
|-----|----------|-----------------|
| **Copyright Act 2022** | intellectual_property | Musicians, YouTubers, writers, artists |
| Trademarks Act (Cap T13) | intellectual_property | Brand owners, channel creators |
| Patents & Designs Act (Cap P2) | intellectual_property | Inventors, product designers |

### IP Scenarios Planned

- "Someone reposted my content without credit"
- "How do I copyright my music/video?"
- "Can I use trending sounds in my content?"
- "Do I own content I post on social media?"
- "How do I license my artwork to a brand?"
- "Someone is using my logo/brand name"
- "How do I protect my podcast/channel name?"
- "Can I remix someone else's song legally?"

### Files Modified

| File | Change |
|------|--------|
| `prisma/schema.prisma` | Added `intellectual_property` to `LawCategory` enum |
| `src/lib/api/validation.ts` | Added `intellectual_property` to 2 Zod schemas |
| `docs/law-sources-research.md` | Added Section 10: IP Laws |
| `plan.md` | Added IP law tasks to Phase 8 |
| `prd.md` | Added Persona 5, updated content goals |

### Why IP Law for MVP?

1. **Target Audience Fit**: Young Nigerians (creators) are exactly the demographic LawMadeSimple targets
2. **Recent Legislation**: Copyright Act 2022 is new (commenced March 2023), highly relevant
3. **Differentiation**: Most legal platforms don't focus on creator-friendly IP content
4. **Dual Product Benefit**: IP laws also serve NigerianLawsAPI customers (legal tech builders)
