# Non-Functional Requirements

> How LawMadeSimple must perform.

---

## Performance Requirements

| ID | Requirement | Metric | Target | Priority |
|----|-------------|--------|--------|----------|
| NFR-P1 | Page Load Time | Initial page load | < 2 seconds on 3G | P0 |
| NFR-P2 | Time to Interactive | First input delay | < 100ms | P0 |
| NFR-P3 | AI Response Time | Explanation generation | < 5 seconds | P0 |
| NFR-P4 | Cached Response Time | Cached explanation retrieval | < 500ms | P0 |
| NFR-P5 | Search Response Time | Search results return | < 1 second | P0 |
| NFR-P6 | Database Query Time | Average query execution | < 100ms | P1 |

---

## Scalability Requirements

| ID | Requirement | Current | Target | Growth Rate |
|----|-------------|---------|--------|-------------|
| NFR-SC1 | Concurrent Users | 0 | 500 concurrent | 2x monthly |
| NFR-SC2 | Monthly Active Users | 0 | 10,000 MAU (Year 1) | — |
| NFR-SC3 | Explanations per Day | 0 | 5,000/day | Grows with users |
| NFR-SC4 | Database Size | 0 | 10GB | 500MB/month |
| NFR-SC5 | API Requests | 0 | 100,000/day | Scales with users |

**Scaling Strategy:**
- Vercel serverless auto-scales compute
- Supabase managed PostgreSQL scales vertically
- AI response caching reduces OpenAI API load
- CDN for static assets

---

## Security Requirements

| ID | Requirement | Standard | Implementation |
|----|-------------|----------|----------------|
| NFR-S1 | Data Encryption in Transit | TLS 1.3 | HTTPS enforced (Vercel default) |
| NFR-S2 | Data Encryption at Rest | AES-256 | Supabase managed encryption |
| NFR-S3 | Authentication | OAuth 2.0 / JWT | Supabase Auth |
| NFR-S4 | Authorization | Row Level Security | Supabase RLS policies |
| NFR-S5 | Input Validation | OWASP | Server-side validation, sanitization |
| NFR-S6 | Rate Limiting | Per-IP, Per-User | Vercel Edge + custom middleware |
| NFR-S7 | Secret Management | Environment Variables | Vercel encrypted env vars |
| NFR-S8 | Dependency Security | Automated scanning | GitHub Dependabot |

---

## Reliability Requirements

| ID | Requirement | Metric | Target |
|----|-------------|--------|--------|
| NFR-R1 | Uptime | Availability | 99.5% (4.38 hours downtime/year) |
| NFR-R2 | Recovery Time | RTO | < 1 hour |
| NFR-R3 | Recovery Point | RPO | < 24 hours |
| NFR-R4 | Error Rate | Failed requests | < 1% |
| NFR-R5 | AI Fallback | Backup provider | Claude API configured |

**Reliability Strategy:**
- Vercel multi-region deployment
- Supabase daily backups
- Cached content fallback when AI fails
- Error monitoring with Sentry

---

## Usability Requirements

| ID | Requirement | Metric | Target |
|----|-------------|--------|--------|
| NFR-U1 | Learnability | Time to first successful action | < 2 minutes |
| NFR-U2 | Task Completion | Find relevant law from scenario | 90% success rate |
| NFR-U3 | Reading Level | Explanation complexity | High school graduate |
| NFR-U4 | Mobile Usability | Mobile task success rate | Equal to desktop |
| NFR-U5 | Navigation Depth | Clicks to any explanation | Maximum 3 |

---

## Compatibility Requirements

| Platform/Browser | Minimum Version | Priority |
|------------------|-----------------|----------|
| Chrome (Desktop) | Last 2 versions | P0 |
| Chrome (Mobile) | Last 2 versions | P0 |
| Safari (iOS) | iOS 14+ | P0 |
| Firefox | Last 2 versions | P1 |
| Edge | Last 2 versions | P1 |
| Samsung Internet | Last 2 versions | P1 |
| Opera Mini | Latest | P2 |

**Device Support:**
- Smartphones: iOS 14+, Android 8+
- Tablets: All screen sizes
- Desktop: 1024px+ width

---

## Accessibility Requirements

| ID | Requirement | Standard | Implementation |
|----|-------------|----------|----------------|
| NFR-A1 | Screen Reader Support | WCAG 2.1 AA | Semantic HTML, ARIA labels |
| NFR-A2 | Keyboard Navigation | WCAG 2.1 AA | Tab order, focus states |
| NFR-A3 | Color Contrast | WCAG 2.1 AA | 4.5:1 minimum ratio |
| NFR-A4 | Text Resizing | WCAG 2.1 AA | Up to 200% without breaking |
| NFR-A5 | Touch Targets | Mobile best practice | Minimum 44x44 pixels |
| NFR-A6 | Alt Text | WCAG 2.1 AA | All images have alt text |

---

## Compliance Requirements

| Regulation | Requirement | Implementation |
|------------|-------------|----------------|
| **NDPR** | Data protection and privacy | Privacy policy, consent, data access rights |
| **NDPR** | Lawful basis for processing | Consent for marketing, legitimate interest for service |
| **NDPR** | Data subject rights | Access, deletion, portability requests |
| **NDPR** | Data breach notification | Incident response process |
| **Terms of Service** | Liability limitation | Strong disclaimers, lawyer-reviewed ToS |

---

## Maintainability Requirements

| ID | Requirement | Metric | Target |
|----|-------------|--------|--------|
| NFR-M1 | Code Documentation | JSDoc coverage | 80% of exported functions |
| NFR-M2 | Type Safety | TypeScript strict mode | Zero type errors |
| NFR-M3 | Test Coverage | Automated test coverage | 70% of critical paths |
| NFR-M4 | Deployment Time | Push to production | < 5 minutes |
| NFR-M5 | Rollback Time | Revert bad deployment | < 2 minutes |

---

## Observability Requirements

| ID | Requirement | Tool | Implementation |
|----|-------------|------|----------------|
| NFR-O1 | Error Tracking | Sentry | All errors captured with context |
| NFR-O2 | Performance Monitoring | Vercel Analytics | Core Web Vitals tracked |
| NFR-O3 | User Analytics | Plausible/Umami | Page views, user flows |
| NFR-O4 | API Logging | Custom logging | Request/response logging |
| NFR-O5 | Alerting | Sentry + Vercel | Critical errors notify immediately |

---

## Cost Requirements

| ID | Requirement | Metric | Target |
|----|-------------|--------|--------|
| NFR-C1 | Monthly Operating Cost | Total infrastructure | < $100/month (MVP) |
| NFR-C2 | Cost per User | Cost / MAU | < $0.01 |
| NFR-C3 | AI API Cost | OpenAI spend | < $50/month (with caching) |

---

*Document: 07 of 20 | Phase 2: Requirements*
*Project: LawMadeSimple | Created: January 2026*
