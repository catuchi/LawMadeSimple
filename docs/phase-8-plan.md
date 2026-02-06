# Phase 8: Content & Data - Implementation Plan

> **Project:** LawMadeSimple
> **Created:** February 5, 2026
> **Status:** ✅ COMPLETE - All phases finished (Feb 6, 2026)
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

### ✅ Phase 8d: Lagos Tenancy Law Expansion — COMPLETE

**Files Updated:**
- `prisma/data/laws/lagos-tenancy.ts` - Expanded from 1 to 13 key sections
- `prisma/data/scenarios/tenant-rights.ts` - Updated from 5 to 7 scenarios with comprehensive Lagos Tenancy Law mappings

**Lagos Tenancy Law Sections Added (13 sections):**
| Category | Sections | Topics |
|----------|----------|--------|
| Rent Limits & Receipts | 4, 5 | Advance rent limits (max 1 year), receipt requirements |
| Tenant Rights | 6 | Exclusive possession, privacy, peaceful enjoyment, 24/7 access |
| Obligations | 7, 8 | Tenant duties (interior maintenance), landlord duties (exterior repairs) |
| Deposits | 10 | Service charges, security deposit refund rules |
| Notice Periods | 13, 15, 16, 17 | Length of notice (1 week to 6 months), abandoned premises, service |
| Rent Increases | 37 | 6-month notice requirement, court assessment of fair rent |
| Offences | 44 | Unlawful eviction penalties (N250,000 fine or 6 months imprisonment) |

**Tenant Rights Scenarios Updated (7 scenarios):**
- landlord-eviction-notice (5 mappings: Lagos Tenancy Sections 13, 16, 44, 17 + Constitution)
- landlord-illegal-lockout (5 mappings: Lagos Tenancy Sections 44, 6, 8 + Constitution)
- rent-increase-dispute (4 mappings: Lagos Tenancy Sections 37, 4, 6 + Constitution)
- deposit-not-returned (5 mappings: Lagos Tenancy Sections 10, 5, 6 + Constitution)
- landlord-not-making-repairs (4 mappings: Lagos Tenancy Sections 8, 7, 6 + Constitution)
- utilities-cut-off (NEW - 4 mappings: Lagos Tenancy Sections 44, 8, 6 + Constitution)
- excessive-advance-rent (NEW - 3 mappings: Lagos Tenancy Sections 4, 5 + Constitution)

**Seed Results (After Phase 8d):**
- 4 laws seeded
- 65 sections seeded (13 Constitution + 22 Criminal Code + 17 Labour + 13 Lagos Tenancy)
- 33 scenarios seeded
- 129 scenario-section mappings created
- All embeddings generated (65 sections + 33 scenarios)

### ✅ Phase 8e: Homepage & Category Links — COMPLETE

**Files Updated:**
- `src/app/page.tsx` - Updated scenarioPills and popularTopics hrefs to use category query params
- `src/app/scenarios/page.tsx` - Added category filter support with filter UI pills

**Homepage Link Updates:**
| Old href | New href |
|----------|----------|
| `/scenarios/landlord-tenant` | `/scenarios?category=property` |
| `/scenarios/police-encounters` | `/scenarios?category=criminal` |
| `/scenarios/employment` | `/scenarios?category=labour` |
| `/scenarios/business` | `/scenarios?category=business` |
| `/scenarios/tax` | `/scenarios?category=tax` |
| `/scenarios/constitutional-rights` | `/scenarios?category=constitution` |
| `/scenarios/copyright` | `/scenarios?category=intellectual_property` |

**Scenarios Page Enhancements:**
- Added `category` query param support for filtering
- Added category filter pills with emoji icons
- Dynamic breadcrumb shows selected category
- Dynamic page title and description based on category
- Category-aware empty state messaging
- Validates category param against LawCategory enum

### ✅ Phase 8f: Final Testing & Verification — COMPLETE

**Verified (Feb 6, 2026):**
- TypeScript compilation passes
- Category filtering: property (7), labour (8), criminal (12), constitution (6) = 33 total
- Search modes: hybrid, semantic, keyword all functional
- Embeddings: 65/65 sections, 33/33 scenarios complete
- AI explanations endpoint working with cached content

---

## Phase 8 Complete

**All content seeding and verification complete!**

### Summary:
- 4 laws seeded (Constitution, Criminal Code, Labour Act, Lagos Tenancy)
- 65 sections with full text content
- 33 real-world scenarios mapped to relevant sections
- 129 scenario-section mappings
- All embeddings generated for semantic search
- Category filtering and search fully functional

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
│   │   └── lagos-tenancy.ts     # ✅ 13 sections (expanded in 8d)
│   └── scenarios/
│       ├── index.ts             # ✅ Exports all scenarios
│       ├── constitutional-rights.ts  # ✅ 6 scenarios
│       ├── police-encounters.ts      # ✅ 6 scenarios (updated mappings)
│       ├── tenant-rights.ts          # ✅ 7 scenarios (expanded in 8d)
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
| Lagos Tenancy Law | ✅ Expanded | 13 | Rent limits, tenant rights, eviction, offences |

### Scenarios Seeded (33 total)

| Category | Count | Examples |
|----------|-------|----------|
| Constitutional Rights | 6 | Freedom of expression, religious discrimination, privacy |
| Police Encounters | 6 | Arrest without warrant, detention, brutality, bribery |
| Tenant Rights | 7 | Eviction, lockout, rent increase, deposit, utilities cut-off |
| Employment | 8 | Wrongful termination, unpaid wages, maternity, excessive hours |
| Crime Victims | 6 | Assault, theft, robbery, defamation, break-in, blackmail |

---

## Homepage Update (Phase 8e) — ✅ COMPLETE

All homepage links have been updated to use category query params:

| Updated href | Category |
|--------------|----------|
| `/scenarios?category=property` | Property & Tenancy |
| `/scenarios?category=criminal` | Criminal Law |
| `/scenarios?category=labour` | Employment |
| `/scenarios?category=business` | Business |
| `/scenarios?category=tax` | Tax |
| `/scenarios?category=constitution` | Constitutional Rights |
| `/scenarios?category=intellectual_property` | Intellectual Property |

Category filter support added to `src/app/scenarios/page.tsx` with:
- Filter pills UI with emoji icons
- Dynamic breadcrumb, title, and description
- Category-aware empty state messaging

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
