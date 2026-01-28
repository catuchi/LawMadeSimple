// AI Prompt Templates for Legal Explanations
// Designed for plain language explanations of Nigerian law

import { ContentType } from '@prisma/client';

// ============================================================================
// System Prompts
// ============================================================================

/**
 * Base system prompt for all legal explanations
 * Establishes persona and constraints
 */
export const SYSTEM_PROMPT = `You are LawMadeSimple, an AI assistant that helps common Nigerians understand their legal rights and obligations. Your role is to translate complex legal language into plain, everyday English that anyone can understand.

IMPORTANT GUIDELINES:
1. Use simple, everyday language - avoid legal jargon
2. Explain concepts as if talking to someone with no legal background
3. Use relatable Nigerian examples (landlord disputes, workplace issues, business registration, etc.)
4. Be culturally aware - use Nigerian context and references where appropriate
5. NEVER provide legal advice or recommend specific actions
6. Always clarify you're providing educational information, not legal advice
7. Structure responses with clear headings and bullet points
8. Keep explanations focused and practical

TARGET AUDIENCE: Common Nigerians, SME owners, young creatives, and employees trying to understand their rights.`;

// ============================================================================
// Content-Specific Prompts
// ============================================================================

/**
 * Prompt template for explaining law sections
 */
export const SECTION_EXPLANATION_PROMPT = `Explain the following legal section in plain, simple English that any Nigerian can understand.

LAW: {{lawTitle}}
SECTION: {{sectionNumber}} - {{sectionTitle}}

LEGAL TEXT:
{{content}}

Please provide:
1. **What This Means**: A clear, simple explanation of what this law says
2. **Why It Matters**: How this affects everyday Nigerians
3. **Real-Life Examples**: 2-3 practical scenarios showing how this applies
4. **Key Points to Remember**: Important takeaways in bullet points

Remember to use everyday language and Nigerian context in your examples.`;

/**
 * Prompt template for explaining articles within sections
 */
export const ARTICLE_EXPLANATION_PROMPT = `Explain the following article from Nigerian law in plain, simple English.

LAW: {{lawTitle}}
SECTION: {{sectionNumber}} - {{sectionTitle}}
ARTICLE: {{articleNumber}}

LEGAL TEXT:
{{content}}

Please provide:
1. **What This Means**: A clear, simple explanation
2. **Practical Example**: A real-world scenario showing how this applies
3. **Key Takeaway**: The most important thing to remember

Use everyday language and Nigerian context.`;

/**
 * Prompt template for explaining scenarios
 */
export const SCENARIO_EXPLANATION_PROMPT = `Provide guidance for someone facing this situation in Nigeria.

SITUATION: {{title}}
{{description}}

RELEVANT LAWS:
{{relevantSections}}

Please provide:
1. **Understanding Your Situation**: What the law says about this
2. **Your Rights**: What protections you have
3. **Your Obligations**: What you must do
4. **Practical Steps**: General guidance on what to consider
5. **When to Seek Help**: Signs you should consult a lawyer

Remember: Provide educational information only, not legal advice.`;

// ============================================================================
// Disclaimer Templates
// ============================================================================

/**
 * Standard disclaimer appended to all explanations
 */
export const STANDARD_DISCLAIMER = `

---
**Important Notice**: This explanation is for educational purposes only and does not constitute legal advice. Laws may change, and your specific situation may have unique factors not covered here. For matters affecting your rights, property, or livelihood, please consult a qualified Nigerian lawyer.`;

/**
 * Short disclaimer for streaming responses
 */
export const SHORT_DISCLAIMER =
  '\n\n_This is educational information, not legal advice. Consult a lawyer for your specific situation._';

// ============================================================================
// Prompt Builder Functions
// ============================================================================

interface SectionContext {
  lawTitle: string;
  sectionNumber: string;
  sectionTitle: string;
  content: string;
}

interface ArticleContext {
  lawTitle: string;
  sectionNumber: string;
  sectionTitle: string;
  articleNumber: string;
  content: string;
}

interface ScenarioContext {
  title: string;
  description: string;
  relevantSections: string;
}

/**
 * Build a prompt for section explanation
 */
export function buildSectionPrompt(context: SectionContext): string {
  return SECTION_EXPLANATION_PROMPT.replace('{{lawTitle}}', context.lawTitle)
    .replace('{{sectionNumber}}', context.sectionNumber)
    .replace('{{sectionTitle}}', context.sectionTitle)
    .replace('{{content}}', context.content);
}

/**
 * Build a prompt for article explanation
 */
export function buildArticlePrompt(context: ArticleContext): string {
  return ARTICLE_EXPLANATION_PROMPT.replace('{{lawTitle}}', context.lawTitle)
    .replace('{{sectionNumber}}', context.sectionNumber)
    .replace('{{sectionTitle}}', context.sectionTitle)
    .replace('{{articleNumber}}', context.articleNumber)
    .replace('{{content}}', context.content);
}

/**
 * Build a prompt for scenario explanation
 */
export function buildScenarioPrompt(context: ScenarioContext): string {
  return SCENARIO_EXPLANATION_PROMPT.replace('{{title}}', context.title)
    .replace('{{description}}', context.description || '')
    .replace('{{relevantSections}}', context.relevantSections);
}

// ============================================================================
// Prompt Hash Generation
// ============================================================================

/**
 * Generate a hash for cache key purposes
 * Uses a simple hash to identify prompt versions
 */
export function generatePromptHash(contentType: ContentType, content: string): string {
  const input = `${contentType}:${PROMPT_VERSION}:${content}`;
  return hashString(input);
}

/**
 * Simple string hash for caching purposes
 * Not cryptographic - just for cache key generation
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Prompt version for cache invalidation
 * Increment when prompts change significantly
 */
export const PROMPT_VERSION = '1.0';

// ============================================================================
// Example Structure for Response Parsing
// ============================================================================

export interface ExplanationExample {
  title: string;
  scenario: string;
  application: string;
}

export interface ParsedExplanation {
  mainExplanation: string;
  examples: ExplanationExample[];
  keyPoints: string[];
}
