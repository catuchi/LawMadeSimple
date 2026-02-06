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

// Phase 8-Exp: Expansion Laws
import { cama2020 } from './cama-2020';
import { firsAct } from './firs-act';
import { copyrightAct } from './copyright-act';
import { trademarksAct } from './trademarks-act';
import { patentsAct } from './patents-designs-act';

// PDF Pipeline Extracted Laws
import { nigeriaTaxAct2025 } from './nigeria-tax-act-2025';

/**
 * All laws for Phase 8A
 */
export const phase8ALaws: LawWithSections[] = [constitution, criminalCode, labourAct, lagosTenancy];

/**
 * Expansion laws for Phase 8-Exp
 */
export const phase8ExpLaws: LawWithSections[] = [
  cama2020,
  firsAct,
  copyrightAct,
  trademarksAct,
  patentsAct,
];

/**
 * PDF Pipeline Extracted Laws
 */
export const pdfExtractedLaws: LawWithSections[] = [nigeriaTaxAct2025];

/**
 * All laws (expand as phases complete)
 */
export const allLaws: LawWithSections[] = [...phase8ALaws, ...phase8ExpLaws, ...pdfExtractedLaws];

// Re-export individual laws for direct access
export {
  constitution,
  criminalCode,
  labourAct,
  lagosTenancy,
  cama2020,
  firsAct,
  copyrightAct,
  trademarksAct,
  patentsAct,
  nigeriaTaxAct2025,
};
