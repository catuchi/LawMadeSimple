// Embedding Service
// Handles generating and storing embeddings for semantic search using OpenAI + pgvector

import { createHash } from 'crypto';
import OpenAI from 'openai';
import { prisma } from '@/lib/db';
import { EMBEDDING_CONFIG, EMBEDDING_CONTENT_TEMPLATES } from '@/constants/embeddings';

// ============================================================================
// Types
// ============================================================================

interface EmbeddingResult {
  id: string;
  success: boolean;
  error?: string;
}

interface BatchEmbeddingResult {
  successful: EmbeddingResult[];
  failed: EmbeddingResult[];
}

interface SectionForEmbedding {
  id: string;
  title: string;
  content: string;
  summary: string | null;
  contentHash: string | null;
}

interface ScenarioForEmbedding {
  id: string;
  title: string;
  description: string | null;
  keywords: string[];
  contentHash: string | null;
}

// ============================================================================
// OpenAI Client (Lazy Initialization)
// ============================================================================

let _openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!_openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    _openaiClient = new OpenAI({ apiKey });
  }
  return _openaiClient;
}

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Generate embedding vector from text using OpenAI
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const client = getOpenAIClient();

  const response = await client.embeddings.create({
    model: EMBEDDING_CONFIG.model,
    input: text,
    dimensions: EMBEDDING_CONFIG.dimensions,
  });

  return response.data[0].embedding;
}

/**
 * Generate SHA256 hash of content for staleness detection
 */
export function generateContentHash(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

/**
 * Check if content has changed by comparing hashes
 */
export function isContentStale(currentHash: string | null, newContent: string): boolean {
  if (!currentHash) return true;
  return currentHash !== generateContentHash(newContent);
}

// ============================================================================
// Section Embedding Functions
// ============================================================================

/**
 * Generate embedding text for a section
 */
function getSectionEmbeddingText(section: SectionForEmbedding): string {
  return EMBEDDING_CONTENT_TEMPLATES.section({
    title: section.title,
    content: section.content,
    summary: section.summary,
  });
}

/**
 * Embed a single section and store in database
 */
export async function embedSection(sectionId: string): Promise<EmbeddingResult> {
  try {
    // Fetch section data
    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      select: {
        id: true,
        title: true,
        content: true,
        summary: true,
        contentHash: true,
      },
    });

    if (!section) {
      return { id: sectionId, success: false, error: 'Section not found' };
    }

    // Generate embedding text and check if content changed
    const embeddingText = getSectionEmbeddingText(section);
    const newHash = generateContentHash(embeddingText);

    // Skip if content hasn't changed
    if (section.contentHash === newHash) {
      return { id: sectionId, success: true };
    }

    // Generate embedding
    const embedding = await generateEmbedding(embeddingText);

    // Store embedding using raw SQL (Prisma doesn't support vector type)
    await prisma.$executeRaw`
      UPDATE sections
      SET
        embedding = ${JSON.stringify(embedding)}::vector,
        embedding_model = ${EMBEDDING_CONFIG.model},
        embedded_at = NOW(),
        content_hash = ${newHash}
      WHERE id = ${sectionId}::uuid
    `;

    return { id: sectionId, success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { id: sectionId, success: false, error: message };
  }
}

/**
 * Batch embed multiple sections
 */
export async function batchEmbedSections(sectionIds: string[]): Promise<BatchEmbeddingResult> {
  const results: BatchEmbeddingResult = { successful: [], failed: [] };

  // Process in batches to avoid rate limits
  for (let i = 0; i < sectionIds.length; i += EMBEDDING_CONFIG.maxBatchSize) {
    const batch = sectionIds.slice(i, i + EMBEDDING_CONFIG.maxBatchSize);

    const batchResults = await Promise.all(batch.map((id) => embedSection(id)));

    for (const result of batchResults) {
      if (result.success) {
        results.successful.push(result);
      } else {
        results.failed.push(result);
      }
    }

    // Small delay between batches to respect rate limits
    if (i + EMBEDDING_CONFIG.maxBatchSize < sectionIds.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return results;
}

// ============================================================================
// Scenario Embedding Functions
// ============================================================================

/**
 * Generate embedding text for a scenario
 */
function getScenarioEmbeddingText(scenario: ScenarioForEmbedding): string {
  return EMBEDDING_CONTENT_TEMPLATES.scenario({
    title: scenario.title,
    description: scenario.description,
    keywords: scenario.keywords,
  });
}

/**
 * Embed a single scenario and store in database
 */
export async function embedScenario(scenarioId: string): Promise<EmbeddingResult> {
  try {
    // Fetch scenario data
    const scenario = await prisma.scenario.findUnique({
      where: { id: scenarioId },
      select: {
        id: true,
        title: true,
        description: true,
        keywords: true,
        contentHash: true,
      },
    });

    if (!scenario) {
      return { id: scenarioId, success: false, error: 'Scenario not found' };
    }

    // Generate embedding text and check if content changed
    const embeddingText = getScenarioEmbeddingText(scenario);
    const newHash = generateContentHash(embeddingText);

    // Skip if content hasn't changed
    if (scenario.contentHash === newHash) {
      return { id: scenarioId, success: true };
    }

    // Generate embedding
    const embedding = await generateEmbedding(embeddingText);

    // Store embedding using raw SQL (Prisma doesn't support vector type)
    await prisma.$executeRaw`
      UPDATE scenarios
      SET
        embedding = ${JSON.stringify(embedding)}::vector,
        embedding_model = ${EMBEDDING_CONFIG.model},
        embedded_at = NOW(),
        content_hash = ${newHash}
      WHERE id = ${scenarioId}::uuid
    `;

    return { id: scenarioId, success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { id: scenarioId, success: false, error: message };
  }
}

/**
 * Batch embed multiple scenarios
 */
export async function batchEmbedScenarios(scenarioIds: string[]): Promise<BatchEmbeddingResult> {
  const results: BatchEmbeddingResult = { successful: [], failed: [] };

  // Process in batches to avoid rate limits
  for (let i = 0; i < scenarioIds.length; i += EMBEDDING_CONFIG.maxBatchSize) {
    const batch = scenarioIds.slice(i, i + EMBEDDING_CONFIG.maxBatchSize);

    const batchResults = await Promise.all(batch.map((id) => embedScenario(id)));

    for (const result of batchResults) {
      if (result.success) {
        results.successful.push(result);
      } else {
        results.failed.push(result);
      }
    }

    // Small delay between batches to respect rate limits
    if (i + EMBEDDING_CONFIG.maxBatchSize < scenarioIds.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return results;
}

// ============================================================================
// Backfill Functions
// ============================================================================

/**
 * Get all sections that need embedding (no embedding or stale content)
 */
export async function getSectionsNeedingEmbedding(): Promise<string[]> {
  const sections = await prisma.section.findMany({
    where: {
      OR: [{ contentHash: null }, { embeddedAt: null }],
    },
    select: { id: true },
  });

  return sections.map((s) => s.id);
}

/**
 * Get all scenarios that need embedding (no embedding or stale content)
 */
export async function getScenariosNeedingEmbedding(): Promise<string[]> {
  const scenarios = await prisma.scenario.findMany({
    where: {
      OR: [{ contentHash: null }, { embeddedAt: null }],
    },
    select: { id: true },
  });

  return scenarios.map((s) => s.id);
}

/**
 * Backfill embeddings for all content that needs it
 */
export async function backfillAllEmbeddings(): Promise<{
  sections: BatchEmbeddingResult;
  scenarios: BatchEmbeddingResult;
}> {
  // Get IDs that need embedding
  const [sectionIds, scenarioIds] = await Promise.all([
    getSectionsNeedingEmbedding(),
    getScenariosNeedingEmbedding(),
  ]);

  // Process sections
  const sectionResults = await batchEmbedSections(sectionIds);

  // Process scenarios
  const scenarioResults = await batchEmbedScenarios(scenarioIds);

  return {
    sections: sectionResults,
    scenarios: scenarioResults,
  };
}

// ============================================================================
// Stats Functions
// ============================================================================

/**
 * Get embedding statistics
 */
export async function getEmbeddingStats(): Promise<{
  sections: { total: number; embedded: number; pending: number };
  scenarios: { total: number; embedded: number; pending: number };
}> {
  const [totalSections, embeddedSections, totalScenarios, embeddedScenarios] = await Promise.all([
    prisma.section.count(),
    prisma.section.count({ where: { embeddedAt: { not: null } } }),
    prisma.scenario.count(),
    prisma.scenario.count({ where: { embeddedAt: { not: null } } }),
  ]);

  return {
    sections: {
      total: totalSections,
      embedded: embeddedSections,
      pending: totalSections - embeddedSections,
    },
    scenarios: {
      total: totalScenarios,
      embedded: embeddedScenarios,
      pending: totalScenarios - embeddedScenarios,
    },
  };
}
