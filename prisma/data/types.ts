/**
 * TypeScript types for seed data
 * Used to ensure type safety when defining laws, sections, and scenarios
 */

import { LawCategory } from '@prisma/client';

/**
 * Law data structure for seeding
 */
export interface LawData {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  category: LawCategory;
  effectiveDate: Date;
  sourceUrl: string;
  isActive?: boolean;
}

/**
 * Section data structure for seeding
 * Note: lawId is added during the seeding process
 */
export interface SectionData {
  slug: string;
  number: string;
  title: string;
  content: string;
  summary: string;
  orderIndex: number;
  parentSectionId?: string;
}

/**
 * Combined law with its sections for easier organization
 */
export interface LawWithSections {
  law: LawData;
  sections: SectionData[];
}

/**
 * Scenario data structure for seeding
 */
export interface ScenarioData {
  slug: string;
  title: string;
  description: string;
  iconEmoji: string;
  keywords: string[];
  category: LawCategory;
  isFeatured?: boolean;
}

/**
 * Scenario to section mapping
 * Uses slugs for easy human-readable reference
 */
export interface ScenarioMappingData {
  scenarioSlug: string;
  lawSlug: string;
  sectionSlug: string;
  relevanceOrder: number;
  relevanceNote?: string;
}

/**
 * Complete scenario with its section mappings
 */
export interface ScenarioWithMappings {
  scenario: ScenarioData;
  mappings: Omit<ScenarioMappingData, 'scenarioSlug'>[];
}

/**
 * Seed result tracking for logging
 */
export interface SeedResult {
  laws: { created: number; updated: number; errors: string[] };
  sections: { created: number; updated: number; errors: string[] };
  scenarios: { created: number; updated: number; errors: string[] };
  mappings: { created: number; updated: number; errors: string[] };
}

/**
 * Initialize empty seed result
 */
export function createEmptySeedResult(): SeedResult {
  return {
    laws: { created: 0, updated: 0, errors: [] },
    sections: { created: 0, updated: 0, errors: [] },
    scenarios: { created: 0, updated: 0, errors: [] },
    mappings: { created: 0, updated: 0, errors: [] },
  };
}
