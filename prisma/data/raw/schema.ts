/**
 * JSON Schema Types for PDF Extraction Pipeline
 *
 * These types define the intermediate JSON format used between:
 * 1. PDF extraction (AI-powered)
 * 2. TypeScript generation (for prisma/data/laws/*.ts)
 *
 * The JSON files serve as version-controlled backups and
 * can be used for NigerianLawsAPI data exports.
 */

import { LawCategory } from '@prisma/client';

/**
 * Schema version for backwards compatibility
 */
export const SCHEMA_VERSION = '1.0.0';

/**
 * Extraction metadata
 */
export interface ExtractionMeta {
  /** Original PDF filename (e.g., "cama-2020.pdf") */
  sourceFile: string;

  /** URL where PDF was downloaded from */
  sourceUrl: string;

  /** ISO timestamp of extraction */
  extractedAt: string;

  /** Model used for extraction (e.g., "gpt-4o-mini") */
  extractionModel: string;

  /** Total pages in the PDF */
  totalPages: number;

  /** Schema version for this JSON format */
  version: string;

  /** Processing metadata */
  processing?: {
    /** Number of chunks the PDF was split into */
    chunksProcessed: number;

    /** Total characters in raw text */
    totalCharacters: number;

    /** Processing time in milliseconds */
    processingTimeMs: number;
  };
}

/**
 * Extracted law metadata
 */
export interface ExtractedLawInfo {
  /** URL-friendly identifier (e.g., "cama-2020") */
  slug: string;

  /** Full official title */
  title: string;

  /** Abbreviated title for UI */
  shortTitle: string;

  /** Plain-language description of the law */
  description: string;

  /** Category from LawCategory enum */
  category: LawCategory;

  /** Effective/commencement date (ISO string) */
  effectiveDate: string;

  /** Source URL for attribution */
  sourceUrl: string;
}

/**
 * Extracted section from a law
 */
export interface ExtractedSection {
  /** Section number (e.g., "33", "33(1)(a)", "Part I") */
  number: string;

  /** Section title/heading */
  title: string;

  /** Full legal text (verbatim from PDF) */
  content: string;

  /** AI-generated plain-language summary for Nigerian audience */
  summary: string;

  /** Order within the law for display */
  orderIndex: number;

  /** Page numbers where this section appears */
  pageNumbers: number[];

  /** AI confidence score for this section (0-1) */
  confidence: number;

  /** Optional parent section number for nested structure */
  parentNumber?: string;
}

/**
 * Quality assessment of the extraction
 */
export interface ExtractionQuality {
  /** Overall confidence score (0-1) */
  confidence: number;

  /** Warnings about potential issues */
  warnings: string[];

  /** Whether human review is recommended */
  manualReviewRequired: boolean;

  /** Specific issues found */
  issues?: {
    /** Sections that may have incorrect boundaries */
    possibleBoundaryErrors: string[];

    /** Sections with low confidence */
    lowConfidenceSections: string[];

    /** Pages that couldn't be parsed */
    unparseablePages: number[];
  };
}

/**
 * Complete extracted law document
 */
export interface ExtractedLaw {
  /** Extraction metadata */
  meta: ExtractionMeta;

  /** Law information */
  law: ExtractedLawInfo;

  /** Extracted sections */
  sections: ExtractedSection[];

  /** Quality assessment */
  quality: ExtractionQuality;
}

/**
 * AI-suggested scenario for a law
 */
export interface SuggestedScenario {
  /** Suggested URL-friendly identifier */
  slug: string;

  /** Scenario title */
  title: string;

  /** Scenario description */
  description: string;

  /** Suggested emoji icon */
  iconEmoji: string;

  /** Search keywords */
  keywords: string[];

  /** Target persona (e.g., "SME Owner", "Tenant") */
  targetPersona: string;

  /** Relevant section numbers from the law */
  relevantSections: string[];

  /** AI confidence in this suggestion */
  confidence: number;

  /** Why this scenario was suggested */
  rationale: string;
}

/**
 * Scenario suggestions output
 */
export interface ScenarioSuggestions {
  /** Law slug these suggestions are for */
  lawSlug: string;

  /** When suggestions were generated */
  generatedAt: string;

  /** Model used for suggestions */
  model: string;

  /** Suggested scenarios */
  scenarios: SuggestedScenario[];
}

/**
 * Diff result when comparing extracted JSON to existing TypeScript
 */
export interface LawDiff {
  /** Law slug being compared */
  lawSlug: string;

  /** Sections in JSON but not in existing TypeScript */
  newSections: string[];

  /** Sections in TypeScript but not in JSON */
  removedSections: string[];

  /** Sections with content changes */
  modifiedSections: {
    number: string;
    changes: string[];
  }[];

  /** Suggested action */
  suggestedAction: 'skip' | 'review' | 'replace';

  /** Summary of changes */
  summary: string;
}

/**
 * Validate that an object matches ExtractedLaw schema
 */
export function validateExtractedLaw(data: unknown): data is ExtractedLaw {
  if (!data || typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;

  // Check required top-level fields
  if (!obj.meta || !obj.law || !obj.sections || !obj.quality) {
    return false;
  }

  // Check meta fields
  const meta = obj.meta as Record<string, unknown>;
  if (
    typeof meta.sourceFile !== 'string' ||
    typeof meta.extractedAt !== 'string' ||
    typeof meta.version !== 'string'
  ) {
    return false;
  }

  // Check law fields
  const law = obj.law as Record<string, unknown>;
  if (
    typeof law.slug !== 'string' ||
    typeof law.title !== 'string' ||
    typeof law.category !== 'string'
  ) {
    return false;
  }

  // Check sections is array
  if (!Array.isArray(obj.sections)) {
    return false;
  }

  return true;
}

/**
 * Get quality status label
 */
export function getQualityStatus(quality: ExtractionQuality): string {
  if (quality.confidence >= 0.9) return 'High';
  if (quality.confidence >= 0.7) return 'Medium';
  if (quality.confidence >= 0.5) return 'Low';
  return 'Very Low';
}
