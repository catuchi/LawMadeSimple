# Deployment Architecture

> Infrastructure, CI/CD, and operational setup for LawMadeSimple.

---

## Environment Strategy

| Environment | Purpose | Infrastructure | Data | URL |
|-------------|---------|----------------|------|-----|
| **Local** | Development | Docker/Local | Seed data | localhost:3000 |
| **Preview** | PR testing | Vercel Preview | Seeded/Synthetic | pr-123.lawmadesimple.vercel.app |
| **Staging** | Pre-prod validation | Vercel (separate project) | Anonymized prod copy | staging.lawmadesimple.com |
| **Production** | Live system | Vercel Production | Real data | lawmadesimple.com |

### Environment Variables by Environment

| Variable | Local | Preview | Staging | Production |
|----------|-------|---------|---------|------------|
| `DATABASE_URL` | Local Supabase | Staging DB | Staging DB | Production DB |
| `NEXT_PUBLIC_SUPABASE_URL` | Local | Staging | Staging | Production |
| `SUPABASE_SERVICE_ROLE_KEY` | Local | Staging | Staging | Production |
| `OPENAI_API_KEY` | Dev key | Dev key | Prod key | Prod key |
| `NEXT_PUBLIC_APP_URL` | localhost | Preview URL | staging.* | lawmadesimple.com |
| `SENTRY_DSN` | - | Staging | Staging | Production |

---

## Infrastructure as Code

### Vercel Project Configuration

```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm ci",
  "regions": ["iad1"],
  "functions": {
    "app/api/explanations/route.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ],
  "redirects": [
    { "source": "/home", "destination": "/", "permanent": true }
  ]
}
```

### Supabase Configuration

```sql
-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Users can only read their own data
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Bookmarks policy
CREATE POLICY "Users can manage own bookmarks"
  ON bookmarks FOR ALL
  USING (auth.uid() = user_id);

-- Feedback policy
CREATE POLICY "Users can create feedback"
  ON feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own feedback"
  ON feedback FOR SELECT
  USING (auth.uid() = user_id);
```

### Resource Specifications

| Resource | Free Tier | Pro Tier (Growth) |
|----------|-----------|-------------------|
| **Vercel** | | |
| - Bandwidth | 100GB/mo | 1TB/mo |
| - Function Executions | 100GB-Hrs | 1000GB-Hrs |
| - Function Timeout | 10s | 60s |
| **Supabase** | | |
| - Database | 500MB | 8GB |
| - Auth MAU | 50,000 | Unlimited |
| - Storage | 1GB | 100GB |
| - Bandwidth | 2GB | 250GB |

---

## CI/CD Pipeline

### Pipeline Overview

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Push/PR │───▶│  Lint    │───▶│  Type    │───▶│  Test    │───▶│  Build   │
│          │    │  Check   │    │  Check   │    │          │    │          │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └────┬─────┘
                                                                      │
                                                    ┌─────────────────┴─────────────────┐
                                                    │                                   │
                                                    ▼                                   ▼
                                             ┌──────────────┐                   ┌──────────────┐
                                             │   Preview    │                   │  Production  │
                                             │   Deploy     │                   │   Deploy     │
                                             │  (on PR)     │                   │  (on merge)  │
                                             └──────────────┘                   └──────────────┘
```

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Run TypeScript check
        run: npm run typecheck

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

  # Vercel handles deployment automatically
```

### Pre-commit Hooks

```json
// package.json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
npm run typecheck
```

### Deployment Triggers

| Event | Action |
|-------|--------|
| PR opened | Deploy to Preview |
| PR updated | Redeploy to Preview |
| PR merged to main | Deploy to Production |
| Manual trigger | Deploy to Staging/Production |

---

## Monitoring & Observability

### Logging Strategy

**Log Levels:**
| Level | Usage | Example |
|-------|-------|---------|
| `error` | Failures requiring attention | AI API failure, database errors |
| `warn` | Potential issues | Rate limit approaching, slow queries |
| `info` | Key events | User signup, explanation generated |
| `debug` | Development details | Request/response bodies |

**Structured Logging Format:**
```json
{
  "timestamp": "2026-01-27T10:30:00Z",
  "level": "info",
  "message": "Explanation generated",
  "context": {
    "userId": "uuid",
    "lawId": "constitution-s35",
    "cached": false,
    "duration": 3200
  },
  "requestId": "uuid"
}
```

### Metrics to Track

| Category | Metric | Target | Alert Threshold |
|----------|--------|--------|-----------------|
| **Availability** | Uptime | 99.5% | < 99% |
| **Performance** | P95 Latency | < 500ms | > 1000ms |
| **Performance** | AI Response Time | < 5s | > 10s |
| **Errors** | Error Rate | < 1% | > 2% |
| **Business** | Daily Active Users | Growth | -20% week-over-week |
| **Business** | Explanations Generated | Growth | -50% week-over-week |
| **Cost** | OpenAI Spend | < $50/mo | > $75/mo |

### Alerting Configuration

| Alert | Condition | Channel | Severity |
|-------|-----------|---------|----------|
| Site Down | 3 consecutive failures | Email, SMS | Critical |
| High Error Rate | > 5% for 5 minutes | Email | High |
| AI Service Down | OpenAI 5xx for 2 minutes | Email | High |
| Database Near Limit | > 80% storage | Email | Medium |
| Cost Threshold | > $75 spend | Email | Medium |

### Sentry Configuration

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.VERCEL_ENV || 'development',

  // Performance monitoring
  tracesSampleRate: 0.1, // 10% of transactions

  // Release tracking
  release: process.env.VERCEL_GIT_COMMIT_SHA,

  // Filter sensitive data
  beforeSend(event) {
    // Scrub PII
    if (event.user) {
      delete event.user.email;
    }
    return event;
  },
});
```

### Vercel Analytics Setup

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

---

## Disaster Recovery

### Recovery Objectives

| Metric | Target | Strategy |
|--------|--------|----------|
| **RTO** (Recovery Time Objective) | < 1 hour | Vercel instant rollback, Supabase point-in-time recovery |
| **RPO** (Recovery Point Objective) | < 24 hours | Daily database backups |

### Backup Strategy

| Data | Frequency | Retention | Location |
|------|-----------|-----------|----------|
| Database | Daily (automatic) | 7 days | Supabase managed |
| Database | Weekly (manual export) | 30 days | Cloud storage |
| Environment Variables | On change | Indefinite | 1Password/Secrets manager |
| Code | Every commit | Indefinite | GitHub |

### Rollback Procedures

**Vercel Deployment Rollback:**
1. Go to Vercel Dashboard → Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"
4. Verify site functionality

**Database Rollback:**
1. Go to Supabase Dashboard → Database → Backups
2. Select point-in-time or daily backup
3. Restore to new database
4. Update connection string
5. Verify data integrity

### Incident Response

1. **Detect** — Alert triggers (Sentry, Vercel, manual report)
2. **Triage** — Assess severity (Critical/High/Medium/Low)
3. **Communicate** — Update status page (if applicable)
4. **Mitigate** — Rollback, disable feature, or hotfix
5. **Resolve** — Deploy fix, verify functionality
6. **Post-mortem** — Document incident, update runbook

---

## Security Hardening

### Headers Configuration

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  }
];
```

### Rate Limiting

```typescript
// middleware.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
});

export async function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return new Response('Too Many Requests', { status: 429 });
  }
}
```

---

## Runbook Quick Reference

| Scenario | Action |
|----------|--------|
| **Site down** | Check Vercel status, check Supabase status, rollback if recent deploy |
| **Slow AI responses** | Check OpenAI status, verify caching, check rate limits |
| **Database errors** | Check Supabase dashboard, verify connection pool, check RLS policies |
| **Auth not working** | Check Supabase Auth, verify OAuth credentials, check redirect URLs |
| **High costs** | Review OpenAI usage, check for runaway queries, enable stricter caching |

---

*Document: 15 of 20 | Phase 4: Architecture Planning*
*Project: LawMadeSimple | Created: January 2026*
