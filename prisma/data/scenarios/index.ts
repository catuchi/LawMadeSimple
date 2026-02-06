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

// Phase 8B: Criminal Code Scenarios
import { crimeVictimsScenarios } from './crime-victims';

// Phase 8-Exp: Expansion Scenarios
import { businessScenarios } from './business';
import { taxScenarios } from './tax';
import { ipProtectionScenarios } from './ip-protection';

/**
 * All scenarios for Phase 8A + 8B
 */
export const phase8AScenarios: ScenarioWithMappings[] = [
  ...constitutionalRightsScenarios,
  ...policeEncountersScenarios,
  ...tenantRightsScenarios,
  ...employmentScenarios,
  ...crimeVictimsScenarios,
];

/**
 * Expansion scenarios for Phase 8-Exp
 */
export const phase8ExpScenarios: ScenarioWithMappings[] = [
  ...businessScenarios,
  ...taxScenarios,
  ...ipProtectionScenarios,
];

/**
 * All scenarios (expand as phases complete)
 */
export const allScenarios: ScenarioWithMappings[] = [...phase8AScenarios, ...phase8ExpScenarios];

// Re-export individual scenario collections for direct access
export {
  constitutionalRightsScenarios,
  policeEncountersScenarios,
  tenantRightsScenarios,
  employmentScenarios,
  crimeVictimsScenarios,
  businessScenarios,
  taxScenarios,
  ipProtectionScenarios,
};
