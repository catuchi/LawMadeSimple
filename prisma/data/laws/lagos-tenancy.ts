/**
 * Lagos State Tenancy Law 2011
 *
 * This file contains the law metadata and selected sections for the Lagos Tenancy Law.
 * Sections are selected based on relevance to everyday tenant-landlord scenarios.
 *
 * Note: This law applies only to Lagos State. Other states may have different tenancy laws.
 *
 * Source: http://lagosministryofjustice.org/wp-content/uploads/2022/01/Tenancy-Law-2011.pdf
 */

import { LawCategory } from '@prisma/client';
import type { LawWithSections } from '../types';

export const lagosTenancy: LawWithSections = {
  law: {
    slug: 'lagos-tenancy-law-2011',
    title: 'Lagos State Tenancy Law 2011',
    shortTitle: 'Lagos Tenancy Law',
    description:
      'Regulates the relationship between landlords and tenants in Lagos State, including rent control, eviction procedures, and tenant protections.',
    category: LawCategory.property,
    effectiveDate: new Date('2011-08-01'),
    sourceUrl: 'http://lagosministryofjustice.org/wp-content/uploads/2022/01/Tenancy-Law-2011.pdf',
    isActive: true,
  },
  sections: [
    // Phase 8e will add 10-15 sections covering:
    // - Types of tenancies (Sections 3-7)
    // - Notice to quit requirements (Sections 13-17)
    // - Recovery of premises (Sections 18-23)
    // - Rent increases and arrears (Sections 8-12)
    // - Landlord obligations (Sections 24-27)
    // - Tenant rights and obligations (Sections 28-31)
    // - Dispute resolution (Sections 32-35)

    // Placeholder section - will be expanded in Phase 8e
    {
      slug: 'section-1',
      number: '1',
      title: 'Citation and Commencement',
      content:
        'This Law may be cited as the Tenancy Law of Lagos State 2011 and shall come into force on the date of its publication in the Lagos State Official Gazette.',
      summary: 'Establishes the title and effective date of the Lagos Tenancy Law.',
      orderIndex: 1,
    },
  ],
};
