/* eslint-disable no-console */
/**
 * Status Reporter CLI
 *
 * Shows the status of PDF extraction pipeline - what's done, what's pending.
 *
 * Usage:
 *   npm run pdf:status
 */

import fs from 'fs';
import path from 'path';
import { PATHS } from './config';
import { listPDFs } from './utils/pdf-parser';
import type { ExtractedLaw } from '../../prisma/data/raw/schema';
import { validateExtractedLaw, getQualityStatus } from '../../prisma/data/raw/schema';

/**
 * Status for a single law
 */
interface LawStatus {
  slug: string;
  hasPdf: boolean;
  hasJson: boolean;
  hasTs: boolean;
  jsonQuality?: string;
  jsonSections?: number;
  jsonConfidence?: number;
  tsSections?: number;
  needsUpdate: boolean;
}

/**
 * Count sections in TypeScript file
 */
function countTsSections(tsPath: string): number {
  try {
    const content = fs.readFileSync(tsPath, 'utf-8');
    // Count slug: patterns in sections array
    const matches = content.match(/slug:\s*['"]/g);
    return matches ? matches.length : 0;
  } catch {
    return 0;
  }
}

/**
 * Load JSON metadata
 */
function loadJsonMetadata(
  jsonPath: string
): { sections: number; confidence: number; quality: string } | null {
  try {
    const content = fs.readFileSync(jsonPath, 'utf-8');
    const data = JSON.parse(content);
    if (!validateExtractedLaw(data)) return null;

    const extracted = data as ExtractedLaw;
    return {
      sections: extracted.sections.length,
      confidence: extracted.quality.confidence,
      quality: getQualityStatus(extracted.quality),
    };
  } catch {
    return null;
  }
}

/**
 * Get all law slugs from various sources
 */
function getAllSlugs(): Set<string> {
  const slugs = new Set<string>();

  // From PDFs
  const pdfPaths = listPDFs(PATHS.pdfs);
  pdfPaths.forEach((p) => {
    const filename = path.basename(p, '.pdf');
    slugs.add(
      filename
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    );
  });

  // From extracted JSONs
  if (fs.existsSync(PATHS.extracted)) {
    fs.readdirSync(PATHS.extracted)
      .filter((f) => f.endsWith('.json'))
      .forEach((f) => slugs.add(f.replace('.json', '')));
  }

  // From existing TypeScript files
  if (fs.existsSync(PATHS.laws)) {
    fs.readdirSync(PATHS.laws)
      .filter((f) => f.endsWith('.ts') && f !== 'index.ts')
      .forEach((f) => slugs.add(f.replace('.ts', '')));
  }

  return slugs;
}

/**
 * Get status for a single law
 */
function getLawStatus(slug: string): LawStatus {
  const pdfPath = path.join(PATHS.pdfs, `${slug}.pdf`);
  const jsonPath = path.join(PATHS.extracted, `${slug}.json`);
  const tsPath = path.join(PATHS.laws, `${slug}.ts`);

  const hasPdf = fs.existsSync(pdfPath);
  const hasJson = fs.existsSync(jsonPath);
  const hasTs = fs.existsSync(tsPath);

  let jsonMeta: { sections: number; confidence: number; quality: string } | null = null;
  if (hasJson) {
    jsonMeta = loadJsonMetadata(jsonPath);
  }

  let tsSections = 0;
  if (hasTs) {
    tsSections = countTsSections(tsPath);
  }

  // Check if update might be needed (JSON has different section count than TS)
  const needsUpdate = hasJson && hasTs && jsonMeta !== null && jsonMeta.sections !== tsSections;

  return {
    slug,
    hasPdf,
    hasJson,
    hasTs,
    jsonQuality: jsonMeta?.quality,
    jsonSections: jsonMeta?.sections,
    jsonConfidence: jsonMeta?.confidence,
    tsSections: hasTs ? tsSections : undefined,
    needsUpdate,
  };
}

/**
 * Format status row
 */
function formatRow(status: LawStatus): string {
  const pdf = status.hasPdf ? 'PDF' : '   ';
  const json = status.hasJson ? 'JSON' : '    ';
  const ts = status.hasTs ? 'TS' : '  ';

  const sections = status.jsonSections ?? status.tsSections ?? 0;
  const confidence = status.jsonConfidence ? `${(status.jsonConfidence * 100).toFixed(0)}%` : '   ';
  const quality = status.jsonQuality ?? '      ';
  const update = status.needsUpdate ? '*' : ' ';

  return `${status.slug.padEnd(30)} ${pdf} ${json} ${ts}  ${String(sections).padStart(4)}  ${confidence.padStart(4)}  ${quality.padEnd(6)} ${update}`;
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  console.log('PDF Extraction Pipeline Status');
  console.log('='.repeat(70));

  // Directory status
  console.log('\nDirectories:');
  console.log(`  PDFs:      ${PATHS.pdfs}`);
  console.log(`  Extracted: ${PATHS.extracted}`);
  console.log(`  Laws:      ${PATHS.laws}`);

  // Count files
  const pdfCount = listPDFs(PATHS.pdfs).length;
  const jsonCount = fs.existsSync(PATHS.extracted)
    ? fs.readdirSync(PATHS.extracted).filter((f) => f.endsWith('.json')).length
    : 0;
  const tsCount = fs.existsSync(PATHS.laws)
    ? fs.readdirSync(PATHS.laws).filter((f) => f.endsWith('.ts') && f !== 'index.ts').length
    : 0;

  console.log('\nFile Counts:');
  console.log(`  PDFs:       ${pdfCount}`);
  console.log(`  Extracted:  ${jsonCount} JSON files`);
  console.log(`  TypeScript: ${tsCount} law files`);

  // Pipeline stages
  console.log('\nPipeline Progress:');
  const pdfToJson = jsonCount > 0 ? ((jsonCount / Math.max(pdfCount, 1)) * 100).toFixed(0) : '0';
  const jsonToTs = tsCount > 0 ? ((tsCount / Math.max(jsonCount, 1)) * 100).toFixed(0) : '0';
  console.log(`  PDF → JSON: ${pdfToJson}% (${jsonCount}/${pdfCount})`);
  console.log(`  JSON → TS:  ${jsonToTs}% (${tsCount}/${jsonCount})`);

  // Get all statuses
  const allSlugs = getAllSlugs();
  const statuses = Array.from(allSlugs)
    .map(getLawStatus)
    .sort((a, b) => a.slug.localeCompare(b.slug));

  if (statuses.length > 0) {
    console.log('\n' + '='.repeat(70));
    console.log('Law Status Detail');
    console.log('='.repeat(70));
    console.log('\n' + 'Slug'.padEnd(30) + ' PDF JSON TS  Sect  Conf  Quality');
    console.log('-'.repeat(70));

    for (const status of statuses) {
      console.log(formatRow(status));
    }

    // Legend
    console.log('\n' + '-'.repeat(70));
    console.log('Legend: * = may need update (section count mismatch)');
  }

  // Pending work
  const pendingPdfs = statuses.filter((s) => s.hasPdf && !s.hasJson);
  const pendingJsons = statuses.filter((s) => s.hasJson && !s.hasTs);
  const needsUpdate = statuses.filter((s) => s.needsUpdate);

  if (pendingPdfs.length > 0 || pendingJsons.length > 0 || needsUpdate.length > 0) {
    console.log('\n' + '='.repeat(70));
    console.log('Pending Work');
    console.log('='.repeat(70));

    if (pendingPdfs.length > 0) {
      console.log('\nPDFs to extract:');
      pendingPdfs.forEach((s) => console.log(`  npm run pdf:extract -- ${s.slug}.pdf`));
    }

    if (pendingJsons.length > 0) {
      console.log('\nJSONs to generate TypeScript:');
      pendingJsons.forEach((s) => console.log(`  npm run pdf:generate -- ${s.slug}.json`));
    }

    if (needsUpdate.length > 0) {
      console.log('\nMay need update (run diff to check):');
      needsUpdate.forEach((s) => console.log(`  npm run pdf:diff -- ${s.slug}`));
    }
  }

  // If nothing in pipeline
  if (pdfCount === 0 && jsonCount === 0) {
    console.log('\n' + '='.repeat(70));
    console.log('Getting Started');
    console.log('='.repeat(70));
    console.log('\n1. Download law PDFs from openlawsnig.org.ng');
    console.log('2. Place them in: prisma/data/raw/pdfs/');
    console.log('3. Run: npm run pdf:extract -- <filename>.pdf');
    console.log('\nSee prisma/data/raw/pdfs/README.md for more details.');
  }
}

// Run
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
