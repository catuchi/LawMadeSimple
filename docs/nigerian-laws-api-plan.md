# NigerianLawsAPI - Strategic Plan

> A companion B2B product to LawMadeSimple, providing structured, indexed, API-accessible Nigerian legal data for developers and organizations.

**Status:** Planning
**Created:** January 28, 2026
**Primary Focus:** LawMadeSimple (this is secondary, built alongside)

---

## Executive Summary

While building LawMadeSimple, we identified a significant gap in the Nigerian legal tech ecosystem: **no properly indexed, API-accessible source of Nigerian laws exists**. Rather than just solving this problem for ourselves, we'll productize our law structuring work into a B2B API product.

### The Opportunity

| What Exists | What's Missing |
|-------------|----------------|
| PDFs scattered across sites | Structured, machine-readable data |
| Outdated databases (NigeriaLII dead since 2018) | Current, maintained content |
| No APIs | Programmatic access |
| Poor/no indexing | Searchable, well-organized content |
| Commercial solutions with no API (LawPavilion) | Developer-friendly infrastructure |

---

## Product Vision

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   LawMadeSimple          +        NigerianLawsAPI           │
│   (Consumer App)                  (Developer Platform)      │
│                                                             │
│   "Understand Nigerian Law"       "Build with Nigerian Law" │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                    Same Foundation
                    Same Data Model
                    Built Together
```

### Relationship to LawMadeSimple

- **Primary focus:** LawMadeSimple
- **NigerianLawsAPI:** Built as a byproduct of the same data work
- **Shared foundation:** Same database, same law content
- **Different audiences:** B2C (consumers) vs B2B (developers)

---

## Scope Definition

### What NigerianLawsAPI Includes (Raw Legal Data)

- Laws (federal and state)
- Sections and Articles
- Amendments and version history
- Official citations
- Source/provenance metadata
- Search and filtering

### What NigerianLawsAPI Does NOT Include (LawMadeSimple IP)

- Scenarios (real-life situation mappings)
- Scenario-to-Section relevance mappings
- AI-generated explanations
- User data (bookmarks, feedback)
- Curated "relevance notes"

**Rationale:** Laws are public domain; our scenario curation is proprietary competitive advantage.

---

## Target Customers

| Segment | Use Case | Willingness to Pay |
|---------|----------|-------------------|
| Legal tech startups | Building apps | High |
| Law firms | Research tools, internal systems | High |
| Compliance teams | Regulatory monitoring | Medium-High |
| Academic researchers | Legal research, AI training | Medium |
| NGOs/Civil society | Access to justice projects | Low (grant-funded) |
| Journalism | Investigative reporting | Low-Medium |
| Government contractors | E-government projects | High |

---

## Business Model

### Freemium API Tiers

| Tier | Price | Limits | Features |
|------|-------|--------|----------|
| **Free** | ₦0 | 100 requests/day, 3 laws | Basic search, read-only |
| **Starter** | ₦5,000/mo | 5,000 requests/day, all laws | Full API, basic support |
| **Pro** | ₦25,000/mo | 50,000 requests/day | Webhooks for law changes, bulk export |
| **Enterprise** | Custom | Unlimited | Dedicated support, SLA, custom integrations |

### Additional Revenue Streams

- One-time bulk data exports (₦50,000+)
- Premium "amendment alerts" subscription
- Consulting for legal tech implementations

---

## Technical Architecture

### Database Schema Enhancements

The following enhancements to the Prisma schema support both LawMadeSimple and NigerianLawsAPI:

#### Enhanced Law Model Fields

```prisma
// Add to existing Law model
officialCitation  String?      // e.g., "Cap L1, LFN 2004"
jurisdiction      Jurisdiction // federal, state_lagos, etc.
status            LawStatus    // in_force, amended, repealed
version           Int          // Increments on amendments

// Source tracking
sourceId          String?
sourceFetchedAt   DateTime?
sourceVerifiedAt  DateTime?

// Publication info
gazetteNumber     String?
gazetteDate       DateTime?
commencementDate  DateTime?
```

#### New Models Required

```prisma
// Track where law data comes from
model LawSource {
  id          String   @id @default(uuid())
  name        String   @unique  // "PLAC", "Lagos MOJ", "ICNL"
  url         String
  description String?
  isOfficial  Boolean  @default(false)
  laws        Law[]
}

// Track amendments between laws
model Amendment {
  id              String    @id @default(uuid())
  amendedLawId    String
  amendingLawId   String?
  amendingLawRef  String?   // External reference
  effectiveDate   DateTime
  description     String?
}

// API access (implement post-MVP)
model ApiKey {
  id           String      @id @default(uuid())
  key          String      @unique
  name         String
  email        String
  tier         ApiKeyTier
  dailyLimit   Int
  monthlyLimit Int?
  isActive     Boolean
  lastUsedAt   DateTime?
  createdAt    DateTime
  expiresAt    DateTime?
}

model ApiUsage {
  id          String    @id @default(uuid())
  apiKeyId    String
  endpoint    String
  method      String
  statusCode  Int
  responseMs  Int?
  createdAt   DateTime
}
```

### API Design (Future)

Base URL: `https://api.nigerianlawsapi.com/v1`

#### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/laws` | GET | List all laws (paginated, filterable) |
| `/laws/{slug}` | GET | Get single law with sections |
| `/laws/{slug}/sections` | GET | List sections for a law |
| `/laws/{slug}/sections/{number}` | GET | Get single section with articles |
| `/search` | GET | Full-text search across all laws |
| `/amendments` | GET | List recent amendments |
| `/sources` | GET | List data sources |

#### Response Format

```json
{
  "data": { ... },
  "meta": {
    "source": "PLAC",
    "fetchedAt": "2026-01-15T00:00:00Z",
    "verifiedAt": "2026-01-20T00:00:00Z",
    "version": 1
  },
  "links": {
    "self": "/v1/laws/constitution-1999",
    "sections": "/v1/laws/constitution-1999/sections"
  }
}
```

---

## Implementation Roadmap

### Phase A: Foundation (During LawMadeSimple Development)

**Timeline:** Phases 4-8 of LawMadeSimple

| Task | When | Benefit |
|------|------|---------|
| Enhance Law model with API-ready fields | Phase 8 | Richer data for both products |
| Create LawSource model | Phase 8 | Track provenance |
| Build content ingestion workflow | Phase 8 | Repeatable process |
| Structure 6 MVP laws with full metadata | Phase 8 | Foundation content |
| Document data model | Phase 8 | API docs foundation |

### Phase B: LawMadeSimple MVP Launch

**Timeline:** Phases 9-12

- Focus entirely on LawMadeSimple
- No NigerianLawsAPI work
- Validate that law data structure works in production

### Phase C: NigerianLawsAPI Alpha (Post-MVP)

**Timeline:** Phase 13 (new)

| Task | Description |
|------|-------------|
| Create public API routes | Separate from internal LawMadeSimple APIs |
| Implement API key authentication | JWT or API key based |
| Add rate limiting by tier | Based on ApiKey.dailyLimit |
| Build documentation site | Swagger/OpenAPI spec |
| Launch free tier | 100 requests/day, 3 laws |

### Phase D: Growth

**Timeline:** Phase 14+

| Task | Description |
|------|-------------|
| Add paid tiers | Paystack integration |
| Expand law coverage | 20+ laws |
| Build SDKs | JavaScript, Python |
| Add webhooks | Notify on law changes |
| Marketing | Developer outreach, blog posts |

---

## Marketing Strategy

### Within LawMadeSimple

1. **Footer:** "Powered by NigerianLawsAPI" with link
2. **Developer CTA** on law pages: "Building a legal app? Get this data via our API"
3. **"View Raw Data"** option showing JSON with API link
4. **Blog content:** "How we structured Nigerian laws for digital access"

### External

- Dev.to / Hashnode articles on Nigerian legal tech
- Twitter/X presence for Nigerian tech community
- GitHub: Open-source SDK, sample projects
- Partnerships with Nigerian tech hubs/incubators

---

## Competitive Landscape

| Competitor | Strengths | Weaknesses | Our Advantage |
|------------|-----------|------------|---------------|
| Laws.Africa | API, structured data | Nigerian content stale (2018) | Nigeria-focused, current |
| LawPavilion | Comprehensive, trusted | No API, expensive | Developer-friendly, affordable |
| NigeriaLII | Free, historical | Defunct since 2018 | Active maintenance |
| OpenLawsNig | Mobile apps, AI | No API, fragmented | Unified API access |

---

## Risks and Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Scope creep delays LawMadeSimple | High | High | Strict phase separation; API work only in designated phases |
| No paying customers | Medium | Medium | Validate with free tier first; pre-sell to known contacts |
| Laws.Africa updates Nigerian content | Low | Medium | Move fast; focus on DX and local support |
| Maintenance burden | Medium | Medium | Charge enough to fund ongoing work; community reporting |
| Legal/licensing issues | Low | Low | Laws are public domain; we sell structure/access |

---

## Success Metrics

### Phase C (Alpha)

- 50 free tier signups
- 10 active API users (>10 requests/week)
- <100ms average response time

### Phase D (Growth)

- 5 paying customers
- 500 free tier users
- 95% uptime SLA

### Year 1

- ₦500,000 ARR from API subscriptions
- 20+ laws in database
- 3rd-party app built on the API

---

## Open Questions

| Question | Status | Notes |
|----------|--------|-------|
| Domain: nigerianlawsapi.com or .ng? | Pending | Secure both if affordable |
| Hosting: Same Vercel project or separate? | Pending | Likely separate for isolation |
| Billing: Paystack or Flutterwave? | Pending | Paystack preferred (developer-friendly) |
| First paying customer? | Pending | Identify during LawMadeSimple marketing |

---

## References

- `docs/law-sources-research.md` — Research on Nigerian law data sources
- `docs/gaps-and-considerations.md` — Content acquisition workflow
- `prisma/schema.prisma` — Current database schema
- `plan.md` — LawMadeSimple development plan

---

*Document Version: 1.0*
*Last Updated: January 28, 2026*
