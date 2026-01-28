# LawMadeSimple - Development Plan

## Overview

**Project**: LawMadeSimple
**Description**: Web platform democratizing Nigerian law by translating legal jargon into plain language with AI-powered explanations
**Tech Stack**:
- Frontend: Next.js 14+, React 18, Tailwind CSS, shadcn/ui
- Backend: Next.js API Routes
- Database: Supabase (PostgreSQL) + Prisma ORM
- Auth: Supabase Auth (Google OAuth + Magic Links)
- AI: OpenAI GPT-4o + Vercel AI SDK
- Hosting: Vercel

**Progress**: 0/142 tasks (0%)

---

## Phase 1: Project Foundation

> **Goal**: Working development environment with CI/CD and first deployment

### 1.1 Repository & Environment
- [ ] Initialize Next.js 14+ project with TypeScript (App Router)
- [ ] Configure TypeScript strict mode
- [ ] Add .gitignore for Next.js
- [ ] Set up branch protection rules (main)
- [ ] Create project directory structure:
  ```
  src/
  ├── app/                # App Router pages
  ├── components/         # React components
  │   ├── ui/            # Base components (shadcn)
  │   └── features/      # Feature-specific
  ├── lib/               # Utilities, API client
  ├── services/          # Business logic
  ├── hooks/             # Custom React hooks
  ├── types/             # TypeScript types
  └── constants/         # Theme, config
  ```
- [ ] Configure path aliases (@/ imports)
- [ ] Set up environment variables template (.env.example)
- [ ] Create .env.local with Supabase + OpenAI keys

### 1.2 Development Tools
- [ ] Install and configure ESLint (strict, errors not warnings)
- [ ] Install and configure Prettier
- [ ] Set up pre-commit hooks (husky + lint-staged)
- [ ] Configure VS Code settings (.vscode/settings.json)
- [ ] Add npm scripts for common tasks (lint, typecheck, build)

### 1.3 CI/CD Pipeline
- [ ] **[P0]** Create GitHub Actions workflow for CI (lint, typecheck, build)
- [ ] **[P0]** Connect repository to Vercel
- [ ] **[P0]** Configure preview deployments on PR
- [ ] **[P0]** Configure production deployment on merge to main
- [ ] Set up environment variables in Vercel

### 1.4 First Deployment
- [ ] **[P0]** Create minimal homepage with "Coming Soon"
- [ ] **[P0]** Deploy to Vercel (first deployment milestone)
- [ ] Verify deployment works end-to-end
- [ ] Add health check API route (/api/health)

### 1.5 Documentation
- [ ] Update CLAUDE.md with development commands
- [ ] Document local development setup in README

**Phase 1 Gate**: ✅ App deployed, CI passing, dev environment working

---

## Phase 2: Database & Backend Foundation

> **Goal**: Database schema deployed, basic API structure ready

### 2.1 Supabase Setup
- [ ] **[P0]** Create Supabase project
- [ ] **[P0]** Get connection string and configure in .env
- [ ] **[P0]** Install Prisma ORM
- [ ] Create initial Prisma schema with all entities

### 2.2 Database Schema (from ERD)
- [ ] **[P0]** Define Law model
- [ ] **[P0]** Define Section model (with self-relation for sub-sections)
- [ ] **[P0]** Define Article model
- [ ] **[P0]** Define Scenario model
- [ ] **[P0]** Define ScenarioSection join table
- [ ] **[P0]** Define User model (synced with Supabase Auth)
- [ ] Define Bookmark model
- [ ] Define Explanation model (AI cache)
- [ ] Define Feedback model
- [ ] Define SearchLog model
- [ ] Define all enums (LawCategory, ContentType, FeedbackType)
- [ ] **[P0]** Run initial migration
- [ ] Set up database indexes for performance

### 2.3 Seed Data
- [ ] Create seed script structure
- [ ] Add Constitution of Nigeria (sample sections)
- [ ] Add sample scenarios (3-5 featured)
- [ ] Add script to npm run db:seed

### 2.4 API Foundation
- [ ] Set up API versioning (/api/v1/)
- [ ] Create standardized response format (success, error, pagination)
- [ ] Create global error handler
- [ ] Set up request validation with Zod
- [ ] Add request ID middleware for tracing
- [ ] **[P0]** Implement rate limiting middleware

### 2.5 Authentication Setup
- [ ] **[P0]** Install @supabase/supabase-js and @supabase/ssr
- [ ] **[P0]** Configure Supabase client (browser + server)
- [ ] **[P0]** Set up Google OAuth in Supabase dashboard
- [ ] **[P0]** Configure magic link email templates
- [ ] Create auth middleware for protected routes
- [ ] Implement user sync (Supabase Auth → users table)

**Phase 2 Gate**: ✅ Database deployed, migrations run, auth configured

---

## Phase 3: Core API Endpoints

> **Goal**: All CRUD APIs working, ready for frontend integration

### 3.1 Laws API (US-1.1, US-1.2, US-1.3)
- [ ] **[P0]** GET /api/v1/laws — List all laws
- [ ] **[P0]** GET /api/v1/laws/[slug] — Get law with sections
- [ ] **[P0]** GET /api/v1/laws/[lawSlug]/sections/[sectionSlug] — Get section detail
- [ ] Add query params for filtering (category, active)
- [ ] Include section count in law list response
- [ ] Include related scenarios in section response

### 3.2 Scenarios API (US-3.1, US-3.2)
- [ ] **[P0]** GET /api/v1/scenarios — List scenarios (with featured filter)
- [ ] **[P0]** GET /api/v1/scenarios/[slug] — Get scenario with related sections
- [ ] Add pagination support
- [ ] Increment view_count on detail view

### 3.3 Search API (US-4.1, US-4.2)
- [ ] **[P0]** GET /api/v1/search — Full-text search across laws, sections, scenarios
- [ ] GET /api/v1/search/suggestions — Autocomplete suggestions
- [ ] Implement PostgreSQL full-text search (tsvector)
- [ ] Add relevance scoring
- [ ] Support type filtering (law, section, scenario)
- [ ] Log searches to SearchLog table

### 3.4 Bookmarks API (US-6.1, US-6.2, US-6.3)
- [ ] **[P0]** GET /api/v1/bookmarks — List user bookmarks (auth required)
- [ ] **[P0]** POST /api/v1/bookmarks — Create bookmark (auth required)
- [ ] **[P0]** DELETE /api/v1/bookmarks/[id] — Remove bookmark (auth required)
- [ ] Include content details in list response
- [ ] Prevent duplicate bookmarks (unique constraint)

### 3.5 Feedback API (US-2.2)
- [ ] POST /api/v1/feedback — Submit feedback on explanation
- [ ] Support anonymous feedback
- [ ] Validate rating (1-5) and feedback type

**Phase 3 Gate**: ✅ All CRUD APIs working, tested with Postman/curl

---

## Phase 4: AI Integration

> **Goal**: AI explanations generating and caching properly

### 4.1 OpenAI Setup
- [ ] **[P0]** Install openai and ai (Vercel AI SDK)
- [ ] **[P0]** Configure OpenAI client with API key
- [ ] Create prompt templates for explanations
- [ ] Design prompt for plain language + examples

### 4.2 Explanation Generation
- [ ] **[P0]** POST /api/v1/explanations/stream — Generate with streaming
- [ ] Implement Server-Sent Events (SSE) for streaming
- [ ] Add disclaimer text injection
- [ ] Generate practical examples in response
- [ ] Track token usage

### 4.3 Explanation Caching
- [ ] **[P0]** GET /api/v1/explanations/[contentType]/[contentId] — Get cached
- [ ] Implement cache lookup by content + prompt hash
- [ ] Set 30-day expiration on cached explanations
- [ ] Support force regenerate option
- [ ] Return cache status in response (cached: true/false)

### 4.4 Rate Limiting for AI
- [ ] Implement stricter rate limits for AI endpoints
- [ ] Guest: 5 generations/minute
- [ ] Authenticated: 20 generations/minute
- [ ] Return appropriate headers (X-RateLimit-*)

**Phase 4 Gate**: ✅ AI explanations streaming, caching working

---

## Phase 5: Frontend Foundation

> **Goal**: Design system implemented, base components ready

### 5.1 Tailwind & Theme Setup
- [ ] **[P0]** Install Tailwind CSS 3.x
- [ ] **[P0]** Configure custom theme (colors, fonts, spacing)
- [ ] Add primary colors (Teal #1A5F7A scale)
- [ ] Add accent colors (Gold #F4B942 scale)
- [ ] Add semantic colors (success, warning, error, info)
- [ ] Configure custom font sizes (display, h1-h4, body variants)
- [ ] Configure shadows and border radius

### 5.2 Typography & Fonts
- [ ] **[P0]** Install Google Fonts (Lora, Inter)
- [ ] Configure next/font for optimization
- [ ] Create typography utility classes
- [ ] Test font loading and fallbacks

### 5.3 shadcn/ui Setup
- [ ] **[P0]** Initialize shadcn/ui with custom theme
- [ ] Install base components: Button, Input, Badge, Card
- [ ] Install utility components: Dialog, Toast, Skeleton
- [ ] Install navigation: Sheet (mobile menu), Dropdown
- [ ] Customize component styles to match design spec

### 5.4 Core UI Components (Atoms)
- [ ] **[P0]** Button (primary, secondary, ghost, accent, destructive variants)
- [ ] **[P0]** Input (default, search, error states)
- [ ] **[P0]** Badge (default, primary, accent, semantic variants)
- [ ] SearchInput (pill-shaped, with icon and clear)
- [ ] ScenarioPill (clickable category pills)
- [ ] Avatar (with fallback initials)
- [ ] Spinner (loading indicator)
- [ ] DisclaimerBadge (always-visible legal warning)

### 5.5 Molecule Components
- [ ] FormField (label + input + error message)
- [ ] **[P0]** SearchBar (input + suggestions dropdown)
- [ ] **[P0]** ScenarioCard (category card with icon)
- [ ] **[P0]** LawCard (search result / preview card)
- [ ] AccordionItem (collapsible content section)
- [ ] FeedbackWidget ("Was this helpful?" UI)
- [ ] Breadcrumb (navigation path)
- [ ] Pagination (page navigation)

### 5.6 Organism Components
- [ ] **[P0]** Header/Navbar (desktop layout)
- [ ] **[P0]** MobileMenu (drawer navigation)
- [ ] **[P0]** Footer (links + disclaimer)
- [ ] **[P0]** ExplanationCard (main content display)
- [ ] AuthModal (sign in modal/page content)
- [ ] Toast notification system
- [ ] EmptyState (no results/content)
- [ ] SkeletonLoader (loading placeholders)

**Phase 5 Gate**: ✅ All components built, Storybook optional but nice

---

## Phase 6: Frontend Pages

> **Goal**: All pages implemented, connected to APIs

### 6.1 Layout & Navigation
- [ ] **[P0]** Create RootLayout (providers, fonts, metadata)
- [ ] **[P0]** Create MainLayout (header + footer wrapper)
- [ ] Implement mobile-responsive header
- [ ] Implement mobile drawer menu
- [ ] Add skip-to-content link (accessibility)

### 6.2 Homepage (US-3.1)
- [ ] **[P0]** Build hero section with search
- [ ] **[P0]** Implement scenario pills row
- [ ] **[P0]** Build featured scenarios grid
- [ ] Connect to /api/v1/scenarios?featured=true
- [ ] Add loading skeletons

### 6.3 Scenario Results Page (US-3.2)
- [ ] **[P0]** Build /scenarios/[slug] page
- [ ] Display scenario header and description
- [ ] List related sections as LawCards
- [ ] Connect to /api/v1/scenarios/[slug]
- [ ] Add "Load More" pagination

### 6.4 Explanation Page (US-1.3, US-2.1, US-2.3)
- [ ] **[P0]** Build /explain/[lawSlug]/[sectionSlug] page
- [ ] Display ExplanationCard with accordions
- [ ] **[P0]** Implement streaming AI text display
- [ ] Show cached explanations instantly
- [ ] Add "Regenerate" option
- [ ] Implement feedback widget
- [ ] Add share and bookmark actions

### 6.5 Search Results Page (US-4.1)
- [ ] **[P0]** Build /search page
- [ ] Pre-fill search from query param
- [ ] Display results as LawCards
- [ ] Implement filter badges (by type, law)
- [ ] Connect to /api/v1/search
- [ ] Handle empty state

### 6.6 Law Browser (US-1.1, US-1.2)
- [ ] Build /laws page (law grid)
- [ ] Build /laws/[slug] page (sections list)
- [ ] Display laws as ScenarioCards (adapted)
- [ ] Show hierarchical sections with expand/collapse

### 6.7 Authentication Pages (US-5.1, US-5.2, US-5.3)
- [ ] **[P0]** Build /auth/signin page
- [ ] Implement Google OAuth button
- [ ] Implement magic link email form
- [ ] Handle OAuth callback
- [ ] Handle magic link confirmation
- [ ] Implement sign out functionality
- [ ] Add loading and error states

### 6.8 User Pages (US-6.2)
- [ ] Build /saved page (bookmarks list)
- [ ] Implement bookmark removal
- [ ] Handle empty state
- [ ] Redirect to sign in if unauthenticated

### 6.9 Error Pages
- [ ] Build 404 page with search
- [ ] Build error boundary component
- [ ] Add friendly error messages

**Phase 6 Gate**: ✅ All pages working, APIs integrated

---

## Phase 7: Integration & Polish

> **Goal**: Smooth UX, all features connected end-to-end

### 7.1 State Management
- [ ] Set up React Context for auth state
- [ ] Implement useAuth hook
- [ ] Add toast context for notifications

### 7.2 API Integration Polish
- [ ] Create typed API client wrapper
- [ ] Implement proper error handling
- [ ] Add retry logic for transient failures
- [ ] Handle rate limit responses gracefully

### 7.3 Bookmark Integration
- [ ] Add bookmark button to ExplanationCard
- [ ] Show filled/unfilled state based on user bookmarks
- [ ] Prompt sign in if unauthenticated
- [ ] Optimistic UI updates

### 7.4 Search Polish
- [ ] Implement search suggestions dropdown
- [ ] Add debounced typing (300ms)
- [ ] Show recent searches (local storage)
- [ ] Highlight matching text in results

### 7.5 Loading & Error States
- [ ] Add skeleton loaders to all pages
- [ ] Implement error boundaries
- [ ] Add retry buttons on failures
- [ ] Toast notifications for actions

### 7.6 Animations & Transitions
- [ ] Add page transition animations
- [ ] Implement accordion open/close animations
- [ ] Add button hover/active states
- [ ] Toast slide animations

### 7.7 Mobile Optimization
- [ ] Test all pages on mobile viewport
- [ ] Ensure touch targets are 44px+
- [ ] Verify horizontal scroll on pills
- [ ] Test mobile drawer menu

**Phase 7 Gate**: ✅ Polished UX, mobile-optimized

---

## Phase 8: Content & Data

> **Goal**: All 6 laws seeded with scenarios mapped

### 8.1 Law Content
- [ ] **[P0]** Seed Constitution of Nigeria (key rights sections)
- [ ] **[P0]** Seed Criminal Code Act (police interactions)
- [ ] Seed CAMA 2020 (business registration basics)
- [ ] Seed Labour Act (employment rights)
- [ ] Seed Lagos Tenancy Law 2011
- [ ] Seed FIRS Act (tax basics)
- [ ] **[P0]** Seed Copyright Act 2022 (IP for creatives)
- [ ] Seed Trademarks Act (brand protection basics)
- [ ] Seed Patents & Designs Act (invention protection basics)

### 8.2 Scenario Mapping
- [ ] **[P0]** Create 50+ core scenarios (including 8-10 IP scenarios for creatives)
- [ ] Map scenarios to relevant sections
- [ ] Write relevance notes for each mapping
- [ ] Mark 8-10 scenarios as featured (include IP scenarios)
- [ ] Organize by category (including intellectual_property)

### 8.3 IP Scenarios for Young Creatives
- [ ] "Someone reposted my content without credit"
- [ ] "How do I copyright my music/video?"
- [ ] "Can I use trending sounds in my content?"
- [ ] "Do I own content I post on social media?"
- [ ] "How do I license my artwork to a brand?"
- [ ] "Someone is using my logo/brand name"
- [ ] "How do I protect my podcast/channel name?"
- [ ] "Can I remix someone else's song legally?"

**Phase 8 Gate**: ✅ 7 core laws (Constitution, Criminal, CAMA, Labour, Tenancy, Tax, Copyright) + 2 supplementary IP laws, 50+ scenarios ready

---

## Phase 9: Testing & Quality

> **Goal**: Core flows tested, accessibility verified

### 9.1 Unit Tests
- [ ] Set up Jest / Vitest
- [ ] Test API route handlers
- [ ] Test utility functions
- [ ] Test Prisma services

### 9.2 Integration Tests
- [ ] Test auth flows
- [ ] Test bookmark CRUD
- [ ] Test search functionality

### 9.3 E2E Tests (Optional but recommended)
- [ ] Set up Playwright
- [ ] Test homepage → scenario → explanation flow
- [ ] Test search flow
- [ ] Test auth flow

### 9.4 Accessibility Audit
- [ ] Run axe accessibility checks
- [ ] Verify color contrast ratios
- [ ] Test keyboard navigation
- [ ] Test with screen reader

### 9.5 Performance Audit
- [ ] Run Lighthouse audit
- [ ] Verify Core Web Vitals targets:
  - [ ] LCP < 2.5s
  - [ ] FCP < 1.5s
  - [ ] CLS < 0.1
- [ ] Optimize images (next/image)
- [ ] Verify API response times

**Phase 9 Gate**: ✅ Tests passing, accessibility verified

---

## Phase 10: Security & Compliance

> **Goal**: Secure, NDPR-compliant platform

### 10.1 Security Hardening
- [ ] Audit all API endpoints for auth requirements
- [ ] Verify rate limiting is enforced
- [ ] Add security headers (via next.config.js or middleware)
- [ ] Implement CSRF protection
- [ ] Validate all user inputs
- [ ] Scan dependencies for vulnerabilities (npm audit)

### 10.2 NDPR Compliance
- [ ] Add cookie consent banner (if tracking)
- [ ] Create Privacy Policy page
- [ ] Create Terms of Service page
- [ ] Implement data export functionality
- [ ] Document data retention policies

### 10.3 Legal Disclaimer
- [ ] Ensure disclaimer appears on ALL explanation pages
- [ ] Add disclaimer to footer
- [ ] Include in API responses

**Phase 10 Gate**: ✅ Security reviewed, compliance ready

---

## Phase 11: Documentation

> **Goal**: Developer and user documentation complete

### 11.1 API Documentation
- [ ] Document all endpoints in README or separate doc
- [ ] Include request/response examples
- [ ] Document error codes

### 11.2 Developer Documentation
- [ ] Update README with full setup guide
- [ ] Document environment variables
- [ ] Document deployment process

### 11.3 Static Pages
- [ ] Build /about page
- [ ] Build /privacy page
- [ ] Build /terms page

**Phase 11 Gate**: ✅ Docs complete

---

## Phase 12: Launch Preparation

> **Goal**: Production-ready, monitoring enabled

### 12.1 Monitoring Setup
- [ ] Set up Sentry for error tracking
- [ ] Configure Vercel Analytics
- [ ] Set up uptime monitoring (optional: Better Uptime)

### 12.2 Production Configuration
- [ ] Configure custom domain (if available)
- [ ] Set up SSL (automatic via Vercel)
- [ ] Configure database connection pooling
- [ ] Set production environment variables

### 12.3 Launch Checklist
- [ ] Full test of all user flows
- [ ] Verify all 6 laws accessible
- [ ] Verify all 50 scenarios working
- [ ] Test on multiple devices/browsers
- [ ] Backup database
- [ ] Document rollback procedure

### 12.4 PWA Setup
- [ ] Add web manifest
- [ ] Configure service worker (basic caching)
- [ ] Add app icons
- [ ] Test install prompt

**Phase 12 Gate**: ✅ Ready to launch

---

## Milestone Summary

| Milestone | Key Deliverable | Dependencies |
|-----------|-----------------|--------------|
| M1: Foundation | First deployment live | None |
| M2: Backend Ready | Database + APIs working | M1 |
| M3: AI Working | Streaming explanations | M2 |
| M4: Frontend Foundation | Design system + components | M1 |
| M5: MVP Functional | All pages connected | M2, M3, M4 |
| M6: Content Ready | 6 laws, 50 scenarios | M5 |
| M7: Launch Ready | Tested, secure, documented | M6 |

---

## Quick Reference

### Git Workflow
```bash
# Feature development
git checkout main
git pull origin main
git checkout -b feature/[feature-name]
# ... make changes ...
git add .
git commit -m "feat: description"
git push origin feature/[feature-name]
# Create PR to main
```

### Common Commands
```bash
# Development
npm run dev          # Start dev server (port 3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Lint code
npm run typecheck    # TypeScript check

# Database
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema to database
npx prisma migrate dev # Create migration
npx prisma studio    # Open database GUI
npm run db:seed      # Seed database (custom script)
```

### Key Decisions Reference

| Decision | Choice | Doc Reference |
|----------|--------|---------------|
| Architecture | Serverless monolith | 12-system-architecture-document.md |
| Database | PostgreSQL + Prisma | 14-technology-stack-decision.md |
| Auth | Supabase Auth | 14-technology-stack-decision.md |
| AI | OpenAI GPT-4o + Vercel AI SDK | 14-technology-stack-decision.md |
| Design System | Warm Trust (Teal + Gold) | 21-frontend-design-spec.md |
| Components | shadcn/ui | 21-frontend-design-spec.md |

---

## Priority Legend

- **[P0]** = Critical path, must complete for MVP
- **[P1]** = Important, should be in MVP
- **[P2]** = Nice to have, can defer

---

*Generated: January 27, 2026*
*Total Tasks: 142 | Completed: 0 | Progress: 0%*
