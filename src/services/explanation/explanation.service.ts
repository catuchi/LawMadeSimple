// Explanation Service
// Handles AI-powered legal explanations with caching and streaming

import { ContentType } from '@prisma/client';
import { streamText } from 'ai';
import { prisma } from '@/lib/db';
import { getOpenAI, DEFAULT_AI_CONFIG, estimateTokens } from '@/lib/openai';
import {
  SYSTEM_PROMPT,
  STANDARD_DISCLAIMER,
  buildSectionPrompt,
  buildArticlePrompt,
  buildScenarioPrompt,
  generatePromptHash,
} from '@/constants/prompts';
import type {
  ExplanationData,
  ExplanationContentType,
  ExplanationExample,
  ExplanationSource,
} from '@/types/api';

// ============================================================================
// Types
// ============================================================================

interface ContentData {
  id: string;
  content: string;
  title: string;
  law: {
    title: string;
    shortTitle: string;
  };
  section?: {
    number: string;
    title: string;
  };
}

interface CachedExplanation {
  id: string;
  explanationText: string;
  examples: unknown;
  modelUsed: string;
  tokenCount: number | null;
  createdAt: Date;
  expiresAt: Date | null;
}

// ============================================================================
// Cache Configuration
// ============================================================================

const CACHE_DURATION_DAYS = 30;

function getCacheExpiration(): Date {
  const expiration = new Date();
  expiration.setDate(expiration.getDate() + CACHE_DURATION_DAYS);
  return expiration;
}

// ============================================================================
// Content Fetching
// ============================================================================

/**
 * Fetch section content with law info
 */
async function fetchSection(sectionId: string): Promise<ContentData | null> {
  const section = await prisma.section.findUnique({
    where: { id: sectionId },
    include: {
      law: {
        select: {
          title: true,
          shortTitle: true,
        },
      },
    },
  });

  if (!section) return null;

  return {
    id: section.id,
    content: section.content,
    title: section.title,
    law: section.law,
    section: {
      number: section.number,
      title: section.title,
    },
  };
}

/**
 * Fetch article content with section and law info
 */
async function fetchArticle(articleId: string): Promise<ContentData | null> {
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: {
      section: {
        select: {
          number: true,
          title: true,
          law: {
            select: {
              title: true,
              shortTitle: true,
            },
          },
        },
      },
    },
  });

  if (!article) return null;

  return {
    id: article.id,
    content: article.content,
    title: `Article ${article.number}`,
    law: article.section.law,
    section: {
      number: article.section.number,
      title: article.section.title,
    },
  };
}

/**
 * Fetch scenario content with related sections
 */
async function fetchScenario(
  scenarioId: string
): Promise<(ContentData & { relevantSections: string }) | null> {
  const scenario = await prisma.scenario.findUnique({
    where: { id: scenarioId },
    include: {
      sections: {
        include: {
          section: {
            include: {
              law: {
                select: {
                  title: true,
                  shortTitle: true,
                },
              },
            },
          },
        },
        orderBy: { relevanceOrder: 'asc' },
      },
    },
  });

  if (!scenario) return null;

  // Build relevant sections text
  const sectionsText = scenario.sections
    .map((ss) => `- ${ss.section.law.shortTitle}, ${ss.section.number}: ${ss.section.title}`)
    .join('\n');

  // Get primary law from first section
  const primaryLaw = scenario.sections[0]?.section.law || {
    title: 'Nigerian Law',
    shortTitle: 'Nigerian Law',
  };

  return {
    id: scenario.id,
    content: scenario.description || '',
    title: scenario.title,
    law: primaryLaw,
    relevantSections: sectionsText,
  };
}

/**
 * Fetch content by type and ID
 */
export async function fetchContent(
  contentType: ExplanationContentType,
  contentId: string
): Promise<ContentData | null> {
  switch (contentType) {
    case 'section':
      return fetchSection(contentId);
    case 'article':
      return fetchArticle(contentId);
    case 'scenario':
      return fetchScenario(contentId);
    default:
      return null;
  }
}

// ============================================================================
// Prompt Building
// ============================================================================

function buildPrompt(contentType: ExplanationContentType, content: ContentData): string {
  switch (contentType) {
    case 'section':
      return buildSectionPrompt({
        lawTitle: content.law.title,
        sectionNumber: content.section?.number || '',
        sectionTitle: content.section?.title || content.title,
        content: content.content,
      });
    case 'article':
      return buildArticlePrompt({
        lawTitle: content.law.title,
        sectionNumber: content.section?.number || '',
        sectionTitle: content.section?.title || '',
        articleNumber: content.title,
        content: content.content,
      });
    case 'scenario':
      return buildScenarioPrompt({
        title: content.title,
        description: content.content,
        relevantSections: (content as ContentData & { relevantSections: string }).relevantSections,
      });
    default:
      throw new Error(`Unknown content type: ${contentType}`);
  }
}

// ============================================================================
// Cache Operations
// ============================================================================

/**
 * Get cached explanation if available and not expired
 * @param contentType - Type of content (section, article, scenario)
 * @param contentId - UUID of the content
 * @param contentText - Actual text content for proper cache invalidation
 */
export async function getCachedExplanation(
  contentType: ExplanationContentType,
  contentId: string,
  contentText: string
): Promise<CachedExplanation | null> {
  // Hash includes actual content so cache invalidates when content changes
  const promptHash = generatePromptHash(contentType as ContentType, contentText);

  const explanation = await prisma.explanation.findUnique({
    where: {
      contentType_contentId_promptHash: {
        contentType: contentType as ContentType,
        contentId,
        promptHash,
      },
    },
  });

  if (!explanation) return null;

  // Check if expired
  if (explanation.expiresAt && explanation.expiresAt < new Date()) {
    return null;
  }

  return {
    id: explanation.id,
    explanationText: explanation.explanationText,
    examples: explanation.examples,
    modelUsed: explanation.modelUsed,
    tokenCount: explanation.tokenCount,
    createdAt: explanation.createdAt,
    expiresAt: explanation.expiresAt,
  };
}

/**
 * Save explanation to cache
 * @param contentType - Type of content (section, article, scenario)
 * @param contentId - UUID of the content
 * @param contentText - Actual text content for proper cache key generation
 * @param explanationText - The generated explanation
 * @param examples - Extracted examples
 * @param modelUsed - AI model used for generation
 * @param tokenCount - Estimated token count
 */
export async function saveExplanation(
  contentType: ExplanationContentType,
  contentId: string,
  contentText: string,
  explanationText: string,
  examples: ExplanationExample[],
  modelUsed: string,
  tokenCount?: number
): Promise<string> {
  // Hash includes actual content so cache invalidates when content changes
  const promptHash = generatePromptHash(contentType as ContentType, contentText);

  // Convert examples to JSON-compatible format for Prisma
  const examplesJson = JSON.parse(JSON.stringify(examples));

  const explanation = await prisma.explanation.upsert({
    where: {
      contentType_contentId_promptHash: {
        contentType: contentType as ContentType,
        contentId,
        promptHash,
      },
    },
    update: {
      explanationText,
      examples: examplesJson,
      modelUsed,
      tokenCount,
      expiresAt: getCacheExpiration(),
    },
    create: {
      contentType: contentType as ContentType,
      contentId,
      explanationText,
      examples: examplesJson,
      modelUsed,
      promptHash,
      tokenCount,
      expiresAt: getCacheExpiration(),
    },
  });

  return explanation.id;
}

// ============================================================================
// Explanation Generation
// ============================================================================

/**
 * Generate explanation with streaming
 * Returns a stream that can be piped to SSE response
 */
export async function generateExplanationStream(
  contentType: ExplanationContentType,
  contentId: string
) {
  // Fetch content
  const content = await fetchContent(contentType, contentId);
  if (!content) {
    throw new Error(`Content not found: ${contentType}/${contentId}`);
  }

  // Build prompt
  const userPrompt = buildPrompt(contentType, content);

  // Get OpenAI provider
  const openai = getOpenAI();

  // Generate with streaming
  const result = streamText({
    model: openai(DEFAULT_AI_CONFIG.model),
    system: SYSTEM_PROMPT,
    prompt: userPrompt,
    maxOutputTokens: DEFAULT_AI_CONFIG.maxOutputTokens,
    temperature: DEFAULT_AI_CONFIG.temperature,
  });

  return {
    stream: result,
    content,
    model: DEFAULT_AI_CONFIG.model,
  };
}

/**
 * Build explanation source from content
 */
export function buildExplanationSource(content: ContentData): ExplanationSource {
  return {
    law: content.law.shortTitle,
    section: content.section?.number || '',
    title: content.section?.title || content.title,
  };
}

/**
 * Format explanation data for API response
 */
export function formatExplanationData(
  id: string,
  contentType: ExplanationContentType,
  contentId: string,
  explanation: string,
  examples: ExplanationExample[],
  source: ExplanationSource,
  cached: boolean,
  generatedAt: Date
): ExplanationData {
  return {
    id,
    contentType,
    contentId,
    explanation,
    examples,
    source,
    disclaimer:
      'This explanation is for educational purposes only and does not constitute legal advice.',
    cached,
    generatedAt: generatedAt.toISOString(),
  };
}

/**
 * Extract examples from explanation text
 * Attempts to parse structured examples from the AI response
 */
export function extractExamples(explanationText: string): ExplanationExample[] {
  // Simple extraction - looks for "Real-Life Examples" section
  const examples: ExplanationExample[] = [];

  // Try to find example patterns in the text
  const exampleRegex =
    /(?:Example|Scenario)\s*\d*[:.]\s*([^\n]+)\n([^]*?)(?=(?:Example|Scenario|\*\*|\n\n\d|\n\n-|\n\nKey|$))/gi;
  let match;

  while ((match = exampleRegex.exec(explanationText)) !== null) {
    const title = match[1].trim();
    const content = match[2].trim();

    if (title && content) {
      examples.push({
        title: title.replace(/^\*\*|\*\*$/g, '').trim(),
        scenario: content.split('\n')[0] || content,
        application: content,
      });
    }
  }

  // Limit to 3 examples
  return examples.slice(0, 3);
}

/**
 * Add disclaimer to explanation text
 */
export function addDisclaimer(explanationText: string): string {
  // Check if disclaimer already exists
  if (explanationText.includes('educational purposes only')) {
    return explanationText;
  }
  return explanationText + STANDARD_DISCLAIMER;
}

// ============================================================================
// Full Explanation (Non-streaming)
// ============================================================================

/**
 * Generate full explanation without streaming
 * Used for testing or when streaming is not needed
 */
export async function generateFullExplanation(
  contentType: ExplanationContentType,
  contentId: string
): Promise<{
  text: string;
  tokenCount: number;
  model: string;
  content: ContentData;
}> {
  const { stream, content, model } = await generateExplanationStream(contentType, contentId);

  // Collect full text
  const result = await stream;
  const text = await result.text;
  const tokenCount = estimateTokens(text);

  return {
    text: addDisclaimer(text),
    tokenCount,
    model,
    content,
  };
}
