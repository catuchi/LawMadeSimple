/**
 * Tenant Rights Scenarios
 *
 * Scenarios related to landlord-tenant relationships, focusing on Lagos State
 * tenancy law but with constitutional protections applicable nationwide.
 */

import { LawCategory } from '@prisma/client';
import type { ScenarioWithMappings } from '../types';

export const tenantRightsScenarios: ScenarioWithMappings[] = [
  {
    scenario: {
      slug: 'landlord-eviction-notice',
      title: 'My landlord wants to evict me',
      description:
        'Understanding the proper eviction process and your rights as a tenant in Nigeria.',
      iconEmoji: '🏠',
      keywords: ['eviction', 'landlord', 'tenant', 'notice', 'quit', 'rent', 'housing'],
      category: LawCategory.property,
      isFeatured: true,
    },
    mappings: [
      // Lagos Tenancy Law mappings will be added in Phase 8e
      // For now, link to constitutional protections
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-43',
        relevanceOrder: 1,
        relevanceNote:
          'While tenants may not own the property, Section 43 establishes property rights framework that influences tenancy law.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-36',
        relevanceOrder: 2,
        relevanceNote:
          'You have a right to fair hearing before a court if there is a dispute with your landlord.',
      },
    ],
  },
  {
    scenario: {
      slug: 'landlord-illegal-lockout',
      title: 'My landlord locked me out without court order',
      description:
        'What to do when your landlord forcibly removes you from your home without following legal process.',
      iconEmoji: '🔐',
      keywords: ['lockout', 'landlord', 'illegal', 'eviction', 'force', 'self-help', 'property'],
      category: LawCategory.property,
      isFeatured: true,
    },
    mappings: [
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-37',
        relevanceOrder: 1,
        relevanceNote:
          'Section 37 protects the privacy of your home. Illegal lockouts violate this right.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-36',
        relevanceOrder: 2,
        relevanceNote:
          'Landlords must go through proper court process. Section 36 ensures your right to due process.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-46',
        relevanceOrder: 3,
        relevanceNote: 'You can seek court intervention for violation of your rights.',
      },
    ],
  },
  {
    scenario: {
      slug: 'rent-increase-dispute',
      title: 'My landlord increased rent unfairly',
      description:
        'Understanding rent increase rules and what constitutes an unreasonable rent hike.',
      iconEmoji: '💵',
      keywords: ['rent', 'increase', 'landlord', 'unfair', 'price', 'hike', 'agreement'],
      category: LawCategory.property,
      isFeatured: false,
    },
    mappings: [
      // Lagos Tenancy Law mappings will be added in Phase 8e
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-36',
        relevanceOrder: 1,
        relevanceNote:
          'Disputes about rent can be resolved through the courts under Section 36 fair hearing provisions.',
      },
    ],
  },
  {
    scenario: {
      slug: 'deposit-not-returned',
      title: 'My landlord refuses to return my deposit',
      description: 'What to do when your landlord keeps your security deposit after you move out.',
      iconEmoji: '💰',
      keywords: ['deposit', 'caution', 'refund', 'landlord', 'tenant', 'money', 'security'],
      category: LawCategory.property,
      isFeatured: true,
    },
    mappings: [
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-36',
        relevanceOrder: 1,
        relevanceNote:
          'You can pursue recovery of your deposit through the courts under fair hearing provisions.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-44',
        relevanceOrder: 2,
        relevanceNote:
          'Your deposit is your property. Section 44 principles about property rights can apply.',
      },
    ],
  },
  {
    scenario: {
      slug: 'landlord-not-making-repairs',
      title: 'My landlord refuses to make necessary repairs',
      description:
        'Understanding landlord obligations for maintaining rental property and your options.',
      iconEmoji: '🔧',
      keywords: ['repairs', 'maintenance', 'landlord', 'broken', 'fix', 'plumbing', 'electrical'],
      category: LawCategory.property,
      isFeatured: false,
    },
    mappings: [
      // Lagos Tenancy Law mappings about landlord obligations will be added in Phase 8e
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-36',
        relevanceOrder: 1,
        relevanceNote:
          'You can seek legal remedy through the courts if landlord breaches tenancy agreement.',
      },
    ],
  },
];
