// Embedding Service
// Handles generating and storing embeddings for semantic search using OpenAI + pgvector

import { createHash } from 'crypto';
import OpenAI from 'openai';
import { prisma } from '@/lib/db';
import { EMBEDDING_CONFIG, EMBEDDING_CONTENT_TEMPLATES } from '@/constants/embeddings';

// ============================================================================
// Types
// ============================================================================

export interface EmbeddingResult {
  id: string;
  success: boolean;
  error?: string;
}

export interface BatchEmbeddingResult {
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
// Configuration Validation
// ============================================================================

/**
 * Validate embedding configuration at startup
 * Call this during app initialization to catch config errors early
 */
export function validateEmbeddingConfig(): { valid: boolean; error?: string } {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { valid: false, error: 'OPENAI_API_KEY environment variable is not set' };
  }
  if (apiKey.length < 20) {
    return { valid: false, error: 'OPENAI_API_KEY appears invalid (too short)' };
  }
  return { valid: true };
}

/**
 * Log warning if embedding config is invalid
 * Safe to call at startup - won't throw
 */
export function ensureEmbeddingConfigValid(): void {
  const { valid, error } = validateEmbeddingConfig();
  if (!valid) {
    console.warn(`[Embedding] Configuration warning: ${error}`);
  }
}

// ============================================================================
// Retry Logic with Exponential Backoff
// ============================================================================

interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
}

/**
 * Execute a function with exponential backoff retry
 * Does not retry on invalid API key errors
 */
async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const { maxRetries = 3, baseDelayMs = 1000, maxDelayMs = 10000 } = options;
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on authentication errors
      if (
        lastError.message.includes('Invalid API Key') ||
        lastError.message.includes('Incorrect API key') ||
        lastError.message.includes('401')
      ) {
        logEmbedding('auth_error', { error: lastError.message });
        throw lastError;
      }

      // Don't retry on the last attempt
      if (attempt < maxRetries - 1) {
        const delay = Math.min(baseDelayMs * Math.pow(2, attempt), maxDelayMs);
        logEmbedding('retry', {
          attempt: attempt + 1,
          maxRetries,
          delayMs: delay,
          error: lastError.message,
        });
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

// ============================================================================
// Structured Logging
// ============================================================================

/**
 * Log embedding events with structured data
 * Uses console.warn for visibility in logs (console.log not allowed by lint)
 */
function logEmbedding(event: string, data: Record<string, unknown>): void {
  const timestamp = new Date().toISOString();
  console.warn(`[Embedding] ${timestamp} ${event}`, JSON.stringify(data));
}

// ============================================================================
// OpenAI Client (Lazy Initialization)
// ============================================================================

const EMBEDDING_TIMEOUT_MS = 30000; // 30 seconds

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
 * Includes retry logic and timeout protection
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const client = getOpenAIClient();
  const startTime = Date.now();

  const response = await withRetry(async () => {
    // Create timeout promise
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Embedding generation timeout after ${EMBEDDING_TIMEOUT_MS}ms`)),
        EMBEDDING_TIMEOUT_MS
      )
    );

    // Race between embedding and timeout
    const embeddingPromise = client.embeddings.create({
      model: EMBEDDING_CONFIG.model,
      input: text,
      dimensions: EMBEDDING_CONFIG.dimensions,
    });

    return Promise.race([embeddingPromise, timeoutPromise]);
  });

  const duration = Date.now() - startTime;
  logEmbedding('generated', {
    durationMs: duration,
    textLength: text.length,
    model: EMBEDDING_CONFIG.model,
  });

  return response.data[0].embedding;
}

/**
 * Generate embeddings for multiple texts in a single API call
 * More efficient than calling generateEmbedding() multiple times
 */
export async function generateEmbeddingsBatch(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];

  const client = getOpenAIClient();
  const startTime = Date.now();

  const response = await withRetry(async () => {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Batch embedding timeout after ${EMBEDDING_TIMEOUT_MS}ms`)),
        EMBEDDING_TIMEOUT_MS
      )
    );

    const embeddingPromise = client.embeddings.create({
      model: EMBEDDING_CONFIG.model,
      input: texts,
      dimensions: EMBEDDING_CONFIG.dimensions,
    });

    return Promise.race([embeddingPromise, timeoutPromise]);
  });

  const duration = Date.now() - startTime;
  logEmbedding('batch_generated', {
    durationMs: duration,
    count: texts.length,
    totalChars: texts.reduce((sum, t) => sum + t.length, 0),
    model: EMBEDDING_CONFIG.model,
  });

  // Sort by index to maintain order (OpenAI may return out of order)
  return response.data.sort((a, b) => a.index - b.index).map((d) => d.embedding);
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
  const startTime = Date.now();

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
      logEmbedding('section_not_found', { sectionId });
      return { id: sectionId, success: false, error: 'Section not found' };
    }

    // Generate embedding text and check if content changed
    const embeddingText = getSectionEmbeddingText(section);
    const newHash = generateContentHash(embeddingText);

    // Skip if content hasn't changed
    if (section.contentHash === newHash) {
      logEmbedding('section_unchanged', { sectionId });
      return { id: sectionId, success: true };
    }

    // Generate embedding
    const embedding = await generateEmbedding(embeddingText);

    // Store embedding using raw SQL (Prisma doesn't support vector type)
    // Cast column to text for comparison (Prisma params are text)
    try {
      await prisma.$executeRaw`
        UPDATE sections
        SET
          embedding = ${JSON.stringify(embedding)}::vector,
          embedding_model = ${EMBEDDING_CONFIG.model},
          embedded_at = NOW(),
          content_hash = ${newHash}
        WHERE id::text = ${sectionId}
      `;
    } catch (storageError) {
      const message = storageError instanceof Error ? storageError.message : 'Storage failed';
      logEmbedding('section_storage_error', { sectionId, error: message });
      return { id: sectionId, success: false, error: `Failed to store embedding: ${message}` };
    }

    logEmbedding('section_embedded', {
      sectionId,
      durationMs: Date.now() - startTime,
      textLength: embeddingText.length,
    });

    return { id: sectionId, success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logEmbedding('section_error', { sectionId, error: message });
    return { id: sectionId, success: false, error: message };
  }
}

/**
 * Batch embed multiple sections using true batch OpenAI API
 * More efficient than calling embedSection() for each item
 */
export async function batchEmbedSections(sectionIds: string[]): Promise<BatchEmbeddingResult> {
  const results: BatchEmbeddingResult = { successful: [], failed: [] };

  if (sectionIds.length === 0) return results;

  // Process in batches
  for (let i = 0; i < sectionIds.length; i += EMBEDDING_CONFIG.maxBatchSize) {
    const batchIds = sectionIds.slice(i, i + EMBEDDING_CONFIG.maxBatchSize);
    const batchStartTime = Date.now();

    // Fetch all sections in this batch
    const sections = await prisma.section.findMany({
      where: { id: { in: batchIds } },
      select: {
        id: true,
        title: true,
        content: true,
        summary: true,
        contentHash: true,
      },
    });

    // Track which IDs were not found
    const foundIds = new Set(sections.map((s) => s.id));
    for (const id of batchIds) {
      if (!foundIds.has(id)) {
        results.failed.push({ id, success: false, error: 'Section not found' });
      }
    }

    // Prepare items that need embedding (filter out unchanged)
    const itemsToEmbed: Array<{
      id: string;
      text: string;
      hash: string;
    }> = [];

    for (const section of sections) {
      const embeddingText = getSectionEmbeddingText(section);
      const newHash = generateContentHash(embeddingText);

      if (section.contentHash === newHash) {
        // Content unchanged, skip but mark as successful
        results.successful.push({ id: section.id, success: true });
      } else {
        itemsToEmbed.push({ id: section.id, text: embeddingText, hash: newHash });
      }
    }

    // Generate embeddings in batch if there are items to embed
    if (itemsToEmbed.length > 0) {
      try {
        const texts = itemsToEmbed.map((item) => item.text);
        const embeddings = await generateEmbeddingsBatch(texts);

        // Store each embedding
        for (let j = 0; j < itemsToEmbed.length; j++) {
          const item = itemsToEmbed[j];
          const embedding = embeddings[j];

          try {
            await prisma.$executeRaw`
              UPDATE sections
              SET
                embedding = ${JSON.stringify(embedding)}::vector,
                embedding_model = ${EMBEDDING_CONFIG.model},
                embedded_at = NOW(),
                content_hash = ${item.hash}
              WHERE id::text = ${item.id}
            `;
            results.successful.push({ id: item.id, success: true });
          } catch (storageError) {
            const message = storageError instanceof Error ? storageError.message : 'Storage failed';
            results.failed.push({
              id: item.id,
              success: false,
              error: `Failed to store: ${message}`,
            });
          }
        }
      } catch (error) {
        // Batch embedding failed - mark all items in this batch as failed
        const message = error instanceof Error ? error.message : 'Embedding generation failed';
        for (const item of itemsToEmbed) {
          results.failed.push({ id: item.id, success: false, error: message });
        }
      }
    }

    logEmbedding('batch_sections_completed', {
      batchIndex: Math.floor(i / EMBEDDING_CONFIG.maxBatchSize),
      batchSize: batchIds.length,
      embedded: itemsToEmbed.length,
      skipped: batchIds.length - itemsToEmbed.length - (batchIds.length - foundIds.size),
      notFound: batchIds.length - foundIds.size,
      durationMs: Date.now() - batchStartTime,
    });

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
  const startTime = Date.now();

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
      logEmbedding('scenario_not_found', { scenarioId });
      return { id: scenarioId, success: false, error: 'Scenario not found' };
    }

    // Generate embedding text and check if content changed
    const embeddingText = getScenarioEmbeddingText(scenario);
    const newHash = generateContentHash(embeddingText);

    // Skip if content hasn't changed
    if (scenario.contentHash === newHash) {
      logEmbedding('scenario_unchanged', { scenarioId });
      return { id: scenarioId, success: true };
    }

    // Generate embedding
    const embedding = await generateEmbedding(embeddingText);

    // Store embedding using raw SQL (Prisma doesn't support vector type)
    // Cast column to text for comparison (Prisma params are text)
    try {
      await prisma.$executeRaw`
        UPDATE scenarios
        SET
          embedding = ${JSON.stringify(embedding)}::vector,
          embedding_model = ${EMBEDDING_CONFIG.model},
          embedded_at = NOW(),
          content_hash = ${newHash}
        WHERE id::text = ${scenarioId}
      `;
    } catch (storageError) {
      const message = storageError instanceof Error ? storageError.message : 'Storage failed';
      logEmbedding('scenario_storage_error', { scenarioId, error: message });
      return { id: scenarioId, success: false, error: `Failed to store embedding: ${message}` };
    }

    logEmbedding('scenario_embedded', {
      scenarioId,
      durationMs: Date.now() - startTime,
      textLength: embeddingText.length,
    });

    return { id: scenarioId, success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logEmbedding('scenario_error', { scenarioId, error: message });
    return { id: scenarioId, success: false, error: message };
  }
}

/**
 * Batch embed multiple scenarios using true batch OpenAI API
 * More efficient than calling embedScenario() for each item
 */
export async function batchEmbedScenarios(scenarioIds: string[]): Promise<BatchEmbeddingResult> {
  const results: BatchEmbeddingResult = { successful: [], failed: [] };

  if (scenarioIds.length === 0) return results;

  // Process in batches
  for (let i = 0; i < scenarioIds.length; i += EMBEDDING_CONFIG.maxBatchSize) {
    const batchIds = scenarioIds.slice(i, i + EMBEDDING_CONFIG.maxBatchSize);
    const batchStartTime = Date.now();

    // Fetch all scenarios in this batch
    const scenarios = await prisma.scenario.findMany({
      where: { id: { in: batchIds } },
      select: {
        id: true,
        title: true,
        description: true,
        keywords: true,
        contentHash: true,
      },
    });

    // Track which IDs were not found
    const foundIds = new Set(scenarios.map((s) => s.id));
    for (const id of batchIds) {
      if (!foundIds.has(id)) {
        results.failed.push({ id, success: false, error: 'Scenario not found' });
      }
    }

    // Prepare items that need embedding (filter out unchanged)
    const itemsToEmbed: Array<{
      id: string;
      text: string;
      hash: string;
    }> = [];

    for (const scenario of scenarios) {
      const embeddingText = getScenarioEmbeddingText(scenario);
      const newHash = generateContentHash(embeddingText);

      if (scenario.contentHash === newHash) {
        // Content unchanged, skip but mark as successful
        results.successful.push({ id: scenario.id, success: true });
      } else {
        itemsToEmbed.push({ id: scenario.id, text: embeddingText, hash: newHash });
      }
    }

    // Generate embeddings in batch if there are items to embed
    if (itemsToEmbed.length > 0) {
      try {
        const texts = itemsToEmbed.map((item) => item.text);
        const embeddings = await generateEmbeddingsBatch(texts);

        // Store each embedding
        for (let j = 0; j < itemsToEmbed.length; j++) {
          const item = itemsToEmbed[j];
          const embedding = embeddings[j];

          try {
            await prisma.$executeRaw`
              UPDATE scenarios
              SET
                embedding = ${JSON.stringify(embedding)}::vector,
                embedding_model = ${EMBEDDING_CONFIG.model},
                embedded_at = NOW(),
                content_hash = ${item.hash}
              WHERE id::text = ${item.id}
            `;
            results.successful.push({ id: item.id, success: true });
          } catch (storageError) {
            const message = storageError instanceof Error ? storageError.message : 'Storage failed';
            results.failed.push({
              id: item.id,
              success: false,
              error: `Failed to store: ${message}`,
            });
          }
        }
      } catch (error) {
        // Batch embedding failed - mark all items in this batch as failed
        const message = error instanceof Error ? error.message : 'Embedding generation failed';
        for (const item of itemsToEmbed) {
          results.failed.push({ id: item.id, success: false, error: message });
        }
      }
    }

    logEmbedding('batch_scenarios_completed', {
      batchIndex: Math.floor(i / EMBEDDING_CONFIG.maxBatchSize),
      batchSize: batchIds.length,
      embedded: itemsToEmbed.length,
      skipped: batchIds.length - itemsToEmbed.length - (batchIds.length - foundIds.size),
      notFound: batchIds.length - foundIds.size,
      durationMs: Date.now() - batchStartTime,
    });

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
