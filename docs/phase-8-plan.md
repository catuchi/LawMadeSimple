# Phase 8: Content & Data - Implementation Plan

> **Project:** LawMadeSimple
> **Created:** February 5, 2026
> **Status:** IN PROGRESS - Phase 8a partially complete
> **Plan File:** `/Users/chibu/.claude/plans/cozy-splashing-bonbon.md`

---

## Current Progress (Last Updated: Feb 5, 2026)

### ✅ Completed
- `prisma/data/types.ts` - TypeScript interfaces for seed data
- `prisma/helpers/seed-utils.ts` - Upsert helpers with logging
- `prisma/data/laws/index.ts` - Laws data index (empty, ready for content)
- `prisma/data/scenarios/index.ts` - Scenarios data index (empty, ready for content)

### 🔄 In Progress
- **Phase 8a checkpoint:** Infrastructure created, need to:
  1. Create placeholder law files (constitution.ts, criminal-code.ts, labour-act.ts, lagos-tenancy.ts)
  2. Create placeholder scenario files (constitutional-rights.ts, police-encounters.ts, tenant-rights.ts, employment.ts)
  3. Refactor `prisma/seed.ts` to use modular imports
  4. Verify seed script runs without errors

### ⏳ Pending
- Phase 8b: Constitution content (25-30 sections, 5-6 scenarios)
- Phase 8c: Criminal Code content (15-20 sections, 4-5 scenarios)
- Phase 8d: Labour Act content (15-20 sections, 4-5 scenarios)
- Phase 8e: Lagos Tenancy content (10-15 sections, 3-4 scenarios)
- Phase 8f: Update homepage links to `/scenarios?category=X`
- Phase 8g: Run seed, backfill embeddings, test

---

## How to Resume

Tell Claude: **"Continue Phase 8 from checkpoint 8a - read docs/phase-8-plan.md for context"**

### Next Steps (in order):
1. Create empty law data files with correct structure
2. Create empty scenario data files with correct structure
3. Refactor seed.ts to use the new modular structure
4. Run `npm run db:seed` to verify infrastructure works
5. Then proceed to Phase 8b (Constitution content extraction)

---

## File Structure Created

```
prisma/
├── seed.ts                      # Needs refactoring (currently has sample data)
├── data/
│   ├── types.ts                 # ✅ TypeScript interfaces
│   ├── laws/
│   │   ├── index.ts             # ✅ Exports all laws
│   │   ├── constitution.ts      # ❌ TODO
│   │   ├── criminal-code.ts     # ❌ TODO
│   │   ├── labour-act.ts        # ❌ TODO
│   │   └── lagos-tenancy.ts     # ❌ TODO
│   └── scenarios/
│       ├── index.ts             # ✅ Exports all scenarios
│       ├── constitutional-rights.ts  # ❌ TODO
│       ├── police-encounters.ts      # ❌ TODO
│       ├── tenant-rights.ts          # ❌ TODO
│       └── employment.ts             # ❌ TODO
└── helpers/
    └── seed-utils.ts            # ✅ Upsert helpers
```

---

## Key Types Reference

From `prisma/data/types.ts`:

```typescript
interface LawData {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  category: LawCategory;
  effectiveDate: Date;
  sourceUrl: string;
  isActive?: boolean;
}

interface SectionData {
  slug: string;
  number: string;
  title: string;
  content: string;
  summary: string;
  orderIndex: number;
}

interface LawWithSections {
  law: LawData;
  sections: SectionData[];
}

interface ScenarioData {
  slug: string;
  title: string;
  description: string;
  iconEmoji: string;
  keywords: string[];
  category: LawCategory;
  isFeatured?: boolean;
}

interface ScenarioWithMappings {
  scenario: ScenarioData;
  mappings: { lawSlug: string; sectionSlug: string; relevanceOrder: number; relevanceNote?: string }[];
}
```

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

# Run seed script (after refactoring)
npm run db:seed

# Check database content
npm run db:studio

# Backfill embeddings (after seeding)
DOTENV_CONFIG_PATH=.env.local npx tsx -r dotenv/config scripts/backfill-embeddings.ts
```
