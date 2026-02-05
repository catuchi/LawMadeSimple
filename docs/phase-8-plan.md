# Phase 8: Content & Data - Implementation Plan

> **Project:** LawMadeSimple
> **Created:** February 5, 2026
> **Status:** IN PROGRESS - Phase 8b COMPLETE, Phase 8c next
> **Last Updated:** February 5, 2026

---

## Current Progress

### ✅ Phase 8a: Infrastructure & Foundation — COMPLETE

**Files Created:**
- `prisma/data/types.ts` - TypeScript interfaces for seed data
- `prisma/helpers/seed-utils.ts` - Upsert helpers with logging
- `prisma/data/laws/index.ts` - Laws data index
- `prisma/data/laws/constitution.ts` - Constitution law + 13 fundamental rights sections
- `prisma/data/laws/criminal-code.ts` - Criminal Code placeholder (1 section)
- `prisma/data/laws/labour-act.ts` - Labour Act placeholder (1 section)
- `prisma/data/laws/lagos-tenancy.ts` - Lagos Tenancy Law placeholder (1 section)
- `prisma/data/scenarios/index.ts` - Scenarios data index
- `prisma/data/scenarios/constitutional-rights.ts` - 6 constitutional rights scenarios
- `prisma/data/scenarios/police-encounters.ts` - 6 police encounter scenarios
- `prisma/data/scenarios/tenant-rights.ts` - 5 tenant rights scenarios
- `prisma/data/scenarios/employment.ts` - 6 employment scenarios
- `prisma/seed.ts` - Refactored to use modular imports

### ✅ Phase 8b: Criminal Code Expansion — COMPLETE

**Files Updated/Created:**
- `prisma/data/laws/criminal-code.ts` - Expanded to 18 key sections
- `prisma/data/scenarios/police-encounters.ts` - Updated with Criminal Code mappings
- `prisma/data/scenarios/crime-victims.ts` - NEW: 6 crime victim scenarios
- `prisma/data/scenarios/index.ts` - Updated to include crime-victims

**Criminal Code Sections Added (18 sections):**
| Category | Sections | Topics |
|----------|----------|--------|
| Assault & Harm | 351, 352, 353, 355, 360 | Common assault, ABH, indecent assault, grievous harm |
| Unlawful Detention | 364, 365, 366 | Kidnapping, abduction, wrongful confinement |
| Theft & Receiving | 383, 390, 427 | Definition of stealing, punishment, receiving stolen |
| Trespass | 342, 343 | Criminal trespass, breaking into buildings |
| Defamation | 373, 375 | Definition, publication |
| Robbery & Extortion | 401, 402, 406 | Robbery, armed robbery, extortion |
| Conspiracy | 516, 517, 70 | Conspiracy to felony/misdemeanour, unlawful assembly |

**New Crime Victims Scenarios (6 scenarios):**
- victim-of-assault
- someone-stole-from-me
- i-was-robbed
- someone-defamed-me-online
- someone-broke-into-my-house
- threatened-or-blackmailed

**Seed Results (After Phase 8b):**
- 4 laws seeded
- 37 sections seeded (13 Constitution + 18 Criminal Code + 1 Labour + 1 Lagos + placeholders)
- 29 scenarios seeded
- 82 scenario-section mappings created
- All embeddings generated (37 sections + 29 scenarios)

### ⏳ Pending Phases

- **Phase 8c:** Labour Act content (15-20 sections, update employment scenarios)
- **Phase 8d:** Lagos Tenancy content (10-15 sections, update tenant scenarios)
- **Phase 8e:** Update homepage links to `/scenarios?category=X`
- **Phase 8f:** Final testing and verification

---

## How to Resume

Tell Claude: **"Continue Phase 8 from checkpoint 8c - read docs/phase-8-plan.md for context"**

### Next Steps (Phase 8c - Labour Act):
1. Research Labour Act sections relevant to employment scenarios
2. Add 15-20 sections to `prisma/data/laws/labour-act.ts`
3. Update `prisma/data/scenarios/employment.ts` with Labour Act mappings
4. Run `npm run db:seed` to update database
5. Run embedding backfill

---

## File Structure (Current)

```
prisma/
├── seed.ts                      # ✅ Modular seed script
├── data/
│   ├── types.ts                 # ✅ TypeScript interfaces
│   ├── laws/
│   │   ├── index.ts             # ✅ Exports all laws
│   │   ├── constitution.ts      # ✅ 13 sections (fundamental rights)
│   │   ├── criminal-code.ts     # ✅ 18 sections (expanded in 8b)
│   │   ├── labour-act.ts        # 🔄 Placeholder (1 section)
│   │   └── lagos-tenancy.ts     # 🔄 Placeholder (1 section)
│   └── scenarios/
│       ├── index.ts             # ✅ Exports all scenarios
│       ├── constitutional-rights.ts  # ✅ 6 scenarios
│       ├── police-encounters.ts      # ✅ 6 scenarios (updated mappings)
│       ├── tenant-rights.ts          # ✅ 5 scenarios
│       ├── employment.ts             # ✅ 6 scenarios
│       └── crime-victims.ts          # ✅ 6 scenarios (NEW in 8b)
└── helpers/
    └── seed-utils.ts            # ✅ Upsert helpers
```

---

## Content Summary

### Laws Seeded

| Law | Status | Sections | Notes |
|-----|--------|----------|-------|
| Constitution 1999 | ✅ Ready | 13 | Sections 33-44, 46 (Fundamental Rights) |
| Criminal Code | ✅ Expanded | 18 | Assault, theft, robbery, defamation, etc. |
| Labour Act | 🔄 Placeholder | 1 | Needs 15-20 sections in Phase 8c |
| Lagos Tenancy Law | 🔄 Placeholder | 1 | Needs 10-15 sections in Phase 8d |

### Scenarios Seeded (29 total)

| Category | Count | Examples |
|----------|-------|----------|
| Constitutional Rights | 6 | Freedom of expression, religious discrimination, privacy |
| Police Encounters | 6 | Arrest without warrant, detention, brutality, bribery |
| Tenant Rights | 5 | Eviction, lockout, rent increase, deposit disputes |
| Employment | 6 | Wrongful termination, unpaid wages, harassment, maternity |
| Crime Victims | 6 | Assault, theft, robbery, defamation, break-in, blackmail |

---

## Homepage Update (Phase 8e)

Current `src/app/page.tsx` links need updating:

| Current href | New href |
|--------------|----------|
| `/scenarios/landlord-tenant` | `/scenarios?category=property` |
| `/scenarios/police-encounters` | `/scenarios?category=criminal` |
| `/scenarios/employment` | `/scenarios?category=labour` |
| `/scenarios/business` | `/scenarios?category=business` |
| `/scenarios/tax` | `/scenarios?category=tax` |
| `/scenarios/constitutional-rights` | `/scenarios?category=constitution` |
| `/scenarios/copyright` | `/scenarios?category=intellectual_property` |

Also need to add category filter support to `src/app/scenarios/page.tsx`.

---

## PDF Sources for Content Extraction

| Law | PDF URL |
|-----|---------|
| Constitution 1999 | https://placng.org/i/wp-content/uploads/2023/11/Constitution-of-the-Federal-Republic-of-Nigeria-1999-Updated.pdf |
| Criminal Code Act | https://lawsofnigeria.placng.org/laws/C38.pdf |
| Labour Act | https://lawsofnigeria.placng.org/laws/L1.pdf |
| Lagos Tenancy Law 2011 | http://lagosministryofjustice.org/wp-content/uploads/2022/01/Tenancy-Law-2011.pdf |

---

## Verification Commands

```bash
# Check TypeScript compilation
npm run typecheck

# Run seed script
npm run db:seed

# Check database content
npm run db:studio

# Check embedding status
DOTENV_CONFIG_PATH=.env.local npx tsx -r dotenv/config scripts/backfill-embeddings.ts --stats

# Run embedding backfill
DOTENV_CONFIG_PATH=.env.local npx tsx -r dotenv/config scripts/backfill-embeddings.ts
```
