/**
 * Laws data index
 * Exports all law data for seeding
 */

import type { LawWithSections } from '../types';

// Phase 8A: Tier 1 Laws (Launch Priority)
import { constitution } from './constitution';
import { criminalCode } from './criminal-code';
import { labourAct } from './labour-act';
import { lagosTenancy } from './lagos-tenancy';

// Phase 8B: Expansion Laws (Post-Launch)
// import { cama2020 } from './cama-2020';
// import { firsAct } from './firs-act';
// import { copyrightAct } from './copyright-act';
// import { trademarksAct } from './trademarks-act';
// import { patentsAct } from './patents-act';

/**
 * All laws for Phase 8A
 */
export const phase8ALaws: LawWithSections[] = [constitution, criminalCode, labourAct, lagosTenancy];

/**
 * All laws (expand as phases complete)
 */
export const allLaws: LawWithSections[] = [...phase8ALaws];

// Re-export individual laws for direct access
export { constitution, criminalCode, labourAct, lagosTenancy };
