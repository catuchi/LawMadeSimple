#!/usr/bin/env tsx
/* eslint-disable no-console */
/**
 * Backfill Embeddings Script
 *
 * Generates embeddings for all sections and scenarios that don't have them.
 * Uses OpenAI's text-embedding-3-small model and stores in pgvector.
 *
 * Usage:
 *   npx tsx scripts/backfill-embeddings.ts
 *
 * Prerequisites:
 *   1. Run the SQL migration to enable pgvector and add columns:
 *      prisma/migrations/001_pgvector_setup.sql
 *   2. Ensure OPENAI_API_KEY is set in environment
 *   3. Ensure DATABASE_URL is set in environment
 *
 * Options:
 *   --dry-run    Show what would be embedded without making changes
 *   --sections   Only embed sections
 *   --scenarios  Only embed scenarios
 *   --stats      Show embedding statistics only
 */

import 'dotenv/config';
import {
  backfillAllEmbeddings,
  getEmbeddingStats,
  batchEmbedSections,
  batchEmbedScenarios,
  getSectionsNeedingEmbedding,
  getScenariosNeedingEmbedding,
} from '../src/services/embedding/embedding.service';

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const sectionsOnly = args.includes('--sections');
const scenariosOnly = args.includes('--scenarios');
const statsOnly = args.includes('--stats');

async function main() {
  console.log('='.repeat(60));
  console.log('Embedding Backfill Script');
  console.log('='.repeat(60));

  // Check environment variables
  if (!process.env.OPENAI_API_KEY) {
    console.error('ERROR: OPENAI_API_KEY environment variable is not set');
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  // Show current stats
  console.log('\nCurrent embedding status:');
  const stats = await getEmbeddingStats();
  console.log(
    `  Sections:  ${stats.sections.embedded}/${stats.sections.total} embedded (${stats.sections.pending} pending)`
  );
  console.log(
    `  Scenarios: ${stats.scenarios.embedded}/${stats.scenarios.total} embedded (${stats.scenarios.pending} pending)`
  );

  if (statsOnly) {
    console.log('\n--stats flag provided, exiting.');
    process.exit(0);
  }

  if (stats.sections.pending === 0 && stats.scenarios.pending === 0) {
    console.log('\nAll content already has embeddings. Nothing to do.');
    process.exit(0);
  }

  // Dry run mode
  if (isDryRun) {
    console.log('\n--dry-run flag provided. Showing what would be embedded:');

    if (!scenariosOnly) {
      const sectionIds = await getSectionsNeedingEmbedding();
      console.log(`  Would embed ${sectionIds.length} sections`);
    }

    if (!sectionsOnly) {
      const scenarioIds = await getScenariosNeedingEmbedding();
      console.log(`  Would embed ${scenarioIds.length} scenarios`);
    }

    console.log('\nNo changes made. Remove --dry-run to proceed.');
    process.exit(0);
  }

  // Perform backfill
  console.log('\nStarting backfill...\n');
  const startTime = Date.now();

  if (sectionsOnly) {
    const sectionIds = await getSectionsNeedingEmbedding();
    console.log(`Embedding ${sectionIds.length} sections...`);
    const results = await batchEmbedSections(sectionIds);
    console.log(`  Successful: ${results.successful.length}`);
    console.log(`  Failed: ${results.failed.length}`);
    if (results.failed.length > 0) {
      console.log('  Failed IDs:', results.failed.map((r) => r.id).join(', '));
    }
  } else if (scenariosOnly) {
    const scenarioIds = await getScenariosNeedingEmbedding();
    console.log(`Embedding ${scenarioIds.length} scenarios...`);
    const results = await batchEmbedScenarios(scenarioIds);
    console.log(`  Successful: ${results.successful.length}`);
    console.log(`  Failed: ${results.failed.length}`);
    if (results.failed.length > 0) {
      console.log('  Failed IDs:', results.failed.map((r) => r.id).join(', '));
    }
  } else {
    const results = await backfillAllEmbeddings();

    console.log('\nResults:');
    console.log(
      `  Sections:  ${results.sections.successful.length} successful, ${results.sections.failed.length} failed`
    );
    console.log(
      `  Scenarios: ${results.scenarios.successful.length} successful, ${results.scenarios.failed.length} failed`
    );

    if (results.sections.failed.length > 0) {
      console.log('\n  Failed section IDs:');
      results.sections.failed.forEach((r) => console.log(`    - ${r.id}: ${r.error}`));
    }

    if (results.scenarios.failed.length > 0) {
      console.log('\n  Failed scenario IDs:');
      results.scenarios.failed.forEach((r) => console.log(`    - ${r.id}: ${r.error}`));
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\nCompleted in ${duration}s`);

  // Show updated stats
  console.log('\nUpdated embedding status:');
  const updatedStats = await getEmbeddingStats();
  console.log(
    `  Sections:  ${updatedStats.sections.embedded}/${updatedStats.sections.total} embedded`
  );
  console.log(
    `  Scenarios: ${updatedStats.scenarios.embedded}/${updatedStats.scenarios.total} embedded`
  );

  process.exit(0);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
