// Embedding Configuration for Semantic Search
// Uses OpenAI text-embedding-3-small model with pgvector

export const EMBEDDING_CONFIG = {
  // ============================================================================
  // OpenAI Embedding Model Configuration
  // ============================================================================

  /** OpenAI embedding model to use */
  model: 'text-embedding-3-small',

  /** Vector dimensions (1536 for text-embedding-3-small) */
  dimensions: 1536,

  // ============================================================================
  // Batch Processing Configuration
  // ============================================================================

  /**
   * Maximum items to process in a single batch
   * OpenAI supports up to 2048 inputs per request, but we use a conservative limit
   */
  maxBatchSize: 100,

  /** Maximum tokens per embedding request (OpenAI limit for text-embedding-3-small) */
  maxTokensPerRequest: 8191,

  // ============================================================================
  // Search Configuration
  // ============================================================================

  /**
   * Minimum cosine similarity to include in results (0-1)
   *
   * text-embedding-3-small produces lower similarity scores than older models,
   * so we use a lower threshold (0.15 instead of 0.7).
   *
   * Guidelines:
   * - 0.15-0.30: Topically related but may be loosely connected
   * - 0.30-0.50: Reasonably relevant content
   * - 0.50+: Strong semantic match
   *
   * Can be overridden per-request via HybridSearchOptions.similarityThreshold
   */
  defaultSimilarityThreshold: 0.15,

  /** Max results from vector search before RRF fusion */
  maxSemanticResults: 50,

  // ============================================================================
  // Reciprocal Rank Fusion (RRF) Parameters
  // ============================================================================

  /**
   * RRF constant (k) - controls how much rank differences affect the final score
   *
   * The RRF formula: score = sum(1 / (k + rank))
   *
   * Higher k values:
   * - Make rank differences less impactful (scores converge)
   * - Result in more equal weighting across all ranked items
   *
   * Lower k values:
   * - Amplify differences between top-ranked and lower-ranked items
   * - Give more weight to the top few results
   *
   * k=60 is the commonly used value from "Reciprocal Rank Fusion outperforms
   * Condorcet and individual Rank Learning Methods" (Cormack et al., 2009)
   */
  rrfK: 60,

  /**
   * Default weight for semantic vs keyword search in hybrid mode (0-1)
   *
   * - 0.0 = Pure keyword search (no semantic component)
   * - 0.5 = Equal weight to semantic and keyword
   * - 0.6 = Default: 60% semantic, 40% keyword (good balance)
   * - 1.0 = Pure semantic search (no keyword component)
   *
   * Tune based on your content and user search patterns:
   * - Higher semantic weight for natural language questions ("can police arrest me?")
   * - Lower semantic weight for specific term lookups ("Section 33 Constitution")
   */
  defaultSemanticWeight: 0.6,
} as const;

// Content templates for generating embeddings
// These templates structure content consistently for better semantic matching
export const EMBEDDING_CONTENT_TEMPLATES = {
  /**
   * Generate embedding text for a law section
   * Combines title, summary, and full content
   */
  section: (section: { title: string; content: string; summary?: string | null }) =>
    [section.title, section.summary || '', section.content].filter(Boolean).join('\n\n').trim(),

  /**
   * Generate embedding text for a scenario
   * Combines title, description, and keywords for context
   */
  scenario: (scenario: { title: string; description?: string | null; keywords: string[] }) =>
    [scenario.title, scenario.description || '', `Keywords: ${scenario.keywords.join(', ')}`]
      .filter(Boolean)
      .join('\n\n')
      .trim(),
} as const;

// Type exports
export type EmbeddingModel = typeof EMBEDDING_CONFIG.model;
export type ContentType = keyof typeof EMBEDDING_CONTENT_TEMPLATES;
