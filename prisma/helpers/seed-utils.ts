/* eslint-disable no-console */
/**
 * Seed utility functions
 * Provides reusable upsert helpers for seeding laws, sections, and scenarios
 */

import { PrismaClient } from '@prisma/client';
import type {
  LawData,
  SectionData,
  ScenarioData,
  ScenarioMappingData,
  SeedResult,
} from '../data/types';

/**
 * Upsert a single law
 * Returns the law record (existing or newly created)
 */
export async function upsertLaw(
  prisma: PrismaClient,
  law: LawData,
  result: SeedResult
): Promise<{ id: string; slug: string } | null> {
  try {
    // Check if law already exists
    const existing = await prisma.law.findUnique({
      where: { slug: law.slug },
      select: { id: true, slug: true },
    });

    if (existing) {
      console.log(`   ⏭️  Law exists, skipping: ${law.slug}`);
      result.laws.skipped++;
      return existing;
    }

    // Create new law
    const record = await prisma.law.create({
      data: {
        slug: law.slug,
        title: law.title,
        shortTitle: law.shortTitle,
        description: law.description,
        category: law.category,
        effectiveDate: law.effectiveDate,
        sourceUrl: law.sourceUrl,
        isActive: law.isActive ?? true,
      },
      select: { id: true, slug: true },
    });
    result.laws.created++;
    return record;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    result.laws.errors.push(`Failed to upsert law ${law.slug}: ${message}`);
    return null;
  }
}

/**
 * Upsert multiple sections for a law
 * Returns a map of slug -> id for linking
 */
export async function upsertSections(
  prisma: PrismaClient,
  lawId: string,
  sections: SectionData[],
  result: SeedResult
): Promise<Map<string, string>> {
  const sectionMap = new Map<string, string>();

  for (const section of sections) {
    try {
      // Check if section already exists
      const existing = await prisma.section.findUnique({
        where: {
          lawId_slug: {
            lawId,
            slug: section.slug,
          },
        },
        select: { id: true, slug: true },
      });

      if (existing) {
        sectionMap.set(existing.slug, existing.id);
        result.sections.skipped++;
        continue;
      }

      // Create new section
      const record = await prisma.section.create({
        data: {
          lawId,
          slug: section.slug,
          number: section.number,
          title: section.title,
          content: section.content,
          summary: section.summary,
          orderIndex: section.orderIndex,
          parentSectionId: section.parentSectionId,
        },
        select: { id: true, slug: true },
      });
      sectionMap.set(record.slug, record.id);
      result.sections.created++;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      result.sections.errors.push(`Failed to upsert section ${section.slug}: ${message}`);
    }
  }

  return sectionMap;
}

/**
 * Upsert a single scenario
 * Returns the scenario record (existing or newly created)
 */
export async function upsertScenario(
  prisma: PrismaClient,
  scenario: ScenarioData,
  result: SeedResult
): Promise<{ id: string; slug: string } | null> {
  try {
    // Check if scenario already exists
    const existing = await prisma.scenario.findUnique({
      where: { slug: scenario.slug },
      select: { id: true, slug: true },
    });

    if (existing) {
      console.log(`   ⏭️  Scenario exists, skipping: ${scenario.slug}`);
      result.scenarios.skipped++;
      return existing;
    }

    // Create new scenario
    const record = await prisma.scenario.create({
      data: {
        slug: scenario.slug,
        title: scenario.title,
        description: scenario.description,
        iconEmoji: scenario.iconEmoji,
        keywords: scenario.keywords,
        category: scenario.category,
        isFeatured: scenario.isFeatured ?? false,
      },
      select: { id: true, slug: true },
    });
    result.scenarios.created++;
    return record;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    result.scenarios.errors.push(`Failed to upsert scenario ${scenario.slug}: ${message}`);
    return null;
  }
}

/**
 * Create scenario-section mappings
 * Uses a lookup map to resolve slugs to IDs
 */
export async function createScenarioMappings(
  prisma: PrismaClient,
  mappings: ScenarioMappingData[],
  scenarioMap: Map<string, string>,
  lawSectionMaps: Map<string, Map<string, string>>,
  result: SeedResult
): Promise<void> {
  for (const mapping of mappings) {
    try {
      const scenarioId = scenarioMap.get(mapping.scenarioSlug);
      if (!scenarioId) {
        result.mappings.errors.push(
          `Scenario not found: ${mapping.scenarioSlug} for mapping to ${mapping.sectionSlug}`
        );
        continue;
      }

      const lawSections = lawSectionMaps.get(mapping.lawSlug);
      if (!lawSections) {
        result.mappings.errors.push(
          `Law not found: ${mapping.lawSlug} for mapping scenario ${mapping.scenarioSlug}`
        );
        continue;
      }

      const sectionId = lawSections.get(mapping.sectionSlug);
      if (!sectionId) {
        result.mappings.errors.push(
          `Section not found: ${mapping.sectionSlug} in law ${mapping.lawSlug} for scenario ${mapping.scenarioSlug}`
        );
        continue;
      }

      // Check if mapping already exists
      const existing = await prisma.scenarioSection.findUnique({
        where: {
          scenarioId_sectionId: {
            scenarioId,
            sectionId,
          },
        },
        select: { scenarioId: true },
      });

      if (existing) {
        result.mappings.skipped++;
        continue;
      }

      // Create new mapping
      await prisma.scenarioSection.create({
        data: {
          scenarioId,
          sectionId,
          relevanceOrder: mapping.relevanceOrder,
          relevanceNote: mapping.relevanceNote,
        },
      });
      result.mappings.created++;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      result.mappings.errors.push(
        `Failed to create mapping for ${mapping.scenarioSlug} -> ${mapping.sectionSlug}: ${message}`
      );
    }
  }
}

/**
 * Log seed results with clear formatting
 */
export function logSeedResults(result: SeedResult): void {
  console.log('\n========================================');
  console.log('SEED RESULTS');
  console.log('========================================');

  console.log(`\nLaws:      ${result.laws.created} created, ${result.laws.skipped} skipped`);
  console.log(`Sections:  ${result.sections.created} created, ${result.sections.skipped} skipped`);
  console.log(
    `Scenarios: ${result.scenarios.created} created, ${result.scenarios.skipped} skipped`
  );
  console.log(`Mappings:  ${result.mappings.created} created, ${result.mappings.skipped} skipped`);

  const totalSkipped =
    result.laws.skipped +
    result.sections.skipped +
    result.scenarios.skipped +
    result.mappings.skipped;

  const allErrors = [
    ...result.laws.errors,
    ...result.sections.errors,
    ...result.scenarios.errors,
    ...result.mappings.errors,
  ];

  if (allErrors.length > 0) {
    console.log('\n⚠️  ERRORS:');
    allErrors.forEach((error) => console.log(`   - ${error}`));
  } else if (totalSkipped > 0) {
    console.log('\n✅ Seed completed! (Some records already existed)');
  } else {
    console.log('\n✅ All records seeded successfully!');
  }

  console.log('========================================\n');
}
