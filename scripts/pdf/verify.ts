/* eslint-disable no-console */
/**
 * PDF Verification CLI
 *
 * Standalone tool to verify extracted JSON against raw PDF text.
 * Can be used to:
 * - Re-verify previously extracted laws
 * - Verify after manual edits to JSON
 * - Generate verification reports
 *
 * Usage:
 *   npm run pdf:verify -- <slug>           # Verify single extraction
 *   npm run pdf:verify -- --all            # Verify all extractions
 *   npm run pdf:verify -- <slug> --verbose # Show anchor details
 */

import fs from 'fs';
import path from 'path';
import { PATHS } from './config';
import {
  verifyExtraction,
  toVerificationData,
  formatVerificationReport,
  type VerificationReport,
} from './utils/verifier';
import type { ExtractedLaw } from '../../prisma/data/raw/schema';

/**
 * CLI Arguments
 */
interface CliArgs {
  slug?: string;
  all: boolean;
  verbose: boolean;
  updateJson: boolean;
}

/**
 * Parse CLI arguments
 */
function parseArgs(): CliArgs {
  const args = process.argv.slice(2);

  const result: CliArgs = {
    all: false,
    verbose: false,
    updateJson: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--all') {
      result.all = true;
    } else if (arg === '--verbose' || arg === '-v') {
      result.verbose = true;
    } else if (arg === '--update') {
      result.updateJson = true;
    } else if (!arg.startsWith('-')) {
      result.slug = arg.replace('.json', '');
    }
  }

  return result;
}

/**
 * Display usage information
 */
function showUsage(): void {
  console.log(`
PDF Verification CLI

Usage:
  npm run pdf:verify -- <slug>              Verify single extraction
  npm run pdf:verify -- --all               Verify all extractions
  npm run pdf:verify -- <slug> --verbose    Show anchor details
  npm run pdf:verify -- <slug> --update     Update JSON with verification results

Options:
  --all        Verify all extracted JSON files
  --verbose    Show detailed anchor verification results
  -v           Same as --verbose
  --update     Update the JSON file with verification results

Examples:
  npm run pdf:verify -- constitution-1999
  npm run pdf:verify -- --all --verbose
  npm run pdf:verify -- cama-2020 --update
`);
}

/**
 * List available JSON files to verify
 */
function listJsonFiles(): string[] {
  if (!fs.existsSync(PATHS.extracted)) {
    return [];
  }

  return fs
    .readdirSync(PATHS.extracted)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace('.json', ''));
}

/**
 * Check if raw text file exists for a slug
 */
function hasRawText(slug: string): boolean {
  const rawPath = path.join(PATHS.extracted, `${slug}.raw.txt`);
  return fs.existsSync(rawPath);
}

/**
 * Verify a single extraction
 */
function verifySingleExtraction(
  slug: string,
  options: { verbose: boolean; updateJson: boolean }
): { success: boolean; report?: VerificationReport } {
  const jsonPath = path.join(PATHS.extracted, `${slug}.json`);
  const rawPath = path.join(PATHS.extracted, `${slug}.raw.txt`);

  // Check JSON exists
  if (!fs.existsSync(jsonPath)) {
    console.error(`\nError: JSON file not found: ${jsonPath}`);
    console.error(`Run 'npm run pdf:extract -- <filename.pdf>' first.`);
    return { success: false };
  }

  // Check raw text exists
  if (!fs.existsSync(rawPath)) {
    console.error(`\nError: Raw text file not found: ${rawPath}`);
    console.error(`The raw text file is required for verification.`);
    console.error(`Re-extract the PDF to generate it.`);
    return { success: false };
  }

  // Load files
  const jsonData: ExtractedLaw = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  const rawText = fs.readFileSync(rawPath, 'utf-8');

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Verifying: ${slug}`);
  console.log(`Sections: ${jsonData.sections.length}`);
  console.log('='.repeat(60));

  // Run verification
  const report = verifyExtraction(jsonData.sections, rawText);

  // Display results
  console.log('\nVerification Results:');
  console.log(formatVerificationReport(report, options.verbose));

  // Update JSON if requested
  if (options.updateJson) {
    console.log('\nUpdating JSON with verification results...');
    jsonData.quality.verification = toVerificationData(report);

    // Update manualReviewRequired if verification failed
    if (report.overallStatus === 'fail') {
      jsonData.quality.manualReviewRequired = true;
    }

    fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
    console.log('   JSON updated successfully.');
  }

  return { success: true, report };
}

/**
 * Main entry point
 */
function main(): void {
  console.log('PDF Verification CLI');
  console.log('='.repeat(60));

  const args = parseArgs();

  // Show usage if no args
  if (!args.slug && !args.all) {
    showUsage();

    // List available files
    const files = listJsonFiles();
    if (files.length > 0) {
      console.log('Available extractions to verify:');
      for (const file of files) {
        const hasRaw = hasRawText(file);
        const status = hasRaw ? '\u2713' : '\u2717 (no raw.txt)';
        console.log(`  - ${file} ${status}`);
      }
    }

    process.exit(0);
  }

  // Get list of slugs to verify
  let slugs: string[] = [];

  if (args.all) {
    slugs = listJsonFiles().filter(hasRawText);
    if (slugs.length === 0) {
      console.log('\nNo extractions with raw text files found.');
      console.log(`Check ${PATHS.extracted} directory.`);
      process.exit(0);
    }
    console.log(`\nFound ${slugs.length} extraction(s) to verify.`);
  } else if (args.slug) {
    slugs = [args.slug];
  }

  // Verify each
  const results: { slug: string; status: string; sections: number }[] = [];

  for (const slug of slugs) {
    const { success, report } = verifySingleExtraction(slug, {
      verbose: args.verbose,
      updateJson: args.updateJson,
    });

    if (success && report) {
      results.push({
        slug,
        status: report.overallStatus,
        sections: report.sections.length,
      });
    } else {
      results.push({
        slug,
        status: 'error',
        sections: 0,
      });
    }
  }

  // Summary for multiple files
  if (slugs.length > 1) {
    console.log('\n' + '='.repeat(60));
    console.log('SUMMARY');
    console.log('='.repeat(60));

    const passed = results.filter((r) => r.status === 'pass').length;
    const review = results.filter((r) => r.status === 'review').length;
    const failed = results.filter((r) => r.status === 'fail').length;
    const errors = results.filter((r) => r.status === 'error').length;

    console.log(`\nTotal: ${results.length}`);
    console.log(`  \u2713 Pass:   ${passed}`);
    console.log(`  ? Review: ${review}`);
    console.log(`  \u2717 Fail:   ${failed}`);
    if (errors > 0) {
      console.log(`  ! Error:  ${errors}`);
    }

    // List non-passing
    const nonPassing = results.filter((r) => r.status !== 'pass');
    if (nonPassing.length > 0) {
      console.log('\nNeeds attention:');
      for (const r of nonPassing) {
        console.log(`  - ${r.slug}: ${r.status.toUpperCase()}`);
      }
    }
  }
}

// Run
main();
