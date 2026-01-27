# Initial Scope Document

> Defining what LawMadeSimple MVP will and won't do.

---

## In Scope

### Must Have (P0) — MVP Launch Requirements

- [ ] **Law Content Database**
  - 6 core federal laws: Constitution, Criminal Code, CAMA, Labour Act, Tenancy provisions, FIRS Act
  - Structured storage of law text (sections, articles, clauses)
  - Version tracking with "as of" dates

- [ ] **AI-Powered Explanations**
  - Plain language translation of legal text
  - Practical examples for each explanation
  - Source citations linking to original law text
  - Strong disclaimers ("not legal advice")

- [ ] **Scenario-Based Discovery**
  - "I'm dealing with..." entry point
  - Common scenarios mapped to relevant laws
  - Guided navigation for users who don't know legal terminology

- [ ] **Search Functionality**
  - Full-text search across laws
  - Search by scenario/situation
  - Search suggestions and auto-complete

- [ ] **User Authentication**
  - Google OAuth sign-in
  - Magic link (email) sign-in
  - Guest access for basic browsing

- [ ] **Core User Features**
  - Save/bookmark explanations
  - Feedback mechanism ("Was this helpful?")
  - Share explanations (link sharing)

- [ ] **Legal Compliance**
  - Privacy policy (NDPR compliant)
  - Terms of service with disclaimers
  - Cookie consent (if applicable)

- [ ] **Responsive Web App**
  - Mobile-first design
  - PWA capabilities (offline reading of saved content)
  - Fast load times (< 2 seconds)

---

### Should Have (P1) — Post-MVP Priorities

- [ ] **User Accounts**
  - Search history
  - Reading history
  - Personalized recommendations

- [ ] **Content Expansion**
  - More scenarios per law
  - FAQ sections per topic
  - Related laws linking

- [ ] **Engagement Features**
  - Push notifications (PWA)
  - Email digest of new content
  - "Ask a question" feature (queued for AI response)

- [ ] **Analytics Dashboard**
  - Popular topics/laws
  - Search analytics
  - User feedback summary

---

### Nice to Have (P2) — Future Roadmap

- [ ] **Nigerian Language Support**
  - Pidgin English (priority)
  - Yoruba, Igbo, Hausa

- [ ] **Premium Features**
  - Unlimited AI queries (free tier limited)
  - Download explanations as PDF
  - Priority response time

- [ ] **Case Law Integration**
  - Relevant court decisions
  - Precedent explanations

- [ ] **State Law Coverage**
  - Lagos, Abuja, Rivers (high-population first)
  - State-specific tenancy, land laws

- [ ] **Mobile Apps**
  - Native iOS app
  - Native Android app

- [ ] **Community Features**
  - User questions and answers
  - Community moderation
  - Lawyer verification badges

---

## Out of Scope

**Explicitly excluded from all phases:**

| Exclusion | Reason |
|-----------|--------|
| Legal advice | Liability risk; always disclaimers |
| Lawyer matching/referrals | Complex, regulated, liability |
| Document generation | Specialized feature, high risk |
| Live chat/consultation | Requires lawyers, high cost |
| Court filing assistance | Too complex, jurisdiction issues |
| Legal case management | Enterprise feature, different product |
| Legal news/updates | Content burden, not core value |
| Bar association integration | Partnership complexity |

---

## Constraints

| Type | Constraint | Impact |
|------|------------|--------|
| **Budget** | Solo developer, minimal funding | Use free tiers, managed services |
| **Time** | Part-time development | Phased approach, MVP focus |
| **Legal** | Must avoid "legal advice" liability | Strong disclaimers, source citations |
| **Content** | Must source from authoritative sources | Depend on NigeriaLII, PLAC, official sources |
| **Technical** | AI explanations must be accurate | RAG architecture, hallucination prevention |
| **Regulatory** | NDPR compliance required | Privacy-by-design, consent mechanisms |

---

## Assumptions

| Assumption | Risk if Invalid | Validation Method |
|------------|-----------------|-------------------|
| NigeriaLII content is freely usable | Content acquisition blocked | Verify licensing, reach out early |
| OpenAI API can handle Nigerian legal context | Poor explanation quality | Prototype testing with sample laws |
| 6 federal laws cover common scenarios | Users need more coverage | Usage analytics, feedback |
| Users accept AI with disclaimers | Trust/adoption issues | Beta testing, user interviews |
| Freemium can sustain operations | Business model fails | Early pricing research |
| Mobile web reaches target audience | Platform mismatch | Analytics, user research |
| English is sufficient for MVP | Excludes too many users | User feedback, demographic analysis |

---

## Dependencies

| Dependency | Type | Owner | Status | Risk |
|------------|------|-------|--------|------|
| NigeriaLII / PLAC content | External | Third party | Not started | Medium |
| OpenAI API | External | OpenAI | Available | Low |
| Supabase | External | Supabase Inc | Available | Low |
| Vercel | External | Vercel Inc | Available | Low |
| Legal review of ToS | External | Lawyer (TBD) | Not started | High |
| Law text structuring | Internal | Developer | Not started | Medium |
| AI prompt engineering | Internal | Developer | Not started | Medium |

---

## Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **AI provides incorrect legal information** | Medium | High | RAG architecture, source citations, feedback loop, disclaimers |
| **Content acquisition fails** | Low | Very High | Multiple sources, official gazettes as backup, early outreach |
| **Legal liability issues** | Low | Very High | Strong disclaimers, ToS review by lawyer, "not legal advice" everywhere |
| **No users discover product** | Medium | High | SEO strategy, content marketing, social media, partnerships |
| **Solo developer burnout** | Medium | High | Phased approach, realistic timelines, breaks |
| **OpenAI costs exceed budget** | Medium | Medium | Usage limits, caching, GPT-4o-mini for simple queries |
| **Scope creep delays launch** | High | Medium | Strict MVP criteria, phase gates, say no |
| **AI hallucinations in explanations** | Medium | High | RAG with source verification, user reporting, review process |

---

## MVP Success Criteria

**The MVP is complete when:**

1. [ ] 6 core laws are loaded with structured text
2. [ ] AI explanations generate for any section
3. [ ] 50+ common scenarios are mapped and working
4. [ ] Search returns relevant results
5. [ ] Users can sign in with Google or magic link
6. [ ] Users can save and share explanations
7. [ ] Feedback mechanism is working
8. [ ] Privacy policy and ToS are live
9. [ ] Site loads in < 2 seconds on 3G
10. [ ] No critical bugs in production

---

## Scope Change Process

Any changes to MVP scope require:

1. **Document the request** — What and why
2. **Impact analysis** — Timeline, cost, complexity
3. **Trade-off decision** — What gets cut if this is added
4. **Explicit approval** — Developer decides (solo project)
5. **Update this document** — Keep scope current

**Default answer to scope expansion: No (defer to post-MVP)**

---

*Document: 04 of 20 | Phase 1: Business Definition*
*Project: LawMadeSimple | Created: January 2026*
