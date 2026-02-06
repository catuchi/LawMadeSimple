/* eslint-disable no-console */
/**
 * PDF Extraction CLI
 *
 * Main entry point for extracting law content from PDFs.
 *
 * Usage:
 *   npm run pdf:extract -- <filename.pdf>     # Extract single PDF
 *   npm run pdf:extract -- --all              # Extract all PDFs
 *   npm run pdf:extract -- --dry-run <file>   # Preview without calling AI
 */

import fs from 'fs';
import path from 'path';
import { PATHS, AI_CONFIG, generateSlugFromFilename, getCategoryHint } from './config';
import { parsePDF, listPDFs, formatFileSize } from './utils/pdf-parser';
import { chunkText, getChunkStats } from './utils/chunker';
import { extractFromAllChunks, validateApiKey } from './utils/ai-extractor';
import { mergeChunkResults, validateMergedResult } from './utils/merger';
import type { ExtractedLaw } from '../../prisma/data/raw/schema';
import { LawCategory } from '@prisma/client';

/**
 * CLI Arguments
 */
interface CliArgs {
  filename?: string;
  all: boolean;
  dryRun: boolean;
  verbose: boolean;
}

/**
 * Parse CLI arguments
 */
function parseArgs(): CliArgs {
  const args = process.argv.slice(2);

  const result: CliArgs = {
    all: false,
    dryRun: false,
    verbose: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--all') {
      result.all = true;
    } else if (arg === '--dry-run') {
      result.dryRun = true;
    } else if (arg === '--verbose' || arg === '-v') {
      result.verbose = true;
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
PDF Extraction CLI

Usage:
  npm run pdf:extract -- <filename.pdf>     Extract a single PDF
  npm run pdf:extract -- --all              Extract all PDFs in raw/pdfs/
  npm run pdf:extract -- --dry-run <file>   Preview extraction without AI

Options:
  --all        Process all PDFs in the pdfs directory
  --dry-run    Parse PDF and show stats without calling AI
  --verbose    Show detailed output
  -v           Same as --verbose

Examples:
  npm run pdf:extract -- constitution-1999.pdf
  npm run pdf:extract -- --all --dry-run
  npm run pdf:extract -- cama-2020.pdf --verbose
`);
}

/**
 * Extract a single PDF file
 */
async function extractPDF(
  pdfPath: string,
  options: { dryRun: boolean; verbose: boolean }
): Promise<ExtractedLaw | null> {
  const filename = path.basename(pdfPath);
  const slug = generateSlugFromFilename(filename);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Processing: ${filename}`);
  console.log(`Slug: ${slug}`);
  console.log('='.repeat(60));

  // Parse PDF
  console.log('\n1. Parsing PDF...');
  const parsed = await parsePDF(pdfPath);

  console.log(`   Pages: ${parsed.numPages}`);
  console.log(`   Size: ${formatFileSize(parsed.fileSize)}`);
  console.log(`   Characters: ${parsed.text.length.toLocaleString()}`);

  if (parsed.info.title) {
    console.log(`   PDF Title: ${parsed.info.title}`);
  }

  // Check if text was extracted
  if (parsed.text.length < 100) {
    console.error('\n   ERROR: Very little text extracted. PDF may be scanned/image-based.');
    console.error('   Consider using OCR or finding a text-based version.');
    return null;
  }

  // Chunk text
  console.log('\n2. Chunking text...');
  const chunks = chunkText(parsed.text);
  const chunkStats = getChunkStats(chunks);

  console.log(`   Chunks: ${chunkStats.count}`);
  console.log(`   Avg chunk size: ${chunkStats.avgChunkSize.toLocaleString()} chars`);

  if (options.dryRun) {
    console.log('\n3. DRY RUN - Skipping AI extraction');
    console.log(`   Would process ${chunks.length} chunk(s)`);
    console.log(`   Estimated cost: ~$${(chunks.length * 0.05).toFixed(2)} (very rough)`);

    // Show sample of first chunk
    if (options.verbose) {
      console.log('\n   First chunk preview (500 chars):');
      console.log('   ' + '-'.repeat(50));
      console.log('   ' + chunks[0].text.slice(0, 500).replace(/\n/g, '\n   '));
      console.log('   ' + '-'.repeat(50));
    }

    return null;
  }

  // Validate API key
  if (!validateApiKey()) {
    console.error('\n   ERROR: OPENAI_API_KEY not set');
    console.error(
      '   Run with: DOTENV_CONFIG_PATH=.env.local npx tsx -r dotenv/config scripts/pdf/extract.ts'
    );
    return null;
  }

  // Extract with AI
  console.log('\n3. Extracting with AI...');
  console.log(`   Model: ${AI_CONFIG.extractionModel}`);

  const extractionResults = await extractFromAllChunks(
    chunks.map((c) => ({ index: c.index, text: c.text })),
    filename,
    (completed, total) => {
      process.stdout.write(`\r   Progress: ${completed}/${total} chunks`);
    }
  );
  console.log(); // New line after progress

  // Merge results
  console.log('\n4. Merging results...');
  const categoryHint = getCategoryHint(filename);

  const merged = mergeChunkResults(extractionResults, {
    sourceFile: filename,
    sourceUrl: '', // To be filled by user
    totalPages: parsed.numPages,
    totalCharacters: parsed.text.length,
    slug,
    category: categoryHint as LawCategory | undefined,
    model: AI_CONFIG.extractionModel,
  });

  // Validate
  const validation = validateMergedResult(merged);
  if (!validation.valid) {
    console.log('\n   Validation warnings:');
    validation.errors.forEach((e) => console.log(`   - ${e}`));
  }

  // Show summary
  console.log('\n5. Extraction Summary:');
  console.log(`   Title: ${merged.law.title}`);
  console.log(`   Sections: ${merged.sections.length}`);
  console.log(`   Confidence: ${(merged.quality.confidence * 100).toFixed(0)}%`);
  console.log(`   Review needed: ${merged.quality.manualReviewRequired ? 'YES' : 'No'}`);

  if (merged.quality.warnings.length > 0 && options.verbose) {
    console.log('\n   Warnings:');
    merged.quality.warnings.slice(0, 5).forEach((w) => console.log(`   - ${w}`));
    if (merged.quality.warnings.length > 5) {
      console.log(`   ... and ${merged.quality.warnings.length - 5} more`);
    }
  }

  // Save JSON
  const outputPath = path.join(PATHS.extracted, `${slug}.json`);
  console.log(`\n6. Saving to: ${outputPath}`);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(merged, null, 2));

  console.log('   Done!');

  return merged;
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  console.log('PDF Extraction Pipeline');
  console.log('='.repeat(60));

  const args = parseArgs();

  // Show usage if no args
  if (!args.filename && !args.all) {
    showUsage();
    process.exit(0);
  }

  // Get list of PDFs to process
  let pdfPaths: string[] = [];

  if (args.all) {
    pdfPaths = listPDFs(PATHS.pdfs);
    if (pdfPaths.length === 0) {
      console.log(`\nNo PDF files found in ${PATHS.pdfs}`);
      console.log('Add PDF files and try again.');
      process.exit(0);
    }
    console.log(`\nFound ${pdfPaths.length} PDF(s) to process`);
  } else if (args.filename) {
    const fullPath = path.isAbsolute(args.filename)
      ? args.filename
      : path.join(PATHS.pdfs, args.filename);

    if (!fs.existsSync(fullPath)) {
      console.error(`\nFile not found: ${fullPath}`);
      console.error(`\nMake sure the PDF is in: ${PATHS.pdfs}`);
      process.exit(1);
    }

    pdfPaths = [fullPath];
  }

  // Process each PDF
  const results: { filename: string; success: boolean; sections: number }[] = [];

  for (const pdfPath of pdfPaths) {
    try {
      const result = await extractPDF(pdfPath, {
        dryRun: args.dryRun,
        verbose: args.verbose,
      });

      results.push({
        filename: path.basename(pdfPath),
        success: result !== null || args.dryRun,
        sections: result?.sections.length ?? 0,
      });
    } catch (error) {
      console.error(`\nError processing ${path.basename(pdfPath)}:`);
      console.error(error instanceof Error ? error.message : error);

      results.push({
        filename: path.basename(pdfPath),
        success: false,
        sections: 0,
      });
    }
  }

  // Summary
  if (pdfPaths.length > 1) {
    console.log('\n' + '='.repeat(60));
    console.log('SUMMARY');
    console.log('='.repeat(60));

    const successful = results.filter((r) => r.success).length;
    console.log(`\nProcessed: ${results.length} PDF(s)`);
    console.log(`Successful: ${successful}`);
    console.log(`Failed: ${results.length - successful}`);

    if (results.some((r) => !r.success)) {
      console.log('\nFailed files:');
      results.filter((r) => !r.success).forEach((r) => console.log(`  - ${r.filename}`));
    }
  }

  if (!args.dryRun && results.some((r) => r.success)) {
    console.log('\nNext steps:');
    console.log('1. Review extracted JSON in prisma/data/raw/extracted/');
    console.log('2. Run: npm run pdf:generate -- <slug>.json');
    console.log('3. Update prisma/data/laws/index.ts');
    console.log('4. Run: npm run db:seed');
    console.log('5. Run: npm run backfill-embeddings');
  }
}

// Run
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
