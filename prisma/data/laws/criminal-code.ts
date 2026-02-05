/**
 * Criminal Code Act (Cap C38 LFN 2004)
 *
 * This file contains the law metadata and selected sections for the Criminal Code.
 * Sections are selected based on relevance to everyday scenarios.
 *
 * Note: The Criminal Code applies to Southern Nigeria. Northern states use the Penal Code.
 *
 * Source: https://lawsofnigeria.placng.org/laws/C1.pdf
 */

import { LawCategory } from '@prisma/client';
import type { LawWithSections } from '../types';

export const criminalCode: LawWithSections = {
  law: {
    slug: 'criminal-code-act',
    title: 'Criminal Code Act (Cap C38 LFN 2004)',
    shortTitle: 'Criminal Code',
    description:
      'Defines criminal offences and their punishments in Southern Nigeria. Covers offences against persons, property, public order, and morality.',
    category: LawCategory.criminal,
    effectiveDate: new Date('1916-06-01'), // Originally enacted 1916, codified 2004
    sourceUrl: 'https://lawsofnigeria.placng.org/laws/C1.pdf',
    isActive: true,
  },
  sections: [
    // Phase 8c will add 15-20 sections covering:
    // - Assault and battery (Sections 351-355)
    // - Theft and stealing (Sections 382-390)
    // - Unlawful arrest/detention (Sections 364-365)
    // - Criminal trespass (Sections 342-343)
    // - Defamation (Sections 373-381)
    // - Conspiracy (Section 518)
    // - Receiving stolen property (Section 427)

    // Placeholder section - will be expanded in Phase 8c
    {
      slug: 'section-1',
      number: '1',
      title: 'Short Title',
      content: 'This Act may be cited as the Criminal Code Act.',
      summary: 'Establishes the short title of the Act.',
      orderIndex: 1,
    },
  ],
};
