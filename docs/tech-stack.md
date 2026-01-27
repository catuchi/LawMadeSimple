# LawMadeSimple - Tech Stack

> Complete technology stack decisions with rationale for each choice.

---

## Stack Overview

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js 14+, React, Tailwind CSS, shadcn/ui | Web application |
| Backend | Next.js API Routes | Server-side logic |
| Database | Supabase (PostgreSQL) + Prisma ORM | Data persistence |
| Auth | Supabase Auth | Authentication |
| AI | OpenAI API + Vercel AI SDK | Law explanations |
| Storage | Supabase Storage | File storage |
| Search | Supabase Full-Text Search | Content discovery |
| Hosting | Vercel | Deployment |
| Analytics | Plausible or Umami | Privacy-friendly analytics |
| Monitoring | Sentry + Vercel | Error tracking & performance |
| Email | Resend | Transactional emails |
| Payments | Paystack (future) | Nigerian payment processing |
| CI/CD | GitHub Actions + Vercel | Automated deployment |

---

## Frontend

### Next.js 14+
**Why:**
- App Router for modern React patterns
- Server components for performance
- Built-in API routes
- Excellent Vercel integration
- Strong TypeScript support
- SEO-friendly with SSR/SSG

**Configuration:**
- App Router (not Pages Router)
- TypeScript enabled
- Strict mode on

### React
**Why:**
- Component-based architecture
- Large ecosystem
- Easy to find developers
- Pairs perfectly with Next.js

### Tailwind CSS
**Why:**
- Utility-first for rapid development
- Consistent design tokens
- Small bundle size with purging
- Works great with component libraries
- Mobile-first responsive design

### shadcn/ui
**Why:**
- Not a dependency, but copyable components
- Full control over component code
- Tailwind-based, matches our styling
- Accessible by default
- Beautiful, modern aesthetics
- Easy to customize

---

## Backend

### Next.js API Routes
**Why:**
- No separate backend to deploy
- Co-located with frontend
- Serverless by default on Vercel
- TypeScript end-to-end
- Sufficient for MVP complexity

**Structure:**
```
app/
  api/
    auth/
    laws/
    explanations/
    feedback/
```

---

## Database

### Supabase (PostgreSQL)
**Why:**
- PostgreSQL is robust, scalable, proven
- Supabase provides managed hosting
- Row-level security for auth integration
- Real-time subscriptions if needed
- Generous free tier for MVP
- Full-text search built-in

**Configuration:**
- Hosted Supabase project
- Row Level Security (RLS) enabled
- Regular backups

### Prisma ORM
**Why:**
- Type-safe database access
- Excellent TypeScript integration
- Auto-generated types from schema
- Migration management
- Works great with PostgreSQL
- Developer experience

**Note:** Will use Prisma as ORM layer over Supabase PostgreSQL, not Supabase client directly for data operations.

---

## Authentication

### Supabase Auth
**Why:**
- Integrated with our database
- OAuth providers built-in
- Magic link support
- No password management needed
- Session handling included
- Free tier sufficient

**Methods (MVP):**
1. **Google OAuth** - Primary, most users have Google
2. **Magic Links** - Email-based, no password friction

**Future Methods:**
- Apple OAuth (for iOS app)
- Phone OTP (common in Nigeria)

---

## AI / LLM

### OpenAI API
**Why:**
- GPT-4o for high-quality explanations
- GPT-4o-mini for cost-effective operations
- Best-in-class for instruction following
- Reliable, well-documented API
- Function calling for structured output

**Models:**
- **GPT-4o:** Complex explanations, nuanced scenarios
- **GPT-4o-mini:** Simple lookups, high-volume requests

**Backup:** Claude API configured as failover

### Vercel AI SDK
**Why:**
- Streaming responses out of the box
- Provider-agnostic abstraction
- Easy model switching
- Built for Vercel deployment
- React hooks for UI integration

---

## Storage

### Supabase Storage
**Why:**
- Integrated with auth (RLS policies)
- S3-compatible
- CDN included
- Simple API
- Free tier sufficient for MVP

**Use Cases:**
- PDF downloads of laws
- User profile images (if added)
- Cached AI responses (if implemented)

---

## Search

### Supabase Full-Text Search (MVP)
**Why:**
- Built into PostgreSQL
- No additional service needed
- Good enough for MVP scale
- Supports Nigerian English

**Upgrade Path:** Meilisearch if search becomes a bottleneck

### Meilisearch (Future)
**Why:**
- Typo-tolerant
- Fast, relevant results
- Easy to deploy
- Better UX for non-exact queries

---

## Hosting

### Vercel
**Why:**
- First-class Next.js support
- Automatic deployments
- Edge functions available
- Built-in analytics
- Excellent DX
- Generous free tier
- Preview deployments for PRs

**Configuration:**
- Production: Connected to `main` branch
- Preview: All other branches
- Environment variables for secrets

---

## Analytics

### Plausible or Umami
**Why:**
- Privacy-friendly (NDPR compliance easier)
- No cookie banners needed
- Simple, actionable metrics
- Self-hostable (Umami) or managed (Plausible)
- Lightweight scripts

**Decision:** Choose based on cost at implementation time

**Key Metrics:**
- Page views and sessions
- Popular laws/topics
- Search queries
- Conversion (signup) rates

---

## Monitoring

### Sentry
**Why:**
- Industry standard error tracking
- Source maps integration
- Performance monitoring
- User session replay
- Alert configuration

**Configuration:**
- Error tracking enabled
- Performance sampling at 10%
- PII scrubbing enabled

### Vercel Analytics
**Why:**
- Built-in with hosting
- Core Web Vitals tracking
- No extra setup needed

---

## Email

### Resend
**Why:**
- Modern, developer-friendly API
- Great deliverability
- React Email integration
- Reasonable pricing
- Simple to set up

**Use Cases:**
- Magic link authentication
- Welcome emails
- Feedback confirmations
- Newsletter (future)

---

## Payments (Future)

### Paystack
**Why:**
- Nigerian payment standard
- Supports cards, bank transfer, USSD
- Well-documented API
- Trusted by Nigerian users
- Reasonable fees

**Implementation:** Phase 2 when freemium tiers launch

---

## CI/CD

### GitHub Actions
**Why:**
- Integrated with GitHub
- Free for public repos
- Workflow automation
- Test running before deploy

**Workflows:**
- Lint and type check on PR
- Test suite on PR
- Auto-deploy to Vercel on merge

### Vercel Auto-Deploy
**Why:**
- Zero-config deployments
- Preview deployments
- Instant rollbacks
- Built-in

---

## Development Tools

### TypeScript
**Why:**
- Type safety across stack
- Better IDE support
- Catch errors early
- Self-documenting code

### ESLint + Prettier
**Why:**
- Consistent code style
- Catch common issues
- Auto-formatting

### Husky + lint-staged
**Why:**
- Pre-commit hooks
- Enforce standards
- Prevent bad commits

---

## Architecture Decisions

### Why Serverless
- No server management
- Auto-scaling
- Pay-per-use pricing
- Simpler deployment
- Good for variable traffic

### Why PostgreSQL over MongoDB
- Relational data (laws, sections, users)
- Complex queries for search
- ACID compliance
- Mature ecosystem
- Better for structured legal data

### Why Supabase over Firebase
- PostgreSQL vs proprietary
- Better query flexibility
- Open source
- Row-level security
- Prisma compatibility

### Why OpenAI over Claude (Primary)
- Larger context windows for legal text
- Better at structured instructions
- More established API
- Claude as backup maintains optionality

---

## Cost Estimation (MVP)

| Service | Plan | Est. Monthly Cost |
|---------|------|-------------------|
| Vercel | Hobby/Pro | $0-20 |
| Supabase | Free/Pro | $0-25 |
| OpenAI | Pay-as-you-go | $20-50 |
| Resend | Free tier | $0 |
| Sentry | Free tier | $0 |
| Domain | Annual | ~$12/year |
| **Total** | | **$20-100/month** |

---

## Security Considerations

- All secrets in environment variables
- Supabase RLS for data access
- HTTPS everywhere (Vercel default)
- Input sanitization
- Rate limiting on API routes
- NDPR-compliant data handling

---

## Scalability Path

1. **MVP:** Current stack handles thousands of users
2. **Growth:**
   - Upgrade Supabase plan
   - Add caching layer (Redis)
   - Consider dedicated search (Meilisearch)
3. **Scale:**
   - CDN for static content
   - Database read replicas
   - Edge functions for latency

---

*Last updated: January 2026*
