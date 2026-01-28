// OpenAI Client Configuration
// Uses Vercel AI SDK with OpenAI provider for streaming support

import { createOpenAI } from '@ai-sdk/openai';

// ============================================================================
// Environment Variables
// ============================================================================

function getOpenAIKey(): string {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  return key;
}

// ============================================================================
// OpenAI Provider (Vercel AI SDK)
// ============================================================================

/**
 * OpenAI provider configured for the Vercel AI SDK
 * Lazy initialization to avoid errors during build time
 */
let _openai: ReturnType<typeof createOpenAI> | null = null;

export function getOpenAI() {
  if (!_openai) {
    _openai = createOpenAI({
      apiKey: getOpenAIKey(),
    });
  }
  return _openai;
}

// ============================================================================
// Model Configuration
// ============================================================================

export const AI_MODELS = {
  // Primary model for explanations - good balance of quality and cost
  primary: 'gpt-4o-mini',
  // Fallback for complex explanations or when higher quality needed
  advanced: 'gpt-4o',
} as const;

export type AIModel = (typeof AI_MODELS)[keyof typeof AI_MODELS];

// ============================================================================
// Token & Cost Estimation
// ============================================================================

// Approximate tokens per character (varies by language)
const TOKENS_PER_CHAR = 0.25;

/**
 * Rough estimate of token count for a string
 * More accurate counting would require tokenizer library
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length * TOKENS_PER_CHAR);
}

// ============================================================================
// Model Configuration Defaults
// ============================================================================

export const DEFAULT_AI_CONFIG = {
  model: AI_MODELS.primary,
  maxOutputTokens: 1500,
  temperature: 0.7, // Balanced between creativity and consistency
} as const;
