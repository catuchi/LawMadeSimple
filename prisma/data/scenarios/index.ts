/**
 * Scenarios data index
 * Exports all scenario data for seeding
 */

import type { ScenarioWithMappings } from '../types';

// Phase 8A: Tier 1 Scenarios (Launch Priority)
import { constitutionalRightsScenarios } from './constitutional-rights';
import { policeEncountersScenarios } from './police-encounters';
import { tenantRightsScenarios } from './tenant-rights';
import { employmentScenarios } from './employment';

// Phase 8B: Expansion Scenarios (Post-Launch)
// import { businessScenarios } from './business';
// import { taxScenarios } from './tax';
// import { ipProtectionScenarios } from './ip-protection';

/**
 * All scenarios for Phase 8A
 */
export const phase8AScenarios: ScenarioWithMappings[] = [
  ...constitutionalRightsScenarios,
  ...policeEncountersScenarios,
  ...tenantRightsScenarios,
  ...employmentScenarios,
];

/**
 * All scenarios (expand as phases complete)
 */
export const allScenarios: ScenarioWithMappings[] = [...phase8AScenarios];

// Re-export individual scenario collections for direct access
export {
  constitutionalRightsScenarios,
  policeEncountersScenarios,
  tenantRightsScenarios,
  employmentScenarios,
};
