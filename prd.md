# LawMadeSimple - Product Requirements Document

## Document Control

| Field | Value |
|-------|-------|
| Version | 1.0 |
| Status | Draft |
| Last Updated | January 27, 2026 |
| Author | Generated with Claude Code |
| Project Type | Full-stack Web App |

---

## 1. Product Overview

### 1.1 Product Summary

LawMadeSimple is a web platform that democratizes Nigerian law by translating complex legal jargon into plain, easy-to-understand language with practical examples. The platform serves common Nigerians and SMEs who need to understand their legal rights and obligations but lack access to affordable legal education.

Unlike existing platforms that simply provide raw legal text, LawMadeSimple focuses on *comprehension*—using AI-powered explanations, real-world scenarios, and practical examples to make the law accessible to everyone, regardless of their educational background.

The platform launches as a Progressive Web App (PWA) built on Next.js, offering a mobile-first, responsive experience with offline capabilities for users in areas with inconsistent internet connectivity.

### 1.2 Problem Statement

- **Problem**: Nigerian laws are written in complex legal language that ordinary citizens cannot understand, leaving them vulnerable to exploitation and unable to exercise their rights.
- **Impact**: Over 200 million Nigerians, plus millions of SMEs, struggle to understand basic legal rights regarding employment, tenancy, business registration, and interactions with law enforcement.
- **Current Solutions**: Existing platforms (LawPavilion, LegalNaija, Nigeria-Law.org) provide raw legal text without explanation, or offer expensive legal consultations inaccessible to most Nigerians.

### 1.3 Vision

To become the trusted platform where every Nigerian can understand their legal rights and obligations in plain language, empowering informed decisions and reducing legal exploitation.

---

## 2. Goals

### 2.1 Business Goals

| Goal | Success Metric | Target |
|------|----------------|--------|
| User Acquisition | Monthly Active Users | 10,000 in Year 1 |
| User Engagement | Average Session Duration | > 3 minutes |
| Content Coverage | Laws with AI explanations | 7 core laws + 2 supplementary (MVP) |
| Platform Reliability | System Uptime | 99.9% |
| User Satisfaction | Net Promoter Score | > 50 |

### 2.2 User Goals

| User Type | Goal | Success Metric |
|-----------|------|----------------|
| Tenant (Adaeze) | Understand tenancy rights | Can explain 3+ rights |
| SME Owner (Chukwuemeka) | Navigate business compliance | Completes registration checklist |
| Employee (Tunde) | Know employment rights | Can identify wrongful dismissal |
| Citizen (Ngozi) | Understand constitutional rights | Knows police interaction rights |
| Creator (Kelechi) | Protect intellectual property | Understands copyright basics, can respond to theft |

### 2.3 Non-Goals (Out of Scope)

Explicitly out of scope for MVP:

- **No legal advice**: Platform provides education, not legal counsel
- **No state laws**: MVP covers federal laws only
- **No case law**: Judicial decisions deferred to post-MVP
- **No document generation**: Contract templates are future scope
- **No lawyer directory**: Professional referrals deferred
- **No offline-first**: Basic PWA caching only, not full offline
- **No multi-language**: English only for MVP
- **No dark mode**: Light mode only initially

---

## 3. User Personas

### Persona 1: Adaeze Okonkwo (The Tenant)

| Attribute | Description |
|-----------|-------------|
| Demographics | 28, Marketing Executive, Lagos, University Graduate |
| Goals | Understand her rights when landlord threatens eviction |
| Pain Points | Feels powerless against landlord; lawyers too expensive |
| Behaviors | Searches Google, asks friends, active on social media |
| Needs | Clear explanation of Lagos Tenancy Law, practical steps |

### Persona 2: Chukwuemeka Eze (The SME Owner)

| Attribute | Description |
|-----------|-------------|
| Demographics | 35, Logistics Business Owner, Port Harcourt, HND Graduate |
| Goals | Register business properly, understand tax obligations |
| Pain Points | CAMA seems overwhelming; fears CAC process |
| Behaviors | Uses WhatsApp heavily, prefers mobile, learns by doing |
| Needs | Step-by-step business registration guide, tax basics |

### Persona 3: Tunde Afolabi (The Employee)

| Attribute | Description |
|-----------|-------------|
| Demographics | 42, Factory Supervisor, Kano, Secondary School |
| Goals | Know his rights after sudden termination |
| Pain Points | Employer says termination was legal; can't afford lawyer |
| Behaviors | Uses basic smartphone, limited data, prefers simple interfaces |
| Needs | Labour Act explanation in plain language, what to do next |

### Persona 4: Ngozi Amadi (The Concerned Citizen)

| Attribute | Description |
|-----------|-------------|
| Demographics | 22, University Student, Enugu, Undergraduate |
| Goals | Understand constitutional rights during police encounters |
| Pain Points | Friends arrested arbitrarily; doesn't know legal recourse |
| Behaviors | Active on Twitter, consumes video content, shares information |
| Needs | Know your rights guide, what police can/cannot do |

### Persona 5: Kelechi Obi (The Content Creator)

| Attribute | Description |
|-----------|-------------|
| Demographics | 24, YouTuber/Music Producer, Lagos, Self-taught |
| Goals | Protect his music and video content from theft |
| Pain Points | People repost his content without credit; doesn't understand copyright |
| Behaviors | Heavy social media user, creates daily content, collaborates with other creators |
| Needs | Copyright basics, how to handle content theft, licensing fundamentals |

---

## 4. Functional Requirements

### 4.1 Core Features (P0 - MVP)

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-001 | Browse Laws | P0 | User can view list of 7 core laws + 2 supplementary with sections |
| FR-002 | Read Sections | P0 | User can read full legal text of any section |
| FR-003 | AI Explanations | P0 | User sees plain-language explanation with examples |
| FR-004 | Scenario Discovery | P0 | User can find relevant laws via life situations |
| FR-005 | Search | P0 | User can search across all laws and scenarios |
| FR-006 | Authentication | P0 | User can sign in via Google or magic link |
| FR-007 | Bookmarks | P0 | Authenticated user can save sections for later |
| FR-008 | Feedback | P0 | User can rate explanations helpful/not helpful |
| FR-009 | Legal Disclaimer | P0 | All explanations show mandatory disclaimer |
| FR-010 | Mobile Responsive | P0 | Full functionality on mobile devices |

### 4.2 Secondary Features (P1 - Post-MVP)

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-011 | Search History | P1 | User can view recent searches |
| FR-012 | Related Sections | P1 | System suggests related legal provisions |
| FR-013 | Share | P1 | User can share section via link or social |
| FR-014 | Print/PDF | P1 | User can export explanation to PDF |
| FR-015 | Accessibility | P1 | WCAG 2.1 AA compliant |

### 4.3 Future Considerations (P2)

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-016 | State Laws | P2 | Add state-specific laws |
| FR-017 | Case Law | P2 | Judicial interpretations |
| FR-018 | Document Templates | P2 | Basic legal forms |
| FR-019 | Lawyer Directory | P2 | Referral system |
| FR-020 | Offline Mode | P2 | Full offline capability |
| FR-021 | Multi-language | P2 | Pidgin, Yoruba, Hausa, Igbo |

---

## 5. Non-Functional Requirements

### 5.1 Performance

| Metric | Target |
|--------|--------|
| Time to First Byte (TTFB) | < 200ms |
| First Contentful Paint (FCP) | < 1.5s |
| Largest Contentful Paint (LCP) | < 2.5s |
| Time to Interactive (TTI) | < 3.5s |
| Cumulative Layout Shift (CLS) | < 0.1 |
| API Response Time | < 200ms (p95) |
| AI Explanation Generation | < 5s (first token) |
| Search Results | < 500ms |

### 5.2 Security

| Requirement | Implementation |
|-------------|----------------|
| Authentication | Supabase Auth (OAuth 2.0 + Magic Links) |
| Authorization | Row Level Security (RLS) in Supabase |
| Data Encryption | TLS 1.3 in transit, AES-256 at rest |
| API Security | Rate limiting, input validation, CORS |
| Secrets Management | Environment variables (Vercel) |
| Compliance | NDPR (Nigerian Data Protection Regulation) |

### 5.3 Scalability

| Metric | Current | Target |
|--------|---------|--------|
| Concurrent Users | 100 | 1,000 |
| Daily Active Users | 1,000 | 10,000 |
| Database Size | 100MB | 10GB |
| API Requests/day | 10,000 | 100,000 |

### 5.4 Reliability

| Metric | Target |
|--------|--------|
| Uptime | 99.9% |
| Recovery Time Objective (RTO) | 1 hour |
| Recovery Point Objective (RPO) | 24 hours |
| Error Rate | < 0.1% |
| Mean Time to Recovery (MTTR) | 30 minutes |

---

## 6. User Experience

### 6.1 Entry Points

- **Primary**: Direct URL (lawmadesimple.ng)
- **Secondary**: Google Search results
- **Tertiary**: Social media shares, PWA home screen

### 6.2 Core User Flows

#### Flow 1: Scenario-Based Discovery (Primary)

1. User lands on homepage
2. User sees featured scenarios or browses by category
3. User selects scenario (e.g., "My landlord wants to evict me")
4. System displays relevant legal sections with AI explanations
5. User reads explanation with practical examples
6. User bookmarks section (if authenticated) or shares

#### Flow 2: Direct Law Browsing

1. User navigates to "Browse Laws"
2. User selects a law (e.g., Constitution)
3. User browses sections/chapters
4. User selects specific section
5. User reads legal text + AI explanation
6. User provides feedback (helpful/not helpful)

#### Flow 3: Search

1. User enters query in search bar
2. System shows autocomplete suggestions
3. User submits search
4. System displays ranked results (laws, sections, scenarios)
5. User selects result
6. User views content with explanation

#### Flow 4: Authentication

1. User clicks "Sign In"
2. User chooses Google or Magic Link
3. System authenticates via Supabase
4. User redirected back with session
5. User accesses bookmarks, personalization

### 6.3 UI/UX Highlights

- **Design System**: "Warm Trust" theme
  - Primary: Teal (#1A5F7A) - trust, professionalism
  - Accent: Gold (#F4B942) - Nigerian heritage, warmth
  - Background: Warm White (#FAFAF8)
  - Text: Charcoal (#2D2D2D)
- **Typography**: Inter (UI), Merriweather (legal text)
- **Key Interactions**:
  - Skeleton loaders during AI generation
  - Streaming text for explanations
  - Toast notifications for actions
  - Smooth page transitions
- **Accessibility**: WCAG 2.1 AA compliance target

---

## 7. Narrative

*"As Adaeze, a tenant facing eviction threats from my landlord, I open LawMadeSimple and immediately see 'My landlord wants to evict me' as a featured scenario. I tap it and within seconds, I'm reading a clear explanation of Lagos Tenancy Law in plain English—not legal jargon. The explanation tells me my landlord must give me 6 months' notice for a yearly tenancy, and shows me a practical example of what proper notice looks like. I bookmark this section to reference later and feel empowered knowing my rights. For the first time, I understand that my landlord can't just throw me out tomorrow."*

---

## 8. Success Metrics

### 8.1 User-Centric Metrics

| Metric | Measurement | Baseline | Target |
|--------|-------------|----------|--------|
| User Satisfaction | NPS Survey | N/A | > 50 |
| Task Completion Rate | Analytics | N/A | > 90% |
| Explanation Helpfulness | Feedback Ratio | N/A | > 80% helpful |
| Return User Rate | Analytics | N/A | > 40% |
| Average Session Duration | Analytics | N/A | > 3 minutes |

### 8.2 Business Metrics

| Metric | Measurement | Target |
|--------|-------------|--------|
| Monthly Active Users | Analytics | 10,000 (Year 1) |
| User Signups | Auth Events | 5,000 (Year 1) |
| Scenarios Viewed | Analytics | 50,000/month |
| Explanations Generated | API Logs | 100,000/month |

### 8.3 Technical Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Uptime | 99.9% | Vercel Status |
| Error Rate | < 0.1% | Sentry |
| Page Load (LCP) | < 2.5s | Vercel Analytics |
| API Latency (p95) | < 200ms | Monitoring |
| AI Response Time | < 5s first token | Logs |

---

## 9. Technical Considerations

### 9.1 Architecture Overview

Serverless monolith architecture deployed on Vercel, leveraging edge functions for global performance. The architecture prioritizes simplicity for solo development while maintaining scalability through Vercel's auto-scaling infrastructure.

**Key Components:**
- Next.js App Router (frontend + API routes)
- Supabase (PostgreSQL database + Auth)
- Prisma ORM (type-safe database access)
- Vercel AI SDK (streaming AI responses)
- OpenAI GPT-4o (explanation generation)

### 9.2 Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Frontend | Next.js 14+, React 18 | App Router, RSC, excellent DX |
| Styling | Tailwind CSS, shadcn/ui | Rapid development, accessible components |
| Backend | Next.js API Routes | Unified codebase, serverless |
| Database | Supabase (PostgreSQL) | Managed, RLS, real-time capable |
| ORM | Prisma | Type safety, migrations, DX |
| Auth | Supabase Auth | OAuth, magic links, session management |
| AI | OpenAI GPT-4o | Best quality, streaming support |
| AI SDK | Vercel AI SDK | Streaming, edge-compatible |
| Hosting | Vercel | Auto-scaling, edge network, CI/CD |
| Monitoring | Vercel Analytics, Sentry | Performance + error tracking |

### 9.3 Integration Points

| System | Purpose | Protocol |
|--------|---------|----------|
| Supabase Auth | Authentication | OAuth 2.0 / PKCE |
| Supabase Database | Data persistence | PostgreSQL (Prisma) |
| OpenAI API | AI explanations | REST (streaming) |
| Vercel | Hosting, CI/CD | Git integration |
| Sentry | Error tracking | SDK integration |

### 9.4 Data Storage & Privacy

**Key Entities:**
- Law, Section, Article (legal content)
- Scenario, ScenarioSection (discovery mapping)
- User, Bookmark, Feedback (user features)
- Explanation (AI cache)
- SearchLog (analytics)

**PII Handling:**
- User email stored in Supabase Auth
- Preferences stored as JSONB in User table
- Search logs anonymized after 30 days
- Full data export available (NDPR compliance)

**Data Retention:**
- Legal content: Indefinite
- User accounts: Until deletion requested
- Explanations: 30 days cache, then regenerate
- Search logs: 90 days, then aggregate

---

## 10. Milestones & Sequencing

### 10.1 Phased Delivery

#### Phase 1: Foundation (Week 1-2)
**Focus**: Project setup, infrastructure, CI/CD

**Deliverables:**
- Next.js project with TypeScript strict mode
- Supabase project with Prisma schema
- Vercel deployment with preview environments
- Basic CI/CD (lint, typecheck, build)
- Health check endpoint deployed

#### Phase 2: Core Backend (Week 3-4)
**Focus**: Database, API, authentication

**Deliverables:**
- Database migrations applied
- Seed data for 1 law (Constitution)
- API routes for laws, sections
- Supabase Auth integration
- Rate limiting middleware

#### Phase 3: AI Integration (Week 5-6)
**Focus**: Explanation generation, caching

**Deliverables:**
- OpenAI integration with streaming
- Explanation caching in database
- Prompt engineering for quality
- Feedback collection endpoint
- Disclaimer injection

#### Phase 4: Frontend Core (Week 7-9)
**Focus**: Main UI, law browsing, explanations

**Deliverables:**
- Homepage with featured scenarios
- Law browser (list, detail, section views)
- Explanation display with streaming
- Search with suggestions
- Mobile-responsive layouts

#### Phase 5: User Features (Week 10-11)
**Focus**: Authentication, bookmarks, personalization

**Deliverables:**
- Sign in/out flows
- Bookmark CRUD
- User preferences
- Protected routes
- Session management

#### Phase 6: Polish & Launch (Week 12)
**Focus**: Testing, content, launch prep

**Deliverables:**
- Seed data for all 7 core laws + 2 supplementary IP laws
- 50+ core scenarios mapped (including IP scenarios for creatives)
- Performance optimization
- Error handling polish
- Launch checklist complete

### 10.2 Dependencies

| Milestone | Depends On | Blocking |
|-----------|------------|----------|
| Core Backend | Foundation complete | AI Integration, Frontend |
| AI Integration | Core Backend (content to explain) | Frontend explanation views |
| Frontend Core | Core Backend (APIs) | User Features |
| User Features | Frontend Core (UI), Core Backend (Auth) | Polish & Launch |
| Polish & Launch | All phases complete | Public launch |

---

## 11. User Stories

### Epic 1: Law Discovery

#### US-1.1: Browse Available Laws
**As a** user
**I want to** see a list of all available laws
**So that** I can find the law relevant to my situation

**Acceptance Criteria:**
- [ ] Given I'm on the homepage, when I navigate to "Browse Laws", then I see cards for all 6 laws
- [ ] Given I see the law list, when I view a law card, then I see title, category, and section count
- [ ] Given I see the law list, when I click a law card, then I navigate to that law's detail page

**Priority**: P0
**Dependencies**: None

#### US-1.2: Browse Law Sections
**As a** user
**I want to** browse sections within a law
**So that** I can find the specific provision I need

**Acceptance Criteria:**
- [ ] Given I'm on a law detail page, when I view sections, then I see them organized hierarchically
- [ ] Given I see sections, when I click a section, then I see its full content
- [ ] Given a section has subsections, when I view it, then I can expand/collapse children

**Priority**: P0
**Dependencies**: US-1.1

#### US-1.3: Read Section Content
**As a** user
**I want to** read the full text of a legal section
**So that** I can understand exactly what the law says

**Acceptance Criteria:**
- [ ] Given I'm on a section page, when it loads, then I see the official legal text
- [ ] Given I see the legal text, when I scroll, then article numbers are clearly visible
- [ ] Given I'm reading, when I see legal terms, then formatting helps readability

**Priority**: P0
**Dependencies**: US-1.2

---

### Epic 2: AI Explanations

#### US-2.1: View AI Explanation
**As a** user
**I want to** see a plain-language explanation of a legal section
**So that** I can understand what the law means for me

**Acceptance Criteria:**
- [ ] Given I'm on a section page, when I click "Explain", then I see an AI-generated explanation
- [ ] Given explanation is generating, when streaming, then text appears progressively
- [ ] Given explanation is complete, when I read it, then it includes practical examples
- [ ] Given any explanation, when displayed, then legal disclaimer is always visible

**Priority**: P0
**Dependencies**: US-1.3

#### US-2.2: Provide Feedback on Explanation
**As a** user
**I want to** rate whether an explanation was helpful
**So that** the platform can improve over time

**Acceptance Criteria:**
- [ ] Given I see an explanation, when I click thumbs up/down, then my feedback is recorded
- [ ] Given I provide feedback, when I want to elaborate, then I can add a comment
- [ ] Given I already rated, when I view again, then my previous rating is shown

**Priority**: P0
**Dependencies**: US-2.1

#### US-2.3: See Cached Explanation
**As a** user
**I want to** see previously generated explanations instantly
**So that** I don't wait for AI every time

**Acceptance Criteria:**
- [ ] Given an explanation exists in cache, when I request it, then it loads immediately
- [ ] Given a cached explanation, when I view it, then I can request regeneration
- [ ] Given cache is expired, when I request, then new explanation is generated

**Priority**: P0
**Dependencies**: US-2.1

---

### Epic 3: Scenario-Based Discovery

#### US-3.1: Browse Scenarios
**As a** user
**I want to** browse common legal situations
**So that** I can find relevant laws without knowing legal terms

**Acceptance Criteria:**
- [ ] Given I'm on the homepage, when I scroll, then I see featured scenarios
- [ ] Given I click "All Scenarios", when page loads, then I see scenarios by category
- [ ] Given I see a scenario, when I view it, then the title describes a relatable situation

**Priority**: P0
**Dependencies**: None

#### US-3.2: View Scenario Details
**As a** user
**I want to** see which laws apply to my situation
**So that** I can understand my legal position

**Acceptance Criteria:**
- [ ] Given I click a scenario, when page loads, then I see scenario description
- [ ] Given I'm on scenario page, when I scroll, then I see relevant legal sections
- [ ] Given relevant sections, when displayed, then they include relevance notes
- [ ] Given relevant sections, when I click one, then I navigate to that section

**Priority**: P0
**Dependencies**: US-3.1

---

### Epic 4: Search

#### US-4.1: Search for Content
**As a** user
**I want to** search across all laws and scenarios
**So that** I can quickly find what I need

**Acceptance Criteria:**
- [ ] Given I'm on any page, when I click search, then search modal opens
- [ ] Given search modal, when I type 2+ characters, then suggestions appear
- [ ] Given I submit search, when results load, then they show laws, sections, scenarios
- [ ] Given results, when displayed, then relevant text is highlighted

**Priority**: P0
**Dependencies**: US-1.1, US-3.1

#### US-4.2: Filter Search Results
**As a** user
**I want to** filter search results by type and category
**So that** I can narrow down to relevant results

**Acceptance Criteria:**
- [ ] Given search results, when I click filter, then I see filter options
- [ ] Given filters, when I select "Laws only", then only law results show
- [ ] Given filters, when I select a category, then results are filtered

**Priority**: P1
**Dependencies**: US-4.1

---

### Epic 5: Authentication

#### US-5.1: Sign In with Google
**As a** user
**I want to** sign in with my Google account
**So that** I can save my progress without creating a password

**Acceptance Criteria:**
- [ ] Given I'm on sign-in page, when I click "Sign in with Google", then OAuth flow starts
- [ ] Given OAuth succeeds, when redirected back, then I'm signed in
- [ ] Given OAuth fails, when redirected back, then I see error message

**Priority**: P0
**Dependencies**: None

#### US-5.2: Sign In with Magic Link
**As a** user
**I want to** sign in via email link
**So that** I can access my account without Google

**Acceptance Criteria:**
- [ ] Given I'm on sign-in page, when I enter email, then magic link is sent
- [ ] Given link sent, when I click it, then I'm signed in
- [ ] Given link expired, when I click it, then I see helpful error

**Priority**: P0
**Dependencies**: None

#### US-5.3: Sign Out
**As a** signed-in user
**I want to** sign out of my account
**So that** I can secure my session on shared devices

**Acceptance Criteria:**
- [ ] Given I'm signed in, when I click profile menu, then I see "Sign Out"
- [ ] Given I click "Sign Out", when action completes, then session is cleared
- [ ] Given session cleared, when I try protected action, then prompted to sign in

**Priority**: P0
**Dependencies**: US-5.1 or US-5.2

---

### Epic 6: Bookmarks

#### US-6.1: Bookmark a Section
**As a** signed-in user
**I want to** save sections for later
**So that** I can quickly return to important content

**Acceptance Criteria:**
- [ ] Given I'm viewing a section, when I click bookmark icon, then section is saved
- [ ] Given I bookmark, when action succeeds, then icon changes to filled state
- [ ] Given I'm not signed in, when I click bookmark, then prompted to sign in

**Priority**: P0
**Dependencies**: US-5.1, US-1.3

#### US-6.2: View My Bookmarks
**As a** signed-in user
**I want to** see all my saved bookmarks
**So that** I can access my curated content

**Acceptance Criteria:**
- [ ] Given I'm signed in, when I go to Saved Items, then I see my bookmarks
- [ ] Given bookmarks exist, when displayed, then I see title, law, and date saved
- [ ] Given a bookmark, when I click it, then I navigate to that content

**Priority**: P0
**Dependencies**: US-6.1

#### US-6.3: Remove Bookmark
**As a** signed-in user
**I want to** remove a bookmark
**So that** I can keep my saved items relevant

**Acceptance Criteria:**
- [ ] Given I'm viewing bookmarks, when I click remove, then bookmark is deleted
- [ ] Given bookmark removed, when page updates, then item disappears
- [ ] Given I'm on bookmarked section, when I click filled bookmark, then it's removed

**Priority**: P0
**Dependencies**: US-6.2

---

### Epic 7: Mobile Experience

#### US-7.1: Responsive Layout
**As a** mobile user
**I want to** use the full app on my phone
**So that** I can access legal information anywhere

**Acceptance Criteria:**
- [ ] Given I'm on mobile, when viewing any page, then layout is readable
- [ ] Given mobile layout, when I navigate, then touch targets are adequate (44px+)
- [ ] Given mobile, when I search, then keyboard doesn't obstruct results

**Priority**: P0
**Dependencies**: All frontend stories

#### US-7.2: PWA Installation
**As a** mobile user
**I want to** install the app to my home screen
**So that** I can access it like a native app

**Acceptance Criteria:**
- [ ] Given I visit on mobile, when criteria met, then install prompt appears
- [ ] Given I install, when I open from home screen, then app loads in standalone mode
- [ ] Given PWA installed, when offline, then cached pages are available

**Priority**: P1
**Dependencies**: US-7.1

---

## 12. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| AI generates incorrect legal info | Medium | High | Strong disclaimers, feedback loop, human review process |
| Low user adoption | Medium | High | SEO optimization, social sharing, scenario-first discovery |
| OpenAI API costs exceed budget | Medium | Medium | Aggressive caching, GPT-4o-mini for simple queries |
| Supabase free tier limits | Low | Medium | Monitor usage, upgrade path defined |
| Legal content accuracy | Medium | High | Source from official publications, version tracking |
| Solo developer availability | Medium | Medium | Comprehensive documentation, modular architecture |
| Nigerian internet connectivity | High | Medium | PWA caching, optimized assets, skeleton loading |

---

## 13. Open Questions

| Question | Owner | Due Date | Resolution |
|----------|-------|----------|------------|
| Source for official law text? | Developer | Before content phase | Pending - evaluate Nigerian-Law.org, LawPavilion |
| OpenAI vs Claude for explanations? | Developer | Before AI phase | Current decision: OpenAI GPT-4o |
| Custom domain (lawmadesimple.ng)? | Developer | Before launch | Pending - research .ng domain process |
| Analytics tool selection? | Developer | Foundation phase | Leaning: Vercel Analytics (simple) |
| Content moderation for feedback? | Developer | Before launch | Pending - manual review initially |

---

## Appendices

### A. Requirements Traceability

See `docs/pre-dev/09-requirements-traceability-matrix.md` for full mapping from business objectives → requirements → user stories.

### B. Architecture Diagrams

See `docs/pre-dev/13-architecture-diagram.md` for:
- C4 Context Diagram
- C4 Container Diagram
- Data Flow Diagrams
- Deployment Architecture

### C. API Specifications

See `docs/pre-dev/18-api-specifications.md` for:
- Complete REST API documentation
- Request/response formats
- Authentication details
- Rate limiting policies

### D. Data Dictionary

See `docs/pre-dev/20-data-dictionary.md` for:
- Entity definitions
- Attribute specifications
- Validation rules
- NDPR compliance details

### E. Design Specifications

See `docs/design/21-frontend-design-spec.md` for:
- Design system tokens
- Component specifications
- Screen wireframes
- Responsive breakpoints

---

*Generated: January 27, 2026*
*Next Step: Run `/plan` to generate implementation task breakdown*
