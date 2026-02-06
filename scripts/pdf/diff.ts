/* eslint-disable no-console */
/**
 * Diff CLI
 *
 * Compares extracted JSON against existing TypeScript files to detect changes.
 *
 * Usage:
 *   npm run pdf:diff -- <law-slug>           # Compare JSON vs existing TS
 *   npm run pdf:diff -- --all                # Compare all extracted JSONs
 */

import fs from 'fs';
import path from 'path';
import { PATHS } from './config';
import type { ExtractedLaw, LawDiff } from '../../prisma/data/raw/schema';
import { validateExtractedLaw } from '../../prisma/data/raw/schema';

/**
 * CLI Arguments
 */
interface CliArgs {
  slug?: string;
  all: boolean;
  verbose: boolean;
}

/**
 * Parse CLI arguments
 */
function parseArgs(): CliArgs {
  const args = process.argv.slice(2);

  const result: CliArgs = {
    all: false,
    verbose: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--all') {
      result.all = true;
    } else if (arg === '--verbose' || arg === '-v') {
      result.verbose = true;
    } else if (!arg.startsWith('-')) {
      result.slug = arg;
    }
  }

  return result;
}

/**
 * Display usage information
 */
function showUsage(): void {
  console.log(`
Diff CLI - Compare extracted JSON vs existing TypeScript

Usage:
  npm run pdf:diff -- <law-slug>    Compare JSON vs existing TS
  npm run pdf:diff -- --all         Compare all extracted JSONs

Options:
  --all        Check all extracted JSONs against existing TS
  --verbose    Show detailed content differences
  -v           Same as --verbose

Examples:
  npm run pdf:diff -- constitution-1999
  npm run pdf:diff -- cama-2020 --verbose
  npm run pdf:diff -- --all
`);
}

/**
 * Normalize section number for comparison
 */
function normalizeNumber(num: string): string {
  return num
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/section/i, '')
    .trim();
}

/**
 * Simple string similarity (Levenshtein-like, for short strings)
 */
function similarity(a: string, b: string): number {
  if (a === b) return 1;
  if (a.length === 0 || b.length === 0) return 0;

  // Normalize for comparison
  const normA = a.toLowerCase().replace(/\s+/g, ' ').trim();
  const normB = b.toLowerCase().replace(/\s+/g, ' ').trim();

  if (normA === normB) return 1;

  // Quick length check
  const lenRatio = Math.min(normA.length, normB.length) / Math.max(normA.length, normB.length);
  if (lenRatio < 0.5) return lenRatio * 0.5;

  // Simple word overlap for longer strings
  const wordsA = new Set(normA.split(' '));
  const wordsB = new Set(normB.split(' '));
  const intersection = new Set([...wordsA].filter((x) => wordsB.has(x)));
  const union = new Set([...wordsA, ...wordsB]);

  return intersection.size / union.size;
}

/**
 * Extract sections from TypeScript file (basic parsing)
 */
function extractSectionsFromTs(
  tsPath: string
): Map<string, { number: string; title: string; content: string }> {
  const content = fs.readFileSync(tsPath, 'utf-8');
  const sections = new Map<string, { number: string; title: string; content: string }>();

  // Simple regex to extract section objects
  const sectionRegex =
    /\{\s*slug:\s*['"]([^'"]+)['"]\s*,\s*number:\s*['"]([^'"]+)['"]\s*,\s*title:\s*['"]([^'"]+)['"]\s*,\s*content:\s*['"]([^]+?)['"]\s*,/g;

  let match;
  while ((match = sectionRegex.exec(content)) !== null) {
    const [, , number, title, contentText] = match;
    sections.set(normalizeNumber(number), {
      number,
      title: title.replace(/\\'/g, "'"),
      content: contentText.replace(/\\'/g, "'").replace(/\\n/g, '\n'),
    });
  }

  return sections;
}

/**
 * Compare extracted JSON against existing TypeScript
 */
function compareLaw(jsonPath: string, tsPath: string): LawDiff {
  // Load JSON
  const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
  const jsonData: ExtractedLaw = JSON.parse(jsonContent);

  if (!validateExtractedLaw(jsonData)) {
    throw new Error(`Invalid JSON schema: ${jsonPath}`);
  }

  // Extract sections from TypeScript
  const tsSections = extractSectionsFromTs(tsPath);

  // Build sets of section numbers
  const jsonNumbers = new Set(jsonData.sections.map((s) => normalizeNumber(s.number)));
  const tsNumbers = new Set(tsSections.keys());

  // Find differences
  const newSections = [...jsonNumbers].filter((n) => !tsNumbers.has(n));
  const removedSections = [...tsNumbers].filter((n) => !jsonNumbers.has(n));
  const modifiedSections: { number: string; changes: string[] }[] = [];

  // Check for modified sections
  for (const jsonSection of jsonData.sections) {
    const key = normalizeNumber(jsonSection.number);
    const tsSection = tsSections.get(key);

    if (tsSection) {
      const changes: string[] = [];

      // Compare title
      if (similarity(jsonSection.title, tsSection.title) < 0.9) {
        changes.push(
          `title: "${tsSection.title.slice(0, 50)}..." → "${jsonSection.title.slice(0, 50)}..."`
        );
      }

      // Compare content (use similarity for fuzzy match)
      const contentSim = similarity(jsonSection.content, tsSection.content);
      if (contentSim < 0.95) {
        changes.push(`content: ${((1 - contentSim) * 100).toFixed(0)}% different`);
      }

      if (changes.length > 0) {
        modifiedSections.push({ number: jsonSection.number, changes });
      }
    }
  }

  // Determine suggested action
  let suggestedAction: 'skip' | 'review' | 'replace';
  if (newSections.length === 0 && removedSections.length === 0 && modifiedSections.length === 0) {
    suggestedAction = 'skip';
  } else if (modifiedSections.length > jsonData.sections.length * 0.3) {
    suggestedAction = 'replace';
  } else {
    suggestedAction = 'review';
  }

  // Build summary
  const summaryParts: string[] = [];
  if (newSections.length > 0) summaryParts.push(`${newSections.length} new sections`);
  if (removedSections.length > 0) summaryParts.push(`${removedSections.length} removed sections`);
  if (modifiedSections.length > 0)
    summaryParts.push(`${modifiedSections.length} modified sections`);

  return {
    lawSlug: jsonData.law.slug,
    newSections,
    removedSections,
    modifiedSections,
    suggestedAction,
    summary: summaryParts.length > 0 ? summaryParts.join(', ') : 'No changes detected',
  };
}

/**
 * Display diff result
 */
function displayDiff(diff: LawDiff, verbose: boolean): void {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Law: ${diff.lawSlug}`);
  console.log('='.repeat(60));

  console.log(`\nSummary: ${diff.summary}`);
  console.log(`Suggested Action: ${diff.suggestedAction.toUpperCase()}`);

  if (diff.newSections.length > 0) {
    console.log(`\nNew Sections (${diff.newSections.length}):`);
    diff.newSections.forEach((n) => console.log(`  + ${n}`));
  }

  if (diff.removedSections.length > 0) {
    console.log(`\nRemoved Sections (${diff.removedSections.length}):`);
    diff.removedSections.forEach((n) => console.log(`  - ${n}`));
  }

  if (diff.modifiedSections.length > 0) {
    console.log(`\nModified Sections (${diff.modifiedSections.length}):`);
    diff.modifiedSections.forEach((m) => {
      console.log(`  ~ ${m.number}`);
      if (verbose) {
        m.changes.forEach((c) => console.log(`      ${c}`));
      }
    });
  }

  // Action guidance
  console.log('\n' + '-'.repeat(60));
  switch (diff.suggestedAction) {
    case 'skip':
      console.log('No action needed - files are in sync');
      break;
    case 'review':
      console.log('Review changes before updating');
      console.log('  1. Compare specific sections manually');
      console.log('  2. Update TypeScript if changes are valid');
      console.log('  3. Run: npm run db:seed && npm run backfill-embeddings');
      break;
    case 'replace':
      console.log('Major changes detected - consider regenerating');
      console.log('  1. Review extracted JSON for accuracy');
      console.log('  2. Backup existing TypeScript file');
      console.log('  3. Run: npm run pdf:generate -- ' + diff.lawSlug);
      break;
  }
}

/**
 * List all extracted JSONs with corresponding TS files
 */
function findMatchingPairs(): Array<{ json: string; ts: string | null; slug: string }> {
  if (!fs.existsSync(PATHS.extracted)) {
    return [];
  }

  const jsonFiles = fs
    .readdirSync(PATHS.extracted)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const slug = f.replace('.json', '');
      const tsPath = path.join(PATHS.laws, `${slug}.ts`);
      return {
        json: path.join(PATHS.extracted, f),
        ts: fs.existsSync(tsPath) ? tsPath : null,
        slug,
      };
    });

  return jsonFiles;
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  console.log('Diff Tool - Compare Extracted JSON vs Existing TypeScript');
  console.log('='.repeat(60));

  const args = parseArgs();

  if (!args.slug && !args.all) {
    showUsage();
    process.exit(0);
  }

  if (args.all) {
    // Compare all pairs
    const pairs = findMatchingPairs();
    const withTs = pairs.filter((p) => p.ts !== null);

    if (withTs.length === 0) {
      console.log('\nNo extracted JSONs with matching TypeScript files found.');
      console.log('Run pdf:extract first, then use pdf:generate to create TypeScript files.');
      process.exit(0);
    }

    console.log(`\nFound ${withTs.length} JSON(s) with existing TypeScript files`);

    for (const pair of withTs) {
      if (!pair.ts) continue;
      try {
        const diff = compareLaw(pair.json, pair.ts);
        displayDiff(diff, args.verbose);
      } catch (error) {
        console.error(`\nError comparing ${pair.slug}:`);
        console.error(error instanceof Error ? error.message : error);
      }
    }
  } else if (args.slug) {
    // Compare single law
    const jsonPath = path.join(PATHS.extracted, `${args.slug}.json`);
    const tsPath = path.join(PATHS.laws, `${args.slug}.ts`);

    if (!fs.existsSync(jsonPath)) {
      console.error(`\nExtracted JSON not found: ${jsonPath}`);
      console.error('Run pdf:extract first.');
      process.exit(1);
    }

    if (!fs.existsSync(tsPath)) {
      console.error(`\nTypeScript file not found: ${tsPath}`);
      console.log('\nThis is a new law - no existing file to compare against.');
      console.log('Run pdf:generate to create the TypeScript file.');
      process.exit(0);
    }

    const diff = compareLaw(jsonPath, tsPath);
    displayDiff(diff, args.verbose);
  }
}

// Run
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
