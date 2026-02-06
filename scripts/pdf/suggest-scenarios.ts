/* eslint-disable no-console */
/**
 * Scenario Suggester CLI
 *
 * Uses AI to suggest scenarios for a law based on its sections.
 * Output is for human review - not automatically added to seed files.
 *
 * Usage:
 *   npm run pdf:suggest-scenarios -- <law-slug>
 *   npm run pdf:suggest-scenarios -- --from-json <slug>.json
 */

import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { PATHS, AI_CONFIG, getPersonasForCategory } from './config';
import type {
  ExtractedLaw,
  ScenarioSuggestions,
  SuggestedScenario,
} from '../../prisma/data/raw/schema';
import { validateExtractedLaw } from '../../prisma/data/raw/schema';

/**
 * CLI Arguments
 */
interface CliArgs {
  slug?: string;
  fromJson: boolean;
  count: number;
}

/**
 * Parse CLI arguments
 */
function parseArgs(): CliArgs {
  const args = process.argv.slice(2);

  const result: CliArgs = {
    fromJson: false,
    count: 5,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--from-json') {
      result.fromJson = true;
    } else if (arg === '--count' && args[i + 1]) {
      result.count = parseInt(args[i + 1], 10);
      i++;
    } else if (!arg.startsWith('-')) {
      result.slug = arg.replace('.json', '');
    }
  }

  return result;
}

/**
 * Display usage information
 */
function showUsage(): void {
  console.log(`
Scenario Suggester CLI

Generates AI-suggested scenarios for a law. Output is saved for human review.

Usage:
  npm run pdf:suggest-scenarios -- <law-slug>           Suggest from extracted JSON
  npm run pdf:suggest-scenarios -- --count 10 <slug>   Suggest 10 scenarios

Options:
  --from-json    Use extracted JSON (default behavior)
  --count N      Number of scenarios to suggest (default: 5)

Examples:
  npm run pdf:suggest-scenarios -- cama-2020
  npm run pdf:suggest-scenarios -- --count 10 copyright-act-2022
`);
}

/**
 * Load law data from JSON
 */
function loadLawData(slug: string): ExtractedLaw {
  const jsonPath = path.join(PATHS.extracted, `${slug}.json`);

  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Extracted JSON not found: ${jsonPath}`);
  }

  const content = fs.readFileSync(jsonPath, 'utf-8');
  const data = JSON.parse(content);

  if (!validateExtractedLaw(data)) {
    throw new Error(`Invalid JSON schema: ${jsonPath}`);
  }

  return data;
}

/**
 * Load existing scenarios to avoid duplicates
 */
function loadExistingScenarios(): string[] {
  const existingSlugs: string[] = [];

  if (!fs.existsSync(PATHS.existingScenarios)) {
    return existingSlugs;
  }

  const files = fs.readdirSync(PATHS.existingScenarios).filter((f) => f.endsWith('.ts'));

  for (const file of files) {
    const content = fs.readFileSync(path.join(PATHS.existingScenarios, file), 'utf-8');
    const matches = content.match(/slug:\s*['"]([^'"]+)['"]/g);
    if (matches) {
      matches.forEach((m) => {
        const slug = m.match(/['"]([^'"]+)['"]/)?.[1];
        if (slug) existingSlugs.push(slug);
      });
    }
  }

  return existingSlugs;
}

/**
 * Build the scenario suggestion prompt
 */
function buildPrompt(law: ExtractedLaw, existingScenarios: string[], count: number): string {
  const personas = getPersonasForCategory(law.law.category);
  const sectionSummary = law.sections
    .slice(0, 20) // Limit to first 20 sections to fit context
    .map((s) => `- Section ${s.number}: ${s.title} - ${s.summary.slice(0, 100)}...`)
    .join('\n');

  return `You are helping create educational scenarios for a Nigerian legal education app.

LAW: ${law.law.title}
CATEGORY: ${law.law.category}
DESCRIPTION: ${law.law.description}

KEY SECTIONS:
${sectionSummary}

TARGET PERSONAS: ${personas.join(', ')}

EXISTING SCENARIOS (avoid duplicates):
${existingScenarios.slice(0, 20).join(', ')}

Generate ${count} practical scenarios that everyday Nigerians might face. Each scenario should:
1. Be based on real situations common in Nigeria
2. Reference specific sections from this law
3. Target one of the personas listed
4. Use simple, relatable language
5. Have a unique slug that doesn't match existing scenarios

Respond with valid JSON:
{
  "scenarios": [
    {
      "slug": "unique-scenario-slug",
      "title": "Short descriptive title",
      "description": "2-3 sentences describing the situation a person might face",
      "iconEmoji": "relevant emoji",
      "keywords": ["keyword1", "keyword2", "keyword3"],
      "targetPersona": "Persona name",
      "relevantSections": ["1", "5", "10"],
      "confidence": 0.9,
      "rationale": "Why this scenario is useful for the target audience"
    }
  ]
}`;
}

/**
 * Call AI to generate suggestions
 */
async function generateSuggestions(
  law: ExtractedLaw,
  existingScenarios: string[],
  count: number
): Promise<SuggestedScenario[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }

  const client = new OpenAI({ apiKey });
  const prompt = buildPrompt(law, existingScenarios, count);

  console.log(`  Requesting ${count} scenarios from AI...`);

  const response = await client.chat.completions.create({
    model: AI_CONFIG.scenarioModel,
    temperature: AI_CONFIG.scenarioTemperature,
    max_tokens: AI_CONFIG.maxTokens,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
          'You are an expert in Nigerian law creating educational scenarios. Always respond with valid JSON.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No content in AI response');
  }

  let parsed: { scenarios: SuggestedScenario[] };
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error(`Failed to parse AI response: ${content.slice(0, 200)}...`);
  }

  return parsed.scenarios;
}

/**
 * Display suggestions
 */
function displaySuggestions(suggestions: ScenarioSuggestions): void {
  console.log('\n' + '='.repeat(60));
  console.log('Suggested Scenarios');
  console.log('='.repeat(60));

  for (const scenario of suggestions.scenarios) {
    console.log(`\n${scenario.iconEmoji} ${scenario.title}`);
    console.log(`   Slug: ${scenario.slug}`);
    console.log(`   Persona: ${scenario.targetPersona}`);
    console.log(`   Description: ${scenario.description}`);
    console.log(`   Sections: ${scenario.relevantSections.join(', ')}`);
    console.log(`   Keywords: ${scenario.keywords.join(', ')}`);
    console.log(`   Confidence: ${(scenario.confidence * 100).toFixed(0)}%`);
    console.log(`   Rationale: ${scenario.rationale}`);
  }
}

/**
 * Save suggestions to file
 */
function saveSuggestions(suggestions: ScenarioSuggestions): string {
  const outputPath = path.join(PATHS.scenarios, `${suggestions.lawSlug}-suggestions.json`);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(suggestions, null, 2));

  return outputPath;
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  console.log('Scenario Suggester');
  console.log('='.repeat(60));

  const args = parseArgs();

  if (!args.slug) {
    showUsage();
    process.exit(0);
  }

  // Load law data
  console.log(`\n1. Loading law data for: ${args.slug}`);
  const law = loadLawData(args.slug);
  console.log(`   Title: ${law.law.title}`);
  console.log(`   Sections: ${law.sections.length}`);

  // Load existing scenarios
  console.log('\n2. Loading existing scenarios...');
  const existingScenarios = loadExistingScenarios();
  console.log(`   Found ${existingScenarios.length} existing scenario(s)`);

  // Generate suggestions
  console.log('\n3. Generating suggestions...');
  const suggestions = await generateSuggestions(law, existingScenarios, args.count);

  // Build output
  const output: ScenarioSuggestions = {
    lawSlug: args.slug,
    generatedAt: new Date().toISOString(),
    model: AI_CONFIG.scenarioModel,
    scenarios: suggestions,
  };

  // Display
  displaySuggestions(output);

  // Save
  console.log('\n4. Saving suggestions...');
  const outputPath = saveSuggestions(output);
  console.log(`   Saved to: ${outputPath}`);

  console.log('\n' + '='.repeat(60));
  console.log('Next Steps');
  console.log('='.repeat(60));
  console.log('\n1. Review the suggested scenarios in the JSON file');
  console.log('2. Select/modify scenarios you want to add');
  console.log('3. Add them to the appropriate file in prisma/data/scenarios/');
  console.log('4. Run: npm run db:seed && npm run backfill-embeddings');
}

// Run
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
