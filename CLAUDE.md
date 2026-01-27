# LawMadeSimple

Democratizing Nigerian law by translating legal jargon into plain, easy-to-understand language with practical examples.

## Quick Context

- **Target Users:** Common Nigerians + SMEs
- **Platform:** Next.js web app with PWA
- **AI Approach:** AI-only with disclaimers (hybrid when budget allows)
- **Business Model:** Freemium
- **Developer:** Solo developer

## Tech Stack

- **Frontend:** Next.js 14+, React, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API Routes
- **Database:** Supabase (PostgreSQL) + Prisma ORM
- **Auth:** Supabase Auth (OAuth + magic links)
- **AI:** OpenAI API (GPT-4o/mini) + Vercel AI SDK
- **Hosting:** Vercel

## MVP Scope

Federal laws only (6 core):
1. Constitution of Nigeria (key rights)
2. Criminal Code Act (police interactions)
3. CAMA (business registration)
4. Labour Act (employment)
5. Tenancy provisions
6. FIRS Act (tax basics)

## Key Differentiator

Not just law access, but law *comprehension*:
- Plain language explanations
- Practical examples
- Scenario-based discovery ("I'm dealing with...")

## Project Structure

```
docs/
  pre-dev/                    # 11 planning documents (Phase 1 requirements)
  design/                     # UI/UX design specs (Phase 3)
  gaps-and-considerations.md  # Identified gaps and risks
  competitor-analysis.md      # Market research
  tech-stack.md              # Tech decisions with rationale
design inspirations/          # Reference designs and mood board
```

## Development Guidelines

- Quality over speed
- Strong disclaimers required on all legal content
- Mobile-responsive design mandatory
- Accessibility (WCAG compliance)
- NDPR compliance for data handling

## Commands

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build

# Type check
npm run typecheck

# Lint
npm run lint
```

## Current Phase

**Phase 4: Architecture** — Pre-dev Complete, Ready for PRD

### Progress
- ✅ Phase 0: Ideation — Complete
- ✅ Phase 1: Requirements — **Approved** (11 docs in `docs/pre-dev/`)
- ✅ Phase 2: Research — Complete (`competitor-analysis.md`, `tech-stack.md`)
- ✅ Phase 3: Design — **Approved** (`docs/design/21-frontend-design-spec.md`)
- ✅ Phase 4: Architecture — **Pre-dev Complete** (docs 12-20 in `docs/pre-dev/`)
- ⏳ Phase 5: Foundation — Waiting for PRD + Plan

### Key Architecture Decisions
- **Architecture:** Serverless monolith on Vercel
- **Database:** PostgreSQL via Supabase + Prisma ORM
- **Auth:** Supabase Auth (Google OAuth + Magic Links)
- **AI:** OpenAI GPT-4o + Vercel AI SDK (streaming)
- **Design:** Warm Trust (Teal #1A5F7A + Gold #F4B942), Light mode only

### Pre-dev Documents (20/20 Complete)
- 01-11: Business, requirements, validation
- 12-15: System architecture, diagrams, tech stack, deployment
- 16-20: System design, ERD, API specs, UML, data dictionary

### Next Action
1. Run `/prd` to generate Product Requirements Document
2. Run `/plan` to generate task breakdown
3. Begin Phase 5: Foundation (project setup, CI/CD, first deploy)
