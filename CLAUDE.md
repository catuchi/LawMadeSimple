# LawMadeSimple

Democratizing Nigerian law by translating legal jargon into plain, easy-to-understand language with practical examples.

## Quick Context

- **Target Users:** Common Nigerians + SMEs
- **Platform:** Next.js web app with PWA
- **AI Approach:** AI-only with disclaimers (hybrid when budget allows)
- **Business Model:** Freemium
- **Developer:** Solo developer

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
- ⏳ Phase 8: Content & Data — Pending (seed 6 laws, 50 scenarios)
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

## Session Notes (Jan 28, 2026)

### Completed This Session
1. Comprehensive codebase review — compared all layers against PRD requirements
2. Aligned CLAUDE.md phase numbering with plan.md (was incorrectly at "Phase 8", now correctly at "Phase 3")
3. Ran `npm run db:push` — applied Subscription & UsageRecord models
4. Switched DATABASE_URL from direct connection to session pooler (Supabase IPv4 change)
5. Verified local dev environment working

### Phase 3 Completed (Core API Endpoints)
All 11 API routes implemented:
- Laws API: `GET /api/v1/laws`, `GET /api/v1/laws/[slug]`, `GET /api/v1/laws/[lawSlug]/sections/[sectionSlug]`
- Scenarios API: `GET /api/v1/scenarios`, `GET /api/v1/scenarios/[slug]`
- Search API: `GET /api/v1/search`, `GET /api/v1/search/suggestions`
- Bookmarks API: `GET/POST/DELETE /api/v1/bookmarks`
- Feedback API: `POST /api/v1/feedback`

### Action Items for Next Session
1. **Start Phase 4:** AI Integration (see `plan.md` section 4.1-4.4)
   - Install OpenAI SDK and Vercel AI SDK
   - Create prompt templates for plain-language explanations
   - Implement `POST /api/v1/explanations/stream` with SSE
   - Implement `GET /api/v1/explanations/[contentType]/[contentId]` for cached explanations
   - Add rate limiting for AI endpoints

### Reference Docs for Phase 4
- `docs/pre-dev/18-api-specifications.md` — Explanation API specs
- `plan.md` — Task checklist (sections 4.1-4.4)
- `prisma/schema.prisma` — Explanation model
