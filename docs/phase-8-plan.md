# Phase 8: Content & Data - Implementation Plan

> **Project:** LawMadeSimple
> **Created:** February 5, 2026
> **Status:** IN PROGRESS - Phase 8a COMPLETE, Phase 8b next
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

**Seed Results:**
- 4 laws seeded
- 16 sections seeded (13 Constitution + 3 placeholders)
- 23 scenarios seeded
- 51 scenario-section mappings created
- All embeddings generated (16 sections + 23 scenarios)

### ⏳ Pending Phases

- **Phase 8b:** Expand Constitution content (add more sections from Chapter IV)
- **Phase 8c:** Criminal Code content (15-20 sections, 4-5 scenarios)
- **Phase 8d:** Labour Act content (15-20 sections, 4-5 scenarios)
- **Phase 8e:** Lagos Tenancy content (10-15 sections, 3-4 scenarios)
- **Phase 8f:** Update homepage links to `/scenarios?category=X`
- **Phase 8g:** Final testing and verification

---

## How to Resume

Tell Claude: **"Continue Phase 8 from checkpoint 8b - read docs/phase-8-plan.md for context"**

### Next Steps (Phase 8b - Criminal Code):
1. Extract 15-20 relevant sections from Criminal Code PDF
2. Add sections to `prisma/data/laws/criminal-code.ts`
3. Update scenarios in `police-encounters.ts` with Criminal Code mappings
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
│   │   ├── criminal-code.ts     # 🔄 Placeholder (1 section)
│   │   ├── labour-act.ts        # 🔄 Placeholder (1 section)
│   │   └── lagos-tenancy.ts     # 🔄 Placeholder (1 section)
│   └── scenarios/
│       ├── index.ts             # ✅ Exports all scenarios
│       ├── constitutional-rights.ts  # ✅ 6 scenarios
│       ├── police-encounters.ts      # ✅ 6 scenarios
│       ├── tenant-rights.ts          # ✅ 5 scenarios
│       └── employment.ts             # ✅ 6 scenarios
└── helpers/
    └── seed-utils.ts            # ✅ Upsert helpers
```

---

## Content Summary

### Laws Seeded

| Law | Status | Sections | Notes |
|-----|--------|----------|-------|
| Constitution 1999 | ✅ Ready | 13 | Sections 33-44, 46 (Fundamental Rights) |
| Criminal Code | 🔄 Placeholder | 1 | Needs 15-20 sections in Phase 8c |
| Labour Act | 🔄 Placeholder | 1 | Needs 15-20 sections in Phase 8d |
| Lagos Tenancy Law | 🔄 Placeholder | 1 | Needs 10-15 sections in Phase 8e |

### Scenarios Seeded (23 total)

| Category | Count | Examples |
|----------|-------|----------|
| Constitutional Rights | 6 | Freedom of expression, religious discrimination, privacy |
| Police Encounters | 6 | Arrest without warrant, detention, brutality, bribery |
| Tenant Rights | 5 | Eviction, lockout, rent increase, deposit disputes |
| Employment | 6 | Wrongful termination, unpaid wages, harassment, maternity |

---

## Homepage Update (Phase 8f)

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
| Criminal Code Act | https://lawsofnigeria.placng.org/laws/C1.pdf |
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
