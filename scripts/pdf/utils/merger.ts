/**
 * Chunk Merger Utility
 *
 * Merges extraction results from multiple chunks into a single coherent result.
 * Handles deduplication, conflict resolution, and quality assessment.
 */

import type { ChunkExtractionResult } from './ai-extractor';
import type {
  ExtractedLaw,
  ExtractedSection,
  ExtractionMeta,
  ExtractedLawInfo,
  ExtractionQuality,
} from '../../../prisma/data/raw/schema';
import { SCHEMA_VERSION } from '../../../prisma/data/raw/schema';
import { QUALITY_CONFIG } from '../config';
import { LawCategory } from '@prisma/client';

/**
 * Merge options
 */
export interface MergeOptions {
  /** Source PDF filename */
  sourceFile: string;

  /** Source URL */
  sourceUrl: string;

  /** Total pages in PDF */
  totalPages: number;

  /** Total characters in text */
  totalCharacters: number;

  /** Law slug */
  slug: string;

  /** Law category (if known) */
  category?: LawCategory;

  /** Extraction model used */
  model: string;
}

/**
 * Merge multiple chunk results into a single ExtractedLaw
 */
export function mergeChunkResults(
  results: ChunkExtractionResult[],
  options: MergeOptions
): ExtractedLaw {
  const startTime = Date.now();

  // Get law metadata from first chunk
  const firstChunkMeta = results[0]?.lawMetadata;

  // Merge and deduplicate sections
  const { sections, warnings: mergeWarnings } = mergeSections(results);

  // Calculate quality metrics
  const quality = assessQuality(results, sections);

  // Build metadata
  const meta: ExtractionMeta = {
    sourceFile: options.sourceFile,
    sourceUrl: options.sourceUrl,
    extractedAt: new Date().toISOString(),
    extractionModel: options.model,
    totalPages: options.totalPages,
    version: SCHEMA_VERSION,
    processing: {
      chunksProcessed: results.length,
      totalCharacters: options.totalCharacters,
      processingTimeMs:
        results.reduce((sum, r) => sum + r.processingTimeMs, 0) + (Date.now() - startTime),
    },
  };

  // Build law info
  const law: ExtractedLawInfo = {
    slug: options.slug,
    title: firstChunkMeta?.title ?? inferTitle(options.sourceFile),
    shortTitle: firstChunkMeta?.shortTitle ?? inferShortTitle(options.slug),
    description: firstChunkMeta?.description ?? 'Description to be added after review.',
    category: options.category ?? ('constitution' as LawCategory),
    effectiveDate: firstChunkMeta?.effectiveDate ?? '',
    sourceUrl: options.sourceUrl,
  };

  // Add merge warnings to quality
  quality.warnings = [...quality.warnings, ...mergeWarnings];

  return {
    meta,
    law,
    sections,
    quality,
  };
}

/**
 * Merge sections from all chunks, handling duplicates
 */
function mergeSections(results: ChunkExtractionResult[]): {
  sections: ExtractedSection[];
  warnings: string[];
} {
  const warnings: string[] = [];
  const sectionMap = new Map<string, ExtractedSection>();

  for (const result of results) {
    for (const section of result.sections) {
      const key = normalizesSectionNumber(section.number);

      const existing = sectionMap.get(key);
      if (existing) {
        // Duplicate found - keep the one with higher confidence
        if (section.confidence > existing.confidence) {
          sectionMap.set(key, section);
          warnings.push(
            `Duplicate section ${section.number} found across chunks, kept higher confidence version`
          );
        }
      } else {
        sectionMap.set(key, section);
      }
    }
  }

  // Sort by order index and renumber
  const sections = Array.from(sectionMap.values())
    .sort((a, b) => {
      // First try numeric comparison
      const numA = extractNumericPart(a.number);
      const numB = extractNumericPart(b.number);
      if (numA !== numB) return numA - numB;

      // Fall back to order index
      return a.orderIndex - b.orderIndex;
    })
    .map((s, i) => ({ ...s, orderIndex: i }));

  return { sections, warnings };
}

/**
 * Normalize section number for deduplication
 */
function normalizesSectionNumber(num: string): string {
  return num
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/section/i, '')
    .trim();
}

/**
 * Extract numeric part of section number for sorting
 */
function extractNumericPart(num: string): number {
  const match = num.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

/**
 * Assess overall quality of the extraction
 */
function assessQuality(
  results: ChunkExtractionResult[],
  sections: ExtractedSection[]
): ExtractionQuality {
  const warnings: string[] = [];
  const lowConfidenceSections: string[] = [];
  const possibleBoundaryErrors: string[] = [];

  // Collect warnings from all chunks
  for (const result of results) {
    warnings.push(...result.warnings);
  }

  // Check section quality
  for (const section of sections) {
    if (section.confidence < QUALITY_CONFIG.reviewThreshold) {
      lowConfidenceSections.push(section.number);
    }

    if (section.content.length < QUALITY_CONFIG.minSectionLength) {
      possibleBoundaryErrors.push(section.number);
      warnings.push(
        `Section ${section.number} has very short content (${section.content.length} chars)`
      );
    }

    if (section.summary.length > QUALITY_CONFIG.maxSummaryLength) {
      warnings.push(
        `Section ${section.number} summary exceeds max length (${section.summary.length} chars)`
      );
    }
  }

  // Calculate overall confidence
  const chunkConfidences = results.map((r) => r.confidence);
  const sectionConfidences = sections.map((s) => s.confidence);
  const allConfidences = [...chunkConfidences, ...sectionConfidences];
  const avgConfidence =
    allConfidences.length > 0
      ? allConfidences.reduce((sum, c) => sum + c, 0) / allConfidences.length
      : 0;

  // Determine if manual review is needed
  const manualReviewRequired =
    avgConfidence < QUALITY_CONFIG.minAcceptableConfidence ||
    lowConfidenceSections.length > sections.length * 0.2 ||
    possibleBoundaryErrors.length > 0;

  return {
    confidence: Math.round(avgConfidence * 100) / 100,
    warnings,
    manualReviewRequired,
    issues: {
      possibleBoundaryErrors,
      lowConfidenceSections,
      unparseablePages: [],
    },
  };
}

/**
 * Infer title from filename
 */
function inferTitle(filename: string): string {
  return filename
    .replace(/\.pdf$/i, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

/**
 * Infer short title from slug
 */
function inferShortTitle(slug: string): string {
  // Handle common patterns
  if (slug.includes('constitution')) return 'Constitution 1999';
  if (slug.includes('cama')) return 'CAMA 2020';
  if (slug.includes('criminal-code')) return 'Criminal Code';
  if (slug.includes('labour')) return 'Labour Act';
  if (slug.includes('tenancy')) return 'Tenancy Law';
  if (slug.includes('copyright')) return 'Copyright Act';
  if (slug.includes('trademark')) return 'Trademarks Act';
  if (slug.includes('patent')) return 'Patents Act';

  // Default: capitalize slug
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

/**
 * Validate merged result
 */
export function validateMergedResult(result: ExtractedLaw): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check required fields
  if (!result.law.slug) errors.push('Missing law slug');
  if (!result.law.title) errors.push('Missing law title');
  if (!result.law.category) errors.push('Missing law category');
  if (result.sections.length === 0) errors.push('No sections extracted');

  // Check section numbers are unique
  const sectionNumbers = new Set<string>();
  for (const section of result.sections) {
    const key = normalizesSectionNumber(section.number);
    if (sectionNumbers.has(key)) {
      errors.push(`Duplicate section number: ${section.number}`);
    }
    sectionNumbers.add(key);
  }

  // Check order indices are sequential
  const indices = result.sections.map((s) => s.orderIndex).sort((a, b) => a - b);
  for (let i = 0; i < indices.length; i++) {
    if (indices[i] !== i) {
      errors.push('Section order indices are not sequential');
      break;
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
