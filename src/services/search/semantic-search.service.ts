// Semantic Search Service
// Combines vector similarity search with keyword search using Reciprocal Rank Fusion (RRF)

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { EMBEDDING_CONFIG } from '@/constants/embeddings';
import { generateEmbedding } from '@/services/embedding/embedding.service';

// ============================================================================
// Types
// ============================================================================

export type SearchResultType = 'law' | 'section' | 'scenario';

export interface SemanticSearchResult {
  type: SearchResultType;
  id: string;
  title: string;
  excerpt: string;
  relevanceScore: number;
  similarity?: number; // Only for semantic results
  law?: {
    slug: string;
    shortTitle: string;
  };
}

export interface HybridSearchOptions {
  type?: 'all' | 'law' | 'section' | 'scenario';
  limit?: number;
  semanticWeight?: number; // 0-1, weight for semantic vs keyword (default 0.6)
  lawIds?: string[];
}

interface VectorSearchResult {
  id: string;
  title: string;
  content: string;
  summary: string | null;
  similarity: number;
  law_slug: string;
  law_short_title: string;
}

interface ScenarioVectorResult {
  id: string;
  title: string;
  description: string | null;
  similarity: number;
}

// ============================================================================
// Vector Search Functions
// ============================================================================

/**
 * Search sections by vector similarity
 */
async function searchSectionsByVector(
  queryEmbedding: number[],
  options: { limit?: number; threshold?: number; lawIds?: string[] } = {}
): Promise<VectorSearchResult[]> {
  const {
    limit = EMBEDDING_CONFIG.maxSemanticResults,
    threshold = EMBEDDING_CONFIG.defaultSimilarityThreshold,
    lawIds,
  } = options;

  // Build law filter if provided
  const lawFilter = lawIds?.length
    ? Prisma.sql`AND s.law_id = ANY(${lawIds}::uuid[])`
    : Prisma.empty;

  const results = await prisma.$queryRaw<VectorSearchResult[]>`
    SELECT
      s.id,
      s.title,
      s.content,
      s.summary,
      1 - (s.embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as similarity,
      l.slug as law_slug,
      l.short_title as law_short_title
    FROM sections s
    JOIN laws l ON s.law_id = l.id
    WHERE s.embedding IS NOT NULL
      AND 1 - (s.embedding <=> ${JSON.stringify(queryEmbedding)}::vector) >= ${threshold}
      ${lawFilter}
    ORDER BY s.embedding <=> ${JSON.stringify(queryEmbedding)}::vector
    LIMIT ${limit}
  `;

  return results;
}

/**
 * Search scenarios by vector similarity
 */
async function searchScenariosByVector(
  queryEmbedding: number[],
  options: { limit?: number; threshold?: number } = {}
): Promise<ScenarioVectorResult[]> {
  const {
    limit = EMBEDDING_CONFIG.maxSemanticResults,
    threshold = EMBEDDING_CONFIG.defaultSimilarityThreshold,
  } = options;

  const results = await prisma.$queryRaw<ScenarioVectorResult[]>`
    SELECT
      id,
      title,
      description,
      1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as similarity
    FROM scenarios
    WHERE embedding IS NOT NULL
      AND 1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) >= ${threshold}
    ORDER BY embedding <=> ${JSON.stringify(queryEmbedding)}::vector
    LIMIT ${limit}
  `;

  return results;
}

// ============================================================================
// Keyword Search Functions (existing logic extracted)
// ============================================================================

/**
 * Keyword search for sections
 */
async function searchSectionsByKeyword(
  query: string,
  options: { limit?: number; lawIds?: string[] } = {}
): Promise<VectorSearchResult[]> {
  const { limit = 50, lawIds } = options;

  const sections = await prisma.section.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        { summary: { contains: query, mode: 'insensitive' } },
      ],
      ...(lawIds?.length ? { lawId: { in: lawIds } } : {}),
    },
    select: {
      id: true,
      title: true,
      content: true,
      summary: true,
      law: {
        select: { slug: true, shortTitle: true },
      },
    },
    take: limit,
  });

  return sections.map((s) => ({
    id: s.id,
    title: s.title,
    content: s.content,
    summary: s.summary,
    similarity: 0, // Not applicable for keyword search
    law_slug: s.law.slug,
    law_short_title: s.law.shortTitle,
  }));
}

/**
 * Keyword search for scenarios
 */
async function searchScenariosByKeyword(
  query: string,
  options: { limit?: number } = {}
): Promise<ScenarioVectorResult[]> {
  const { limit = 50 } = options;

  const scenarios = await prisma.scenario.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { keywords: { has: query.toLowerCase() } },
      ],
    },
    select: {
      id: true,
      title: true,
      description: true,
    },
    take: limit,
  });

  return scenarios.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    similarity: 0,
  }));
}

/**
 * Keyword search for laws
 */
async function searchLawsByKeyword(
  query: string,
  options: { limit?: number } = {}
): Promise<
  Array<{
    id: string;
    slug: string;
    title: string;
    shortTitle: string;
    description: string | null;
  }>
> {
  const { limit = 50 } = options;

  return prisma.law.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { shortTitle: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
      isActive: true,
    },
    select: {
      id: true,
      slug: true,
      title: true,
      shortTitle: true,
      description: true,
    },
    take: limit,
  });
}

// ============================================================================
// RRF Fusion
// ============================================================================

/**
 * Calculate Reciprocal Rank Fusion score
 * RRF(d) = sum(1 / (k + r_i)) where r_i is rank in list i
 */
function calculateRRFScore(
  semanticRank: number | null,
  keywordRank: number | null,
  k: number = EMBEDDING_CONFIG.rrfK,
  semanticWeight: number = EMBEDDING_CONFIG.defaultSemanticWeight
): number {
  let score = 0;

  if (semanticRank !== null) {
    score += semanticWeight / (k + semanticRank);
  }

  if (keywordRank !== null) {
    score += (1 - semanticWeight) / (k + keywordRank);
  }

  return score;
}

/**
 * Merge semantic and keyword results using RRF
 */
function mergeWithRRF<T extends { id: string }>(
  semanticResults: T[],
  keywordResults: T[],
  semanticWeight: number
): Array<T & { rrfScore: number; semanticRank: number | null; keywordRank: number | null }> {
  const merged = new Map<
    string,
    T & { rrfScore: number; semanticRank: number | null; keywordRank: number | null }
  >();

  // Add semantic results with their ranks
  semanticResults.forEach((result, index) => {
    merged.set(result.id, {
      ...result,
      rrfScore: 0,
      semanticRank: index + 1,
      keywordRank: null,
    });
  });

  // Add/update with keyword results
  keywordResults.forEach((result, index) => {
    const existing = merged.get(result.id);
    if (existing) {
      existing.keywordRank = index + 1;
    } else {
      merged.set(result.id, {
        ...result,
        rrfScore: 0,
        semanticRank: null,
        keywordRank: index + 1,
      });
    }
  });

  // Calculate RRF scores
  for (const item of merged.values()) {
    item.rrfScore = calculateRRFScore(
      item.semanticRank,
      item.keywordRank,
      EMBEDDING_CONFIG.rrfK,
      semanticWeight
    );
  }

  // Sort by RRF score (descending)
  return Array.from(merged.values()).sort((a, b) => b.rrfScore - a.rrfScore);
}

// ============================================================================
// Hybrid Search
// ============================================================================

/**
 * Perform hybrid search combining semantic and keyword search with RRF fusion
 */
export async function hybridSearch(
  query: string,
  options: HybridSearchOptions = {}
): Promise<SemanticSearchResult[]> {
  const {
    type = 'all',
    limit = 20,
    semanticWeight = EMBEDDING_CONFIG.defaultSemanticWeight,
    lawIds,
  } = options;

  // Generate query embedding for semantic search
  const queryEmbedding = await generateEmbedding(query);

  const results: SemanticSearchResult[] = [];

  // Search sections (for 'all' or 'section' type)
  if (type === 'all' || type === 'section') {
    const [semanticSections, keywordSections] = await Promise.all([
      searchSectionsByVector(queryEmbedding, { lawIds }),
      searchSectionsByKeyword(query, { lawIds }),
    ]);

    const mergedSections = mergeWithRRF(semanticSections, keywordSections, semanticWeight);

    results.push(
      ...mergedSections.slice(0, type === 'section' ? limit : Math.ceil(limit / 3)).map((s) => ({
        type: 'section' as const,
        id: s.id,
        title: s.title,
        excerpt: createExcerpt(s.summary || s.content, query),
        relevanceScore: s.rrfScore,
        similarity: s.similarity > 0 ? s.similarity : undefined,
        law: {
          slug: s.law_slug,
          shortTitle: s.law_short_title,
        },
      }))
    );
  }

  // Search scenarios (for 'all' or 'scenario' type)
  if (type === 'all' || type === 'scenario') {
    const [semanticScenarios, keywordScenarios] = await Promise.all([
      searchScenariosByVector(queryEmbedding),
      searchScenariosByKeyword(query),
    ]);

    const mergedScenarios = mergeWithRRF(semanticScenarios, keywordScenarios, semanticWeight);

    results.push(
      ...mergedScenarios.slice(0, type === 'scenario' ? limit : Math.ceil(limit / 3)).map((s) => ({
        type: 'scenario' as const,
        id: s.id,
        title: s.title,
        excerpt: createExcerpt(s.description || '', query),
        relevanceScore: s.rrfScore,
        similarity: s.similarity > 0 ? s.similarity : undefined,
      }))
    );
  }

  // Search laws (keyword only - laws don't have embeddings)
  if (type === 'all' || type === 'law') {
    const laws = await searchLawsByKeyword(query, {
      limit: type === 'law' ? limit : Math.ceil(limit / 3),
    });

    results.push(
      ...laws.map((law, index) => ({
        type: 'law' as const,
        id: law.id,
        title: law.title,
        excerpt: createExcerpt(law.description || law.shortTitle, query),
        relevanceScore: 1 / (EMBEDDING_CONFIG.rrfK + index + 1), // Keyword-only RRF score
        law: {
          slug: law.slug,
          shortTitle: law.shortTitle,
        },
      }))
    );
  }

  // Sort all results by relevance score
  results.sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Return top results
  return results.slice(0, limit);
}

/**
 * Perform pure semantic search (no keyword component)
 */
export async function semanticSearch(
  query: string,
  options: Omit<HybridSearchOptions, 'semanticWeight'> = {}
): Promise<SemanticSearchResult[]> {
  return hybridSearch(query, { ...options, semanticWeight: 1.0 });
}

/**
 * Perform pure keyword search (no semantic component)
 */
export async function keywordSearch(
  query: string,
  options: Omit<HybridSearchOptions, 'semanticWeight'> = {}
): Promise<SemanticSearchResult[]> {
  return hybridSearch(query, { ...options, semanticWeight: 0.0 });
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Create excerpt with highlighted search term
 */
function createExcerpt(text: string, query: string, maxLength = 150): string {
  if (!text) return '';

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);

  if (index === -1) {
    return text.slice(0, maxLength) + (text.length > maxLength ? '...' : '');
  }

  // Extract context around the match
  const start = Math.max(0, index - 50);
  const end = Math.min(text.length, index + query.length + 50);
  let excerpt = text.slice(start, end);

  if (start > 0) excerpt = '...' + excerpt;
  if (end < text.length) excerpt = excerpt + '...';

  // Highlight match with markdown bold
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  excerpt = excerpt.replace(regex, '**$1**');

  return excerpt;
}

function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
