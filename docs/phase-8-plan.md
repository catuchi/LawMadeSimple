# Phase 8: Content & Data - Implementation Plan

> **Project:** LawMadeSimple
> **Created:** February 5, 2026
> **Status:** IN PROGRESS - Phase 8c COMPLETE, Phase 8d next
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

### ✅ Phase 8c: Labour Act Expansion — COMPLETE

**Files Updated:**
- `prisma/data/laws/labour-act.ts` - Expanded from 1 to 17 key sections
- `prisma/data/scenarios/employment.ts` - Updated from 6 to 8 scenarios with Labour Act mappings

**Labour Act Sections Added (17 sections):**
| Category | Sections | Topics |
|----------|----------|--------|
| Wages & Payment | 1, 5 | Legal tender, permitted deductions |
| Contracts | 7, 9, 10 | Written particulars, general provisions, transfer |
| Termination | 11, 12, 17, 20 | Notice periods, common employment, duty to provide work, redundancy |
| Hours & Leave | 13, 16, 18, 19 | Working hours, sick leave, annual holidays, leave pay calculation |
| Women's Protections | 54, 55 | Maternity protection, night work restrictions |
| Young Persons | 59, 60 | General protections, school hours restrictions |

**Employment Scenarios Updated (8 scenarios):**
- wrongful-termination (6 mappings including Labour Act Sections 7, 11, 17, 20)
- unpaid-wages (6 mappings including Labour Act Sections 1, 5, 9, 17)
- workplace-harassment (5 mappings including Labour Act Sections 9, 12)
- denied-annual-leave (4 mappings including Labour Act Sections 18, 19)
- workplace-injury (6 mappings including Labour Act Sections 9, 12, 16)
- maternity-rights (4 mappings including Labour Act Sections 54, 55)
- no-written-contract (NEW - 4 mappings including Labour Act Sections 7, 9, 11)
- excessive-working-hours (NEW - 3 mappings including Labour Act Section 13)

**Seed Results (After Phase 8c):**
- 4 laws seeded
- 53 sections seeded (13 Constitution + 22 Criminal Code + 17 Labour + 1 Lagos)
- 31 scenarios seeded
- 108 scenario-section mappings created
- All embeddings generated (53 sections + 31 scenarios)

### ⏳ Pending Phases

- **Phase 8d:** Lagos Tenancy content (10-15 sections, update tenant scenarios)
- **Phase 8e:** Update homepage links to `/scenarios?category=X`
- **Phase 8f:** Final testing and verification

---

## How to Resume

Tell Claude: **"Continue Phase 8 from checkpoint 8d - read docs/phase-8-plan.md for context"**

### Next Steps (Phase 8d - Lagos Tenancy Law):
1. Research Lagos Tenancy Law 2011 sections relevant to tenant scenarios
2. Add 10-15 sections to `prisma/data/laws/lagos-tenancy.ts`
3. Update `prisma/data/scenarios/tenant-rights.ts` with Lagos Tenancy Law mappings
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
│   │   ├── criminal-code.ts     # ✅ 22 sections (expanded in 8b)
│   │   ├── labour-act.ts        # ✅ 17 sections (expanded in 8c)
│   │   └── lagos-tenancy.ts     # 🔄 Placeholder (1 section)
│   └── scenarios/
│       ├── index.ts             # ✅ Exports all scenarios
│       ├── constitutional-rights.ts  # ✅ 6 scenarios
│       ├── police-encounters.ts      # ✅ 6 scenarios (updated mappings)
│       ├── tenant-rights.ts          # ✅ 5 scenarios
│       ├── employment.ts             # ✅ 8 scenarios (expanded in 8c)
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
| Criminal Code | ✅ Expanded | 22 | Assault, theft, robbery, defamation, etc. |
| Labour Act | ✅ Expanded | 17 | Contracts, wages, termination, maternity, etc. |
| Lagos Tenancy Law | 🔄 Placeholder | 1 | Needs 10-15 sections in Phase 8d |

### Scenarios Seeded (31 total)

| Category | Count | Examples |
|----------|-------|----------|
| Constitutional Rights | 6 | Freedom of expression, religious discrimination, privacy |
| Police Encounters | 6 | Arrest without warrant, detention, brutality, bribery |
| Tenant Rights | 5 | Eviction, lockout, rent increase, deposit disputes |
| Employment | 8 | Wrongful termination, unpaid wages, maternity, excessive hours |
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
