# System Architecture Document

> LawMadeSimple: Serverless architecture for democratizing Nigerian law.

---

## Architecture Overview

### System Context Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              LawMadeSimple                                   │
│                                                                             │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────────────────┐   │
│  │   Web/PWA     │───▶│   Next.js     │───▶│      Supabase             │   │
│  │   Browser     │    │   App + API   │    │  (PostgreSQL + Auth)      │   │
│  └───────────────┘    └───────┬───────┘    └───────────────────────────┘   │
│                               │                                             │
│                               ▼                                             │
│                       ┌───────────────┐                                     │
│                       │   OpenAI API  │                                     │
│                       │  (GPT-4o/mini)│                                     │
│                       └───────────────┘                                     │
└─────────────────────────────────────────────────────────────────────────────┘
         │                      │                          │
         ▼                      ▼                          ▼
┌─────────────────┐  ┌─────────────────────┐  ┌─────────────────────────────┐
│ Nigerian Users  │  │  External Services  │  │    Content Sources          │
│ (Citizens/SMEs) │  │  (Resend, Paystack) │  │  (NigeriaLII, PLAC)         │
└─────────────────┘  └─────────────────────┘  └─────────────────────────────┘
```

### High-Level Architecture

**Architecture Style:** Serverless Monolith (Modular Monolith on Serverless)

**Justification:**
1. **Solo developer** — No need for microservices complexity
2. **Variable traffic** — Serverless scales to zero when idle, handles spikes
3. **Cost-effective** — Pay-per-use, ideal for MVP with uncertain traffic
4. **Rapid development** — Single codebase, no network boundaries
5. **Easy to deploy** — Single Vercel deployment, no container orchestration

**Pattern:** Next.js App Router with API routes, deployed on Vercel serverless functions

---

## Component Architecture

### Component 1: Web Application (Frontend)

- **Responsibility:** User interface, client-side rendering, PWA capabilities
- **Technology:** Next.js 14+ (App Router), React, Tailwind CSS, shadcn/ui
- **Interfaces:**
  - Consumes API routes
  - Supabase Auth client for session management
- **Data:** Client-side state (React), cached responses, localStorage for preferences

**Key Features:**
- Server-side rendering (SSR) for SEO on law pages
- Static generation (SSG) for static content
- Client components for interactive features
- PWA manifest for offline access to bookmarks

### Component 2: API Layer (Backend)

- **Responsibility:** Business logic, data access, AI orchestration
- **Technology:** Next.js API Routes, Vercel AI SDK
- **Interfaces:**
  - REST endpoints under `/api/`
  - Streaming endpoints for AI responses
- **Data:** Prisma ORM for database access

**Key Modules:**
| Module | Path | Purpose |
|--------|------|---------|
| Auth | `/api/auth/*` | Session management, OAuth callbacks |
| Laws | `/api/laws/*` | Law content retrieval |
| Explanations | `/api/explanations/*` | AI-generated explanations |
| Search | `/api/search/*` | Full-text search |
| Bookmarks | `/api/bookmarks/*` | User saved content |
| Feedback | `/api/feedback/*` | User feedback collection |

### Component 3: Database Layer

- **Responsibility:** Persistent data storage, full-text search
- **Technology:** Supabase (managed PostgreSQL), Prisma ORM
- **Interfaces:** Prisma Client, Supabase SDK for RLS
- **Data:**
  - Laws and sections (structured legal text)
  - Users and profiles
  - Bookmarks and feedback
  - Cached AI explanations

### Component 4: Authentication Service

- **Responsibility:** User identity, session management
- **Technology:** Supabase Auth
- **Interfaces:**
  - OAuth providers (Google)
  - Magic link emails
  - JWT tokens
- **Data:** User sessions, auth tokens (managed by Supabase)

### Component 5: AI Service

- **Responsibility:** Generate plain language law explanations
- **Technology:** OpenAI API (GPT-4o, GPT-4o-mini), Vercel AI SDK
- **Interfaces:**
  - Chat completions API
  - Streaming responses
- **Data:** Prompts, responses, cached explanations

---

## Integration Architecture

### Internal Communication

| Source | Target | Protocol | Pattern |
|--------|--------|----------|---------|
| Frontend | API Routes | HTTP/HTTPS | Request/Response |
| Frontend | Supabase Auth | HTTPS | SDK Client |
| API Routes | Prisma/DB | TCP | Connection Pool |
| API Routes | OpenAI | HTTPS | Streaming |
| API Routes | Resend | HTTPS | Request/Response |

### External Integrations

| System | Purpose | Protocol | Authentication |
|--------|---------|----------|----------------|
| OpenAI API | AI explanations | HTTPS REST | API Key |
| Supabase | Database, Auth, Storage | HTTPS | Service Role Key |
| Resend | Transactional email | HTTPS REST | API Key |
| Paystack (future) | Payments | HTTPS REST | Secret Key |
| NigeriaLII/PLAC | Law content source | Web scraping / Manual | N/A |

---

## Security Architecture

### Authentication & Authorization

**Authentication Flow:**
```
User → Google OAuth / Magic Link → Supabase Auth → JWT Token → Frontend Storage
```

**Authorization Model:**
- **Row Level Security (RLS)** on Supabase for data access
- **Middleware** on API routes for auth verification
- **Guest access** for public law browsing (no auth required)
- **Authenticated access** for bookmarks, feedback, personalization

**Access Levels:**
| Level | Access |
|-------|--------|
| Guest | Browse laws, view explanations, search |
| User | + Bookmarks, feedback, history, preferences |
| Admin (future) | + Content management, analytics |

### Data Protection

**Encryption:**
- **In Transit:** TLS 1.3 (Vercel/Supabase default)
- **At Rest:** AES-256 (Supabase managed)

**Data Classification:**
| Data Type | Sensitivity | Protection |
|-----------|-------------|------------|
| Law content | Public | None required |
| User email | PII | Encrypted, RLS |
| User preferences | Low | RLS |
| Feedback | Low | RLS |
| Auth tokens | High | HttpOnly cookies, short expiry |

### Network Security

- **Vercel Edge Network:** DDoS protection, WAF
- **API Rate Limiting:** Per-IP and per-user limits
- **CORS:** Restricted to known origins
- **CSP:** Content Security Policy headers
- **No direct database access:** All through API or Supabase client with RLS

### Input Validation

| Input | Validation |
|-------|------------|
| Search queries | Sanitized, length limits |
| User feedback | Sanitized, XSS prevention |
| API parameters | Zod schema validation |
| Auth tokens | JWT verification |

---

## Scalability Strategy

### Horizontal Scaling

**Serverless Auto-scaling:**
- Vercel automatically scales functions based on traffic
- No manual intervention needed
- Handles traffic spikes (e.g., viral content)

**Database Scaling:**
- Supabase connection pooling (PgBouncer)
- Read replicas available if needed (Pro plan)

### Vertical Scaling

**Current Limits:**
| Resource | Free Tier | Pro Tier |
|----------|-----------|----------|
| Vercel Functions | 10s timeout | 60s timeout |
| Supabase DB | 500MB | 8GB+ |
| Supabase Connections | 60 | 200+ |

**Upgrade Path:** Move to Pro tiers when free tier limits are hit

### Caching Strategy

**Layer 1: Edge Caching (Vercel)**
- Static pages cached at edge
- `Cache-Control` headers for API responses
- ISR for semi-static content (law pages)

**Layer 2: Application Caching**
- AI explanations cached in database
- Repeated queries served from cache
- Cache invalidation on content update

**Layer 3: Client Caching**
- Service Worker for PWA offline
- `localStorage` for user preferences
- React Query for API response caching

**Cache TTL Strategy:**
| Content | TTL | Invalidation |
|---------|-----|--------------|
| Law text | 24 hours | Manual on law update |
| AI explanations | 7 days | Never (immutable) |
| Search results | 1 hour | Automatic |
| User data | No cache | Real-time |

---

## Error Handling Strategy

### Error Categories

| Category | Response | User Message | Logging |
|----------|----------|--------------|---------|
| Validation | 400 | Specific field errors | Debug |
| Auth | 401/403 | "Please sign in" | Info |
| Not Found | 404 | "Content not found" | Debug |
| AI Failure | 500 | "Explanation unavailable, try again" | Error |
| Rate Limit | 429 | "Too many requests" | Warn |
| Server Error | 500 | "Something went wrong" | Error + Alert |

### Fallback Behavior

- **AI unavailable:** Show cached explanation or "unavailable" message
- **Database unavailable:** Show cached content, disable writes
- **Auth unavailable:** Allow guest access only

---

## Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Page Load (3G) | < 2s | Vercel Analytics |
| Time to Interactive | < 100ms | Lighthouse |
| AI Response (uncached) | < 5s | Custom metrics |
| AI Response (cached) | < 500ms | Custom metrics |
| Search Results | < 1s | Custom metrics |
| API P95 Latency | < 200ms | Vercel Analytics |

---

## Deployment Topology

```
┌─────────────────────────────────────────────────────────────────┐
│                         Vercel Edge Network                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    CDN (Static Assets)                     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Serverless Functions (API Routes)             │  │
│  │                     (Auto-scaling)                         │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Supabase Cloud                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  PostgreSQL │  │    Auth     │  │        Storage          │  │
│  │  (Primary)  │  │   Service   │  │      (S3-compatible)    │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

*Document: 12 of 20 | Phase 4: Architecture Planning*
*Project: LawMadeSimple | Created: January 2026*
