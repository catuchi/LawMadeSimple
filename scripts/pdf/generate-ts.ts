/* eslint-disable no-console */
/**
 * TypeScript Generator CLI
 *
 * Generates TypeScript files from extracted JSON for use in prisma/data/laws/.
 *
 * Usage:
 *   npm run pdf:generate -- <slug>.json         # Generate TypeScript from JSON
 *   npm run pdf:generate -- --all               # Generate for all extracted JSONs
 *   npm run pdf:generate -- --preview <file>    # Preview without writing
 */

import fs from 'fs';
import path from 'path';
import { PATHS } from './config';
import type { ExtractedLaw } from '../../prisma/data/raw/schema';
import { validateExtractedLaw } from '../../prisma/data/raw/schema';

/**
 * CLI Arguments
 */
interface CliArgs {
  filename?: string;
  all: boolean;
  preview: boolean;
}

/**
 * Parse CLI arguments
 */
function parseArgs(): CliArgs {
  const args = process.argv.slice(2);

  const result: CliArgs = {
    all: false,
    preview: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--all') {
      result.all = true;
    } else if (arg === '--preview') {
      result.preview = true;
    } else if (!arg.startsWith('-')) {
      result.filename = arg;
    }
  }

  return result;
}

/**
 * Display usage information
 */
function showUsage(): void {
  console.log(`
TypeScript Generator CLI

Usage:
  npm run pdf:generate -- <slug>.json       Generate TypeScript from JSON
  npm run pdf:generate -- --all             Generate for all extracted JSONs
  npm run pdf:generate -- --preview <file>  Preview without writing file

Options:
  --all        Process all JSONs in extracted directory
  --preview    Show generated code without writing

Examples:
  npm run pdf:generate -- cama-2020.json
  npm run pdf:generate -- --preview constitution-1999.json
`);
}

/**
 * Escape string for TypeScript
 */
function escapeString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

/**
 * Convert slug to camelCase variable name
 */
function slugToCamelCase(slug: string): string {
  return slug.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Generate section slug from number
 */
function generateSectionSlug(number: string): string {
  // Convert "33(1)(a)" to "section-33-1-a"
  const cleaned = number
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[()]/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '');

  return `section-${cleaned}`;
}

/**
 * Generate TypeScript content from extracted JSON
 */
function generateTypeScript(data: ExtractedLaw): string {
  const variableName = slugToCamelCase(data.law.slug);
  const effectiveDate = data.law.effectiveDate
    ? `new Date('${data.law.effectiveDate}')`
    : 'new Date()';

  // Build sections array
  const sectionsCode = data.sections
    .map((section, idx) => {
      const slug = generateSectionSlug(section.number);
      return `    {
      slug: '${slug}',
      number: '${escapeString(section.number)}',
      title: '${escapeString(section.title)}',
      content:
        '${escapeString(section.content)}',
      summary:
        '${escapeString(section.summary)}',
      orderIndex: ${idx + 1},
    }`;
    })
    .join(',\n');

  // Build the full TypeScript file
  return `/**
 * ${data.law.title}
 *
 * Auto-generated from PDF extraction pipeline.
 * Source: ${data.meta.sourceFile}
 * Extracted: ${data.meta.extractedAt}
 * Model: ${data.meta.extractionModel}
 *
 * Quality: ${(data.quality.confidence * 100).toFixed(0)}% confidence
 * ${data.quality.manualReviewRequired ? 'MANUAL REVIEW RECOMMENDED' : 'Ready for use'}
 *
 * Source URL: ${data.law.sourceUrl || data.meta.sourceUrl}
 */

import { LawCategory } from '@prisma/client';
import type { LawWithSections } from '../types';

export const ${variableName}: LawWithSections = {
  law: {
    slug: '${data.law.slug}',
    title: '${escapeString(data.law.title)}',
    shortTitle: '${escapeString(data.law.shortTitle)}',
    description:
      '${escapeString(data.law.description)}',
    category: LawCategory.${data.law.category},
    effectiveDate: ${effectiveDate},
    sourceUrl: '${escapeString(data.law.sourceUrl || data.meta.sourceUrl)}',
    isActive: true,
  },
  sections: [
${sectionsCode}
  ],
};
`;
}

/**
 * Load and validate JSON file
 */
function loadExtractedJson(jsonPath: string): ExtractedLaw {
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`JSON file not found: ${jsonPath}`);
  }

  const content = fs.readFileSync(jsonPath, 'utf-8');
  let data: unknown;

  try {
    data = JSON.parse(content);
  } catch {
    throw new Error(`Invalid JSON in ${jsonPath}`);
  }

  if (!validateExtractedLaw(data)) {
    throw new Error(`JSON does not match ExtractedLaw schema: ${jsonPath}`);
  }

  return data;
}

/**
 * List all extracted JSON files
 */
function listExtractedJsons(): string[] {
  if (!fs.existsSync(PATHS.extracted)) {
    return [];
  }

  return fs
    .readdirSync(PATHS.extracted)
    .filter((file) => file.endsWith('.json'))
    .map((file) => path.join(PATHS.extracted, file));
}

/**
 * Check if TypeScript file already exists
 */
function checkExistingTs(slug: string): string | null {
  const tsPath = path.join(PATHS.laws, `${slug}.ts`);
  if (fs.existsSync(tsPath)) {
    return tsPath;
  }
  return null;
}

/**
 * Generate TypeScript from a single JSON file
 */
async function generateFromJson(jsonPath: string, options: { preview: boolean }): Promise<boolean> {
  const filename = path.basename(jsonPath);
  const slug = filename.replace('.json', '');

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Processing: ${filename}`);
  console.log('='.repeat(60));

  // Load JSON
  console.log('\n1. Loading extracted JSON...');
  const data = loadExtractedJson(jsonPath);

  console.log(`   Title: ${data.law.title}`);
  console.log(`   Sections: ${data.sections.length}`);
  console.log(`   Confidence: ${(data.quality.confidence * 100).toFixed(0)}%`);

  if (data.quality.manualReviewRequired) {
    console.log('\n   WARNING: Manual review recommended before using');
  }

  // Check for existing file
  const existingTs = checkExistingTs(slug);
  if (existingTs && !options.preview) {
    console.log(`\n   NOTICE: TypeScript file already exists at ${existingTs}`);
    console.log('   Use npm run pdf:diff to compare changes');
    console.log('   Skipping generation (use --preview to see what would be generated)');
    return false;
  }

  // Generate TypeScript
  console.log('\n2. Generating TypeScript...');
  const tsContent = generateTypeScript(data);

  if (options.preview) {
    console.log('\n3. PREVIEW (not writing file):');
    console.log('-'.repeat(60));
    console.log(tsContent);
    console.log('-'.repeat(60));
    return true;
  }

  // Write file
  const outputPath = path.join(PATHS.laws, `${slug}.ts`);
  console.log(`\n3. Writing to: ${outputPath}`);

  fs.writeFileSync(outputPath, tsContent);
  console.log('   Done!');

  console.log('\n4. Next steps:');
  console.log(`   a. Review the generated file: ${outputPath}`);
  console.log('   b. Add import to prisma/data/laws/index.ts');
  console.log('   c. Run: npm run db:seed');
  console.log('   d. Run: npm run backfill-embeddings');

  return true;
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  console.log('TypeScript Generator');
  console.log('='.repeat(60));

  const args = parseArgs();

  // Show usage if no args
  if (!args.filename && !args.all) {
    showUsage();
    process.exit(0);
  }

  // Get list of JSONs to process
  let jsonPaths: string[] = [];

  if (args.all) {
    jsonPaths = listExtractedJsons();
    if (jsonPaths.length === 0) {
      console.log(`\nNo JSON files found in ${PATHS.extracted}`);
      console.log('Run pdf:extract first to create extracted JSONs.');
      process.exit(0);
    }
    console.log(`\nFound ${jsonPaths.length} JSON file(s) to process`);
  } else if (args.filename) {
    const fullPath = path.isAbsolute(args.filename)
      ? args.filename
      : path.join(PATHS.extracted, args.filename);

    // Also try without .json extension
    const pathsToTry = [fullPath, `${fullPath}.json`];
    const foundPath = pathsToTry.find((p) => fs.existsSync(p));

    if (!foundPath) {
      console.error(`\nFile not found: ${args.filename}`);
      console.error(`\nMake sure the JSON is in: ${PATHS.extracted}`);
      process.exit(1);
    }

    jsonPaths = [foundPath];
  }

  // Process each JSON
  let successCount = 0;

  for (const jsonPath of jsonPaths) {
    try {
      const success = await generateFromJson(jsonPath, { preview: args.preview });
      if (success) successCount++;
    } catch (error) {
      console.error(`\nError processing ${path.basename(jsonPath)}:`);
      console.error(error instanceof Error ? error.message : error);
    }
  }

  // Summary
  if (jsonPaths.length > 1) {
    console.log('\n' + '='.repeat(60));
    console.log('SUMMARY');
    console.log('='.repeat(60));
    console.log(`\nProcessed: ${jsonPaths.length} JSON file(s)`);
    console.log(`Generated: ${successCount} TypeScript file(s)`);
  }
}

// Run
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
