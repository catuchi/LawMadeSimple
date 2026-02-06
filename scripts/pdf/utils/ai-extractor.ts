/* eslint-disable no-console */
/**
 * AI Extractor Utility
 *
 * Uses OpenAI to extract structured law data from PDF text.
 */

import OpenAI from 'openai';
import { AI_CONFIG, RATE_LIMIT, getCategoryHint } from '../config';
import type { ExtractedSection } from '../../../prisma/data/raw/schema';

/**
 * Raw extraction result from a single chunk
 */
export interface ChunkExtractionResult {
  /** Chunk index that was processed */
  chunkIndex: number;

  /** Extracted sections from this chunk */
  sections: ExtractedSection[];

  /** Law metadata (only reliable from first chunk) */
  lawMetadata?: {
    title: string;
    shortTitle: string;
    description: string;
    effectiveDate?: string;
  };

  /** Confidence score for this chunk */
  confidence: number;

  /** Warnings from extraction */
  warnings: string[];

  /** Processing time in ms */
  processingTimeMs: number;
}

/**
 * Initialize OpenAI client
 */
function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }
  return new OpenAI({ apiKey });
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry with exponential backoff
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = RATE_LIMIT.maxRetries
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on certain errors
      if (
        lastError.message.includes('Invalid API Key') ||
        lastError.message.includes('Incorrect API key')
      ) {
        throw lastError;
      }

      if (attempt < maxRetries) {
        const delay = RATE_LIMIT.retryBaseDelay * Math.pow(2, attempt);
        console.log(`  Retry ${attempt + 1}/${maxRetries} after ${delay}ms: ${lastError.message}`);
        await sleep(delay);
      }
    }
  }

  throw lastError;
}

/**
 * Build the extraction prompt
 */
function buildExtractionPrompt(
  text: string,
  filename: string,
  chunkIndex: number,
  totalChunks: number,
  categoryHint?: string
): string {
  const isFirstChunk = chunkIndex === 0;

  return `You are a legal document parser specializing in Nigerian law. Extract structured data from this PDF text.

${isFirstChunk ? `This is the FIRST chunk of "${filename}". Extract the law's title and metadata.` : `This is chunk ${chunkIndex + 1} of ${totalChunks} from "${filename}". Focus only on sections.`}

${categoryHint ? `Category hint: This appears to be a ${categoryHint} law.` : ''}

CRITICAL RULES:
1. Extract section content VERBATIM - do not paraphrase or summarize the legal text
2. Generate a plain-language summary (2-3 sentences) for Nigerian non-lawyers
3. Preserve exact section numbering (e.g., "33", "33(1)", "33(1)(a)")
4. Report confidence (0-1) based on text clarity
5. Note any extraction issues in warnings

For each section found, extract:
- number: The section number exactly as written
- title: The section heading/title
- content: The FULL legal text (verbatim, may be long)
- summary: Plain-language explanation for everyday Nigerians
- orderIndex: Sequential order (starting from previous chunk's last index if applicable)
- confidence: How confident you are in this extraction (0-1)

${
  isFirstChunk
    ? `Also extract:
- title: Full official law title
- shortTitle: Abbreviated name (e.g., "CAMA 2020", "Constitution 1999")
- description: 1-2 sentence plain-language description
- effectiveDate: When the law took effect (if mentioned)`
    : ''
}

Respond with valid JSON matching this structure:
{
  ${
    isFirstChunk
      ? `"lawMetadata": {
    "title": "string",
    "shortTitle": "string",
    "description": "string",
    "effectiveDate": "YYYY-MM-DD or null"
  },`
      : ''
  }
  "sections": [
    {
      "number": "string",
      "title": "string",
      "content": "string (verbatim legal text)",
      "summary": "string (plain language)",
      "orderIndex": number,
      "confidence": number
    }
  ],
  "confidence": number,
  "warnings": ["string"]
}

TEXT TO PROCESS:
---
${text}
---`;
}

/**
 * Extract sections from a single chunk of text
 */
export async function extractFromChunk(
  text: string,
  filename: string,
  chunkIndex: number,
  totalChunks: number,
  startingOrderIndex: number = 0
): Promise<ChunkExtractionResult> {
  const startTime = Date.now();
  const client = getOpenAIClient();
  const categoryHint = getCategoryHint(filename);

  const prompt = buildExtractionPrompt(text, filename, chunkIndex, totalChunks, categoryHint);

  const response = await withRetry(async () => {
    return client.chat.completions.create({
      model: AI_CONFIG.extractionModel,
      temperature: AI_CONFIG.extractionTemperature,
      max_tokens: AI_CONFIG.maxTokens,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You are a legal document parser. Always respond with valid JSON. Extract content verbatim while generating helpful summaries.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No content in AI response');
  }

  let parsed: {
    lawMetadata?: {
      title: string;
      shortTitle: string;
      description: string;
      effectiveDate?: string;
    };
    sections: Array<{
      number: string;
      title: string;
      content: string;
      summary: string;
      orderIndex: number;
      confidence: number;
    }>;
    confidence: number;
    warnings: string[];
  };

  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error(`Failed to parse AI response as JSON: ${content.slice(0, 200)}...`);
  }

  // Adjust order indices based on starting index
  const sections: ExtractedSection[] = parsed.sections.map((s, i) => ({
    number: s.number,
    title: s.title,
    content: s.content,
    summary: s.summary,
    orderIndex: startingOrderIndex + i,
    pageNumbers: [], // Will be estimated later
    confidence: s.confidence ?? 0.8,
  }));

  return {
    chunkIndex,
    sections,
    lawMetadata: parsed.lawMetadata,
    confidence: parsed.confidence ?? 0.8,
    warnings: parsed.warnings ?? [],
    processingTimeMs: Date.now() - startTime,
  };
}

/**
 * Extract from multiple chunks with rate limiting
 */
export async function extractFromAllChunks(
  chunks: Array<{ index: number; text: string }>,
  filename: string,
  onProgress?: (completed: number, total: number) => void
): Promise<ChunkExtractionResult[]> {
  const results: ChunkExtractionResult[] = [];
  let orderIndex = 0;

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    console.log(`  Processing chunk ${i + 1}/${chunks.length}...`);

    const result = await extractFromChunk(
      chunk.text,
      filename,
      chunk.index,
      chunks.length,
      orderIndex
    );

    results.push(result);
    orderIndex += result.sections.length;

    onProgress?.(i + 1, chunks.length);

    // Rate limiting between chunks
    if (i < chunks.length - 1) {
      await sleep(RATE_LIMIT.delayBetweenCalls);
    }
  }

  return results;
}

/**
 * Validate API key is configured
 */
export function validateApiKey(): boolean {
  return !!process.env.OPENAI_API_KEY;
}
