/* eslint-disable no-console */
/**
 * Database Seed Script
 *
 * Seeds the database with laws, sections, scenarios, and their mappings.
 * Uses modular data files from prisma/data/ for maintainability.
 *
 * Usage: npm run db:seed
 */

import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

import { createEmptySeedResult, type ScenarioMappingData } from './data/types';
import { allLaws } from './data/laws';
import { allScenarios } from './data/scenarios';
import {
  upsertLaw,
  upsertSections,
  upsertScenario,
  createScenarioMappings,
  logSeedResults,
} from './helpers/seed-utils';

// Load environment variables from .env.local
config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting database seed...');
  console.log(`Found ${allLaws.length} laws to seed`);
  console.log(`Found ${allScenarios.length} scenarios to seed`);
  console.log('');

  const result = createEmptySeedResult();

  // Maps for linking scenarios to sections
  const lawSectionMaps = new Map<string, Map<string, string>>();

  // Seed all laws and their sections
  console.log('=== Seeding Laws ===');
  for (const { law, sections } of allLaws) {
    console.log(`Seeding law: ${law.shortTitle}...`);

    const lawRecord = await upsertLaw(prisma, law, result);
    if (!lawRecord) {
      console.error(`  Failed to create law: ${law.slug}`);
      continue;
    }

    const sectionMap = await upsertSections(prisma, lawRecord.id, sections, result);
    lawSectionMaps.set(law.slug, sectionMap);

    console.log(`  Created ${sections.length} sections`);
  }

  // Seed all scenarios
  console.log('\n=== Seeding Scenarios ===');
  const scenarioMap = new Map<string, string>();

  for (const { scenario } of allScenarios) {
    console.log(`Seeding scenario: ${scenario.title}...`);

    const scenarioRecord = await upsertScenario(prisma, scenario, result);
    if (scenarioRecord) {
      scenarioMap.set(scenario.slug, scenarioRecord.id);
    }
  }

  // Create scenario-section mappings
  console.log('\n=== Creating Scenario Mappings ===');

  // Collect all mappings from scenarios
  const allMappings: ScenarioMappingData[] = [];
  for (const { scenario, mappings } of allScenarios) {
    for (const mapping of mappings) {
      allMappings.push({
        scenarioSlug: scenario.slug,
        ...mapping,
      });
    }
  }

  console.log(`Creating ${allMappings.length} scenario-section mappings...`);
  await createScenarioMappings(prisma, allMappings, scenarioMap, lawSectionMaps, result);

  // Log results
  logSeedResults(result);

  // Summary
  const totalErrors =
    result.laws.errors.length +
    result.sections.errors.length +
    result.scenarios.errors.length +
    result.mappings.errors.length;

  if (totalErrors > 0) {
    console.log(`⚠️  Seed completed with ${totalErrors} errors.`);
  } else {
    console.log('✅ Database seed completed successfully!');
  }

  console.log('\nNext steps:');
  console.log('1. Run embedding backfill: npm run db:backfill-embeddings');
  console.log('2. Verify data in Prisma Studio: npm run db:studio');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error('Seed failed:', e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
