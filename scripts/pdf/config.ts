/**
 * PDF Extraction Pipeline Configuration
 *
 * Centralized configuration for all extraction settings.
 */

import path from 'path';

/**
 * Directory paths
 */
export const PATHS = {
  /** Source PDF files */
  pdfs: path.join(process.cwd(), 'prisma/data/raw/pdfs'),

  /** Extracted JSON files */
  extracted: path.join(process.cwd(), 'prisma/data/raw/extracted'),

  /** AI-suggested scenarios */
  scenarios: path.join(process.cwd(), 'prisma/data/raw/scenarios'),

  /** Existing TypeScript law files */
  laws: path.join(process.cwd(), 'prisma/data/laws'),

  /** Existing scenario files */
  existingScenarios: path.join(process.cwd(), 'prisma/data/scenarios'),
} as const;

/**
 * OpenAI configuration
 */
export const AI_CONFIG = {
  /** Model for extraction (128k context, cost-effective) */
  extractionModel: 'gpt-4o-mini' as const,

  /** Model for scenario suggestions */
  scenarioModel: 'gpt-4o-mini' as const,

  /** Temperature for extraction (low for accuracy) */
  extractionTemperature: 0.1,

  /** Temperature for scenarios (higher for creativity) */
  scenarioTemperature: 0.7,

  /** Max tokens for extraction response */
  maxTokens: 16000,

  /** Request timeout in milliseconds */
  timeoutMs: 120000,
} as const;

/**
 * Chunking configuration
 */
export const CHUNK_CONFIG = {
  /** Maximum characters per chunk (50k leaves room for prompt + response) */
  maxChunkSize: 50000,

  /** Overlap between chunks to avoid cutting sections */
  overlapSize: 2000,

  /** Minimum chunk size to process */
  minChunkSize: 1000,
} as const;

/**
 * Quality thresholds
 */
export const QUALITY_CONFIG = {
  /** Minimum confidence to accept without review */
  minAcceptableConfidence: 0.7,

  /** Confidence below this requires manual review */
  reviewThreshold: 0.5,

  /** Minimum section content length (characters) */
  minSectionLength: 50,

  /** Maximum summary length (characters) */
  maxSummaryLength: 500,
} as const;

/**
 * Rate limiting for API calls
 */
export const RATE_LIMIT = {
  /** Delay between API calls in milliseconds */
  delayBetweenCalls: 1000,

  /** Maximum retries on failure */
  maxRetries: 3,

  /** Base delay for exponential backoff */
  retryBaseDelay: 2000,
} as const;

/**
 * Law category mappings for common Nigerian laws
 */
export const LAW_CATEGORY_HINTS: Record<string, string> = {
  constitution: 'constitution',
  'criminal-code': 'criminal',
  cama: 'business',
  'companies-and-allied-matters': 'business',
  labour: 'labour',
  tenancy: 'property',
  copyright: 'intellectual_property',
  trademark: 'intellectual_property',
  patent: 'intellectual_property',
  firs: 'tax',
  'federal-inland-revenue': 'tax',
};

/**
 * Get law category hint from filename
 */
export function getCategoryHint(filename: string): string | undefined {
  const lower = filename.toLowerCase();
  for (const [key, category] of Object.entries(LAW_CATEGORY_HINTS)) {
    if (lower.includes(key)) {
      return category;
    }
  }
  return undefined;
}

/**
 * Generate slug from filename
 */
export function generateSlugFromFilename(filename: string): string {
  return filename
    .replace(/\.pdf$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Target personas for scenario generation
 */
export const TARGET_PERSONAS = [
  {
    name: 'Tenant',
    description: 'Someone renting property, dealing with landlord issues',
    categories: ['property'],
  },
  {
    name: 'SME Owner',
    description: 'Small business owner navigating compliance',
    categories: ['business', 'tax'],
  },
  {
    name: 'Employee',
    description: 'Worker dealing with employment issues',
    categories: ['labour'],
  },
  {
    name: 'Citizen',
    description: 'Ordinary Nigerian wanting to understand their rights',
    categories: ['constitution', 'criminal'],
  },
  {
    name: 'Content Creator',
    description: 'Digital creator protecting their intellectual property',
    categories: ['intellectual_property'],
  },
] as const;

/**
 * Get relevant personas for a law category
 */
export function getPersonasForCategory(category: string): string[] {
  return TARGET_PERSONAS.filter((p) => (p.categories as readonly string[]).includes(category)).map(
    (p) => p.name
  );
}
