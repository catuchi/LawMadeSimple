/**
 * Tenant Rights Scenarios
 *
 * Scenarios related to landlord-tenant relationships, focusing on Lagos State
 * tenancy law but with constitutional protections applicable nationwide.
 *
 * Updated in Phase 8d with comprehensive Lagos Tenancy Law mappings.
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
      {
        lawSlug: 'lagos-tenancy-law-2011',
        sectionSlug: 'section-13',
        relevanceOrder: 1,
        relevanceNote:
          'Section 13 specifies the minimum notice periods for eviction: 1 week (tenant at will), 1 month (monthly tenant), 3 months (quarterly/half-yearly), or 6 months (yearly tenant).',
      },
      {
        lawSlug: 'lagos-tenancy-law-2011',
        sectionSlug: 'section-16',
        relevanceOrder: 2,
        relevanceNote:
          'Even after notice expires, landlord must serve a 7-day court intention notice before taking legal action.',
      },
      {
        lawSlug: 'lagos-tenancy-law-2011',
        sectionSlug: 'section-44',
        relevanceOrder: 3,
        relevanceNote:
          'Section 44 makes forcible eviction without court order a criminal offence punishable by N250,000 fine or 6 months imprisonment.',
      },
      {
        lawSlug: 'lagos-tenancy-law-2011',
        sectionSlug: 'section-17',
        relevanceOrder: 4,
        relevanceNote:
          'Any eviction notice must be properly served by personal delivery, registered post, or other valid methods.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-36',
        relevanceOrder: 5,
        relevanceNote:
          'You have a constitutional right to fair hearing before any court proceeding regarding eviction.',
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
        lawSlug: 'lagos-tenancy-law-2011',
        sectionSlug: 'section-44',
        relevanceOrder: 1,
        relevanceNote:
          'Section 44(1)(f) makes it an offence to lock out a tenant without court approval. Penalty: N250,000 fine or 6 months imprisonment.',
      },
      {
        lawSlug: 'lagos-tenancy-law-2011',
        sectionSlug: 'section-6',
        relevanceOrder: 2,
        relevanceNote:
          'Section 6 guarantees your right to exclusive possession and 24/7 access to your premises.',
      },
      {
        lawSlug: 'lagos-tenancy-law-2011',
        sectionSlug: 'section-8',
        relevanceOrder: 3,
        relevanceNote:
          'Section 8 prohibits landlords from disturbing quiet enjoyment or seizing tenant property.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-37',
        relevanceOrder: 4,
        relevanceNote:
          'Section 37 protects the privacy of your home. Illegal lockouts violate this constitutional right.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-46',
        relevanceOrder: 5,
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
      {
        lawSlug: 'lagos-tenancy-law-2011',
        sectionSlug: 'section-37',
        relevanceOrder: 1,
        relevanceNote:
          'Section 37 requires landlords to give 6 months written notice before increasing rent. You can apply to court if the increase is excessive.',
      },
      {
        lawSlug: 'lagos-tenancy-law-2011',
        sectionSlug: 'section-4',
        relevanceOrder: 2,
        relevanceNote:
          'Section 4 limits advance rent collection: maximum 6 months from sitting monthly tenants, 1 year from yearly tenants.',
      },
      {
        lawSlug: 'lagos-tenancy-law-2011',
        sectionSlug: 'section-6',
        relevanceOrder: 3,
        relevanceNote:
          'Section 6 protects your right to peaceful enjoyment of the premises during the tenancy.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-36',
        relevanceOrder: 4,
        relevanceNote:
          'Courts can assess and fix a fair rent based on local market rates under Section 36 fair hearing provisions.',
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
        lawSlug: 'lagos-tenancy-law-2011',
        sectionSlug: 'section-10',
        relevanceOrder: 1,
        relevanceNote:
          'Section 10 requires landlords to refund security deposits at tenancy end, minus any debts owed. Failure is an offence with N50,000 fine.',
      },
      {
        lawSlug: 'lagos-tenancy-law-2011',
        sectionSlug: 'section-5',
        relevanceOrder: 2,
        relevanceNote:
          'Section 5 requires landlords to issue receipts for all payments. Keep your deposit receipt as proof.',
      },
      {
        lawSlug: 'lagos-tenancy-law-2011',
        sectionSlug: 'section-6',
        relevanceOrder: 3,
        relevanceNote:
          'Section 6(2) also allows you to claim compensation for landlord-approved improvements you made.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-36',
        relevanceOrder: 4,
        relevanceNote:
          'You can pursue recovery of your deposit through the courts under fair hearing provisions.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-44',
        relevanceOrder: 5,
        relevanceNote:
          'Your deposit is your property. Constitutional protection against deprivation without compensation applies.',
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
      {
        lawSlug: 'lagos-tenancy-law-2011',
        sectionSlug: 'section-8',
        relevanceOrder: 1,
        relevanceNote:
          "Section 8(d) makes it the landlord's duty to repair the exterior including roof, walls, and gate.",
      },
      {
        lawSlug: 'lagos-tenancy-law-2011',
        sectionSlug: 'section-7',
        relevanceOrder: 2,
        relevanceNote:
          'Section 7(c) makes tenants responsible only for interior maintenance, not structural repairs.',
      },
      {
        lawSlug: 'lagos-tenancy-law-2011',
        sectionSlug: 'section-6',
        relevanceOrder: 3,
        relevanceNote:
          'Section 6 guarantees your right to peaceful enjoyment which includes habitable premises.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-36',
        relevanceOrder: 4,
        relevanceNote:
          'You can seek legal remedy through the courts if landlord breaches tenancy agreement.',
      },
    ],
  },
  {
    scenario: {
      slug: 'utilities-cut-off',
      title: 'My landlord cut off my electricity or water',
      description: 'What to do when your landlord disconnects essential services to force you out.',
      iconEmoji: '💡',
      keywords: ['electricity', 'water', 'utilities', 'disconnection', 'landlord', 'harassment'],
      category: LawCategory.property,
      isFeatured: true,
    },
    mappings: [
      {
        lawSlug: 'lagos-tenancy-law-2011',
        sectionSlug: 'section-44',
        relevanceOrder: 1,
        relevanceNote:
          'Section 44(1)(e) makes it an offence to cut off essential services to force a tenant out. Penalty: N250,000 fine or 6 months imprisonment.',
      },
      {
        lawSlug: 'lagos-tenancy-law-2011',
        sectionSlug: 'section-8',
        relevanceOrder: 2,
        relevanceNote:
          'Section 8(c) prohibits landlords from terminating or restricting common facilities or services.',
      },
      {
        lawSlug: 'lagos-tenancy-law-2011',
        sectionSlug: 'section-6',
        relevanceOrder: 3,
        relevanceNote:
          'Section 6 guarantees your right to quiet and peaceable enjoyment of the premises.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-37',
        relevanceOrder: 4,
        relevanceNote:
          'Cutting off utilities violates your constitutional right to privacy of your home.',
      },
    ],
  },
  {
    scenario: {
      slug: 'excessive-advance-rent',
      title: 'My landlord demands more than one year rent',
      description:
        'Understanding the legal limits on how much rent landlords can collect in advance.',
      iconEmoji: '📅',
      keywords: ['advance', 'rent', 'landlord', 'years', 'payment', 'illegal', 'excess'],
      category: LawCategory.property,
      isFeatured: false,
    },
    mappings: [
      {
        lawSlug: 'lagos-tenancy-law-2011',
        sectionSlug: 'section-4',
        relevanceOrder: 1,
        relevanceNote:
          'Section 4 limits advance rent: max 1 year from new tenants, 6 months from existing monthly tenants. Violators face N100,000 fine or 3 months imprisonment.',
      },
      {
        lawSlug: 'lagos-tenancy-law-2011',
        sectionSlug: 'section-5',
        relevanceOrder: 2,
        relevanceNote:
          'Section 5 requires receipts for all rent payments. Always get a receipt to prove what you paid.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-36',
        relevanceOrder: 3,
        relevanceNote:
          'You can report violations to authorities or take legal action to recover excess rent paid.',
      },
    ],
  },
];
