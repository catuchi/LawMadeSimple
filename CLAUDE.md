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
  gaps-and-considerations.md  # Identified gaps and risks
  competitor-analysis.md      # Market research
  tech-stack.md              # Tech decisions with rationale
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

Phase 1: Requirements Gathering (post-ideation)
