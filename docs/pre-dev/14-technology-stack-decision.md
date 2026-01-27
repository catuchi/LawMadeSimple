# Technology Stack Decision

> Documented technology choices with rationale and trade-offs for LawMadeSimple.

---

## Stack Overview

| Layer | Technology | Version | Justification |
|-------|------------|---------|---------------|
| **Frontend Framework** | Next.js | 14+ | App Router, SSR/SSG, excellent DX |
| **UI Library** | React | 18+ | Component model, ecosystem, hiring |
| **Styling** | Tailwind CSS | 3.4+ | Utility-first, design tokens, purging |
| **UI Components** | shadcn/ui | Latest | Copyable components, full control |
| **Backend Framework** | Next.js API Routes | 14+ | Co-located, serverless, TypeScript |
| **API Style** | REST | N/A | Simplicity, caching, tooling |
| **Database** | PostgreSQL | 15+ | Relational, full-text search, proven |
| **Database Hosting** | Supabase | N/A | Managed, RLS, generous free tier |
| **ORM** | Prisma | 5+ | Type-safe, migrations, great DX |
| **Cache** | PostgreSQL (table) | N/A | Sufficient for MVP, no extra service |
| **Authentication** | Supabase Auth | N/A | Integrated, OAuth, magic links |
| **AI Provider** | OpenAI | GPT-4o | Best quality for instruction following |
| **AI SDK** | Vercel AI SDK | 3+ | Streaming, provider switching |
| **Cloud Platform** | Vercel | N/A | Next.js native, auto-scaling, DX |
| **Email** | Resend | N/A | Modern API, React Email |
| **Monitoring** | Sentry | N/A | Error tracking, performance |
| **Analytics** | Plausible/Umami | N/A | Privacy-friendly, NDPR compliant |
| **CI/CD** | GitHub Actions + Vercel | N/A | Automated, preview deploys |

---

## Decision Records (ADRs)

### ADR-001: Next.js as Full-Stack Framework

**Status:** Accepted

**Context:**
We need a framework that supports both server-side rendering (for SEO on law pages) and dynamic client interactions (for AI explanations). Solo developer needs minimal infrastructure complexity.

**Options Evaluated:**

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Next.js** | SSR/SSG, API routes, Vercel integration, large community | Vendor lock-in (soft), learning curve for App Router | 9/10 |
| Remix | Great DX, progressive enhancement | Smaller community, less ecosystem | 7/10 |
| SvelteKit | Fast, small bundles | Smaller talent pool, less mature | 6/10 |
| Separate FE/BE | Flexibility, microservices ready | More complexity, two deployments | 4/10 |

**Decision:** Next.js 14+ with App Router

**Consequences:**
- (+) Single codebase, single deployment
- (+) Native Vercel deployment with zero config
- (+) Excellent TypeScript support
- (-) Soft lock-in to Vercel ecosystem
- (-) Learning curve for new App Router patterns

---

### ADR-002: PostgreSQL over MongoDB

**Status:** Accepted

**Context:**
We need a database for structured legal content (laws, sections, articles) and user data (bookmarks, feedback). Legal data has clear relationships.

**Options Evaluated:**

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **PostgreSQL** | ACID, relational, full-text search, proven | More rigid schema | 9/10 |
| MongoDB | Flexible schema, JSON native | Weaker consistency, no joins | 5/10 |
| MySQL | Familiar, widely used | Less advanced features than Postgres | 7/10 |
| Firebase Firestore | Real-time, easy setup | Vendor lock-in, limited queries | 4/10 |

**Decision:** PostgreSQL via Supabase

**Consequences:**
- (+) Strong relational model for laws → sections → articles
- (+) Built-in full-text search for MVP
- (+) ACID compliance for user data integrity
- (+) Prisma provides excellent type safety
- (-) Schema changes require migrations

---

### ADR-003: Supabase over Firebase

**Status:** Accepted

**Context:**
We need managed database hosting with authentication. Budget is limited (solo developer), so generous free tier matters.

**Options Evaluated:**

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Supabase** | PostgreSQL, RLS, open source, generous free tier | Newer, smaller community | 9/10 |
| Firebase | Mature, real-time, Google backing | Proprietary, limited query flexibility | 6/10 |
| PlanetScale | MySQL, branching, serverless | More expensive, MySQL limitations | 6/10 |
| AWS RDS | Full control | Complex setup, no auth integration | 4/10 |

**Decision:** Supabase (PostgreSQL + Auth + Storage)

**Consequences:**
- (+) Integrated auth with OAuth and magic links
- (+) Row Level Security for data access control
- (+) Free tier supports MVP (500MB DB, 50K MAU auth)
- (+) Can use standard Postgres tooling
- (-) Fewer community resources than Firebase

---

### ADR-004: OpenAI as Primary AI Provider

**Status:** Accepted

**Context:**
Core feature is AI-generated law explanations. Need reliable, high-quality text generation that follows instructions well. Nigerian legal context is niche.

**Options Evaluated:**

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **OpenAI (GPT-4o)** | Best instruction following, reliable API | Cost, US-centric training | 9/10 |
| Anthropic (Claude) | Good safety, long context | Smaller API ecosystem | 8/10 |
| Google (Gemini) | Competitive pricing, multimodal | Less mature API | 6/10 |
| Local LLM | Privacy, no API cost | Requires infrastructure, lower quality | 3/10 |

**Decision:** OpenAI as primary, Claude as backup

**Consequences:**
- (+) Highest quality explanations
- (+) Established, reliable API
- (+) Vercel AI SDK makes switching easy
- (-) API costs (~$0.01-0.03 per explanation)
- (-) Dependent on external service

---

### ADR-005: Serverless over Containers

**Status:** Accepted

**Context:**
Solo developer, variable traffic (spiky when content goes viral), need to minimize operational overhead.

**Options Evaluated:**

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Serverless (Vercel)** | Zero ops, auto-scaling, pay-per-use | Cold starts, execution limits | 9/10 |
| Containers (Railway) | More control, longer timeouts | Requires some ops, fixed cost | 6/10 |
| VPS (DigitalOcean) | Full control, cheap | Manual scaling, maintenance | 4/10 |
| Kubernetes | Maximum flexibility | Overkill for MVP, complex | 2/10 |

**Decision:** Vercel serverless functions

**Consequences:**
- (+) Zero server management
- (+) Automatic scaling to zero (saves money)
- (+) Preview deployments for testing
- (-) 10s default timeout (30s Pro) limits AI response time
- (-) Cold starts add latency (mitigated by Vercel)

---

### ADR-006: Tailwind CSS over CSS-in-JS

**Status:** Accepted

**Context:**
Need styling solution that enables rapid development, works with component library, and produces small bundles.

**Options Evaluated:**

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Tailwind CSS** | Utility-first, purging, design tokens | Verbose classnames | 9/10 |
| styled-components | Co-located styles, dynamic | Runtime overhead, SSR complexity | 6/10 |
| CSS Modules | Scoped, no runtime | Verbose, no design tokens | 5/10 |
| Vanilla CSS | Simple | No tooling, global scope | 3/10 |

**Decision:** Tailwind CSS with shadcn/ui components

**Consequences:**
- (+) Consistent spacing, colors via design tokens
- (+) Small bundle with purging
- (+) shadcn/ui provides accessible components
- (-) Long class strings in JSX
- (-) Learning curve for utility-first

---

### ADR-007: REST over GraphQL

**Status:** Accepted

**Context:**
Need API design for frontend to communicate with backend. Data model is relatively simple with predictable queries.

**Options Evaluated:**

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **REST** | Simple, cacheable, well-understood | Over/under fetching | 8/10 |
| GraphQL | Flexible queries, typed | Complexity, caching harder | 6/10 |
| tRPC | End-to-end type safety | Tight coupling, smaller ecosystem | 7/10 |

**Decision:** REST API with Next.js API routes

**Consequences:**
- (+) Simple to implement and understand
- (+) HTTP caching works out of the box
- (+) Well-documented patterns
- (-) May need multiple requests for some views
- (-) No automatic type generation (mitigated by Zod + TypeScript)

---

## Technology Comparison — Search

### Options Evaluated for MVP

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **PostgreSQL FTS** | Built-in, no extra service | Basic ranking, no fuzzy | 7/10 |
| Meilisearch | Fast, typo-tolerant | Extra service to deploy | 8/10 |
| Algolia | Best-in-class UX | Expensive, vendor lock-in | 6/10 |
| Elasticsearch | Powerful | Complex, overkill | 4/10 |

**Decision:** PostgreSQL Full-Text Search for MVP

**Upgrade Path:** Migrate to Meilisearch if search UX needs improvement

---

## Technology Comparison — Analytics

### Options Evaluated

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Plausible** | Privacy-friendly, simple | Paid ($9/mo) | 8/10 |
| **Umami** | Self-hostable, free | Requires hosting | 8/10 |
| Google Analytics | Free, powerful | Privacy concerns, NDPR issues | 5/10 |
| Mixpanel | Event tracking, funnels | Expensive, overkill | 5/10 |

**Decision:** Plausible or Umami (decide at implementation based on hosting)

---

## Risks & Mitigations

| Technology | Risk | Mitigation |
|------------|------|------------|
| Vercel | Vendor lock-in | Standard Next.js, can deploy elsewhere |
| Supabase | Service outage | Daily backups, RLS for security |
| OpenAI | API downtime | Claude fallback configured |
| OpenAI | Cost overrun | Caching, rate limits, GPT-4o-mini for simple queries |
| Prisma | Migration complexity | Test migrations in staging |
| Next.js App Router | Breaking changes | Pin versions, test upgrades |

---

## Cost Analysis

### MVP Monthly Estimate

| Service | Plan | Est. Cost |
|---------|------|-----------|
| Vercel | Hobby → Pro | $0-20 |
| Supabase | Free → Pro | $0-25 |
| OpenAI | Pay-as-you-go | $20-50 |
| Resend | Free tier | $0 |
| Sentry | Free tier | $0 |
| Plausible (optional) | Starter | $9 |
| Domain | Annual | ~$1/mo |
| **Total** | | **$30-105/mo** |

### Cost per User (at 5,000 MAU)

- Infrastructure: ~$50/mo ÷ 5,000 = $0.01/user
- AI (with caching): ~$30/mo ÷ 5,000 = $0.006/user
- **Total: ~$0.016/user/month**

---

## Future Technology Considerations

| When | Technology | Purpose |
|------|------------|---------|
| Growth phase | Redis | Caching layer for performance |
| Growth phase | Meilisearch | Better search UX |
| Scale phase | Read replicas | Database scaling |
| Mobile app | React Native / Expo | Native mobile experience |
| Premium tier | Paystack | Nigerian payment processing |

---

*Document: 14 of 20 | Phase 4: Architecture Planning*
*Project: LawMadeSimple | Created: January 2026*
