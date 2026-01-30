// Embedding Configuration for Semantic Search
// Uses OpenAI text-embedding-3-small model with pgvector

export const EMBEDDING_CONFIG = {
  // OpenAI embedding model
  model: 'text-embedding-3-small',
  dimensions: 1536,

  // Batch processing limits
  maxBatchSize: 100,
  maxTokensPerRequest: 8191, // OpenAI limit for text-embedding-3-small

  // Search configuration
  defaultSimilarityThreshold: 0.7, // Minimum cosine similarity to include in results
  maxSemanticResults: 50, // Max results from vector search before fusion

  // Reciprocal Rank Fusion (RRF) parameters
  rrfK: 60, // RRF constant - higher values reduce impact of rank differences
  defaultSemanticWeight: 0.6, // Weight for semantic vs keyword (0.6 = 60% semantic, 40% keyword)
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
