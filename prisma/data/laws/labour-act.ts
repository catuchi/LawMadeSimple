/**
 * Labour Act (Cap L1 LFN 2004)
 *
 * This file contains the law metadata and selected sections for the Labour Act.
 * Sections are selected based on relevance to everyday employment scenarios.
 *
 * Source: https://lawsofnigeria.placng.org/laws/L1.pdf
 */

import { LawCategory } from '@prisma/client';
import type { LawWithSections } from '../types';

export const labourAct: LawWithSections = {
  law: {
    slug: 'labour-act',
    title: 'Labour Act (Cap L1 LFN 2004)',
    shortTitle: 'Labour Act',
    description:
      'Governs employment relationships in Nigeria, covering contracts of employment, wages, working conditions, and worker protections.',
    category: LawCategory.labour,
    effectiveDate: new Date('1974-08-01'), // Originally enacted 1974, codified 2004
    sourceUrl: 'https://lawsofnigeria.placng.org/laws/L1.pdf',
    isActive: true,
  },
  sections: [
    // Phase 8d will add 15-20 sections covering:
    // - Contract of employment (Sections 7-10)
    // - Wages and payment (Sections 1-5)
    // - Working hours (Sections 13-14)
    // - Annual leave and holidays (Sections 18-19)
    // - Termination of employment (Sections 11-12)
    // - Wrongful dismissal protections
    // - Special protections for women and young persons (Sections 54-61)

    // Placeholder section - will be expanded in Phase 8d
    {
      slug: 'section-1',
      number: '1',
      title: 'Interpretation',
      content:
        'In this Act, unless the context otherwise requires - "contract of employment" means any agreement, whether oral or written, express or implied, whereby one person agrees to employ another as a worker and that other person agrees to serve the employer as a worker.',
      summary:
        'Defines key terms used throughout the Labour Act, including contract of employment.',
      orderIndex: 1,
    },
  ],
};
