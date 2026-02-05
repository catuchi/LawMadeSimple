/**
 * Constitutional Rights Scenarios
 *
 * Scenarios related to fundamental rights under the Nigerian Constitution.
 * These cover common situations where citizens' constitutional rights may be at stake.
 */

import { LawCategory } from '@prisma/client';
import type { ScenarioWithMappings } from '../types';

export const constitutionalRightsScenarios: ScenarioWithMappings[] = [
  {
    scenario: {
      slug: 'freedom-of-expression-restricted',
      title: 'My freedom of expression is being restricted',
      description:
        'Understanding your constitutional right to free speech and its limits in Nigeria.',
      iconEmoji: '🗣️',
      keywords: ['speech', 'expression', 'press', 'opinion', 'censorship', 'media', 'journalism'],
      category: LawCategory.constitution,
      isFeatured: true,
    },
    mappings: [
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-39',
        relevanceOrder: 1,
        relevanceNote:
          'Section 39 guarantees freedom of expression and the right to receive and impart information.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-36',
        relevanceOrder: 2,
        relevanceNote:
          'If charged for expression, Section 36 ensures right to fair hearing and due process.',
      },
    ],
  },
  {
    scenario: {
      slug: 'religious-discrimination',
      title: 'I am being discriminated against for my religion',
      description:
        'Know your rights when facing discrimination based on your religious beliefs or practices.',
      iconEmoji: '🙏',
      keywords: [
        'religion',
        'faith',
        'discrimination',
        'worship',
        'belief',
        'christianity',
        'islam',
        'traditional',
      ],
      category: LawCategory.constitution,
      isFeatured: true,
    },
    mappings: [
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-38',
        relevanceOrder: 1,
        relevanceNote:
          'Section 38 protects freedom of religion, thought, and conscience, including the right to practice and propagate your religion.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-42',
        relevanceOrder: 2,
        relevanceNote:
          'Section 42 prohibits discrimination based on religion in any law or government action.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-46',
        relevanceOrder: 3,
        relevanceNote:
          'Section 46 allows you to apply to the High Court if your fundamental rights are violated.',
      },
    ],
  },
  {
    scenario: {
      slug: 'ethnic-discrimination-employment',
      title: 'I was denied a job because of my ethnic background',
      description:
        'Understanding your rights when facing discrimination based on ethnicity or place of origin.',
      iconEmoji: '🏢',
      keywords: [
        'ethnic',
        'tribe',
        'discrimination',
        'job',
        'employment',
        'origin',
        'yoruba',
        'igbo',
        'hausa',
      ],
      category: LawCategory.constitution,
      isFeatured: false,
    },
    mappings: [
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-42',
        relevanceOrder: 1,
        relevanceNote:
          'Section 42 prohibits discrimination based on ethnic group or place of origin.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-46',
        relevanceOrder: 2,
        relevanceNote:
          'You can apply to the High Court for redress if discriminated against based on ethnicity.',
      },
    ],
  },
  {
    scenario: {
      slug: 'privacy-violated',
      title: 'My privacy was violated',
      description:
        'What to do when your home, communications, or personal information is accessed without consent.',
      iconEmoji: '🔒',
      keywords: [
        'privacy',
        'phone',
        'search',
        'correspondence',
        'email',
        'home',
        'surveillance',
        'data',
      ],
      category: LawCategory.constitution,
      isFeatured: true,
    },
    mappings: [
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-37',
        relevanceOrder: 1,
        relevanceNote:
          'Section 37 guarantees privacy of your home, correspondence, and communications.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-46',
        relevanceOrder: 2,
        relevanceNote: 'You can seek court redress for violations of your privacy rights.',
      },
    ],
  },
  {
    scenario: {
      slug: 'peaceful-protest-rights',
      title: 'Can I organize or join a peaceful protest?',
      description:
        'Understanding your right to peaceful assembly and protest in Nigeria, and its limitations.',
      iconEmoji: '✊',
      keywords: ['protest', 'demonstration', 'rally', 'assembly', 'gathering', 'march', 'rights'],
      category: LawCategory.constitution,
      isFeatured: true,
    },
    mappings: [
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-40',
        relevanceOrder: 1,
        relevanceNote:
          'Section 40 guarantees the right to assemble freely and associate with others.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-39',
        relevanceOrder: 2,
        relevanceNote:
          'Section 39 supports protest rights through freedom of expression provisions.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-35',
        relevanceOrder: 3,
        relevanceNote:
          'Know your rights under Section 35 if arrested during a protest - including right to silence and legal representation.',
      },
    ],
  },
  {
    scenario: {
      slug: 'property-seized-government',
      title: 'The government wants to take my property',
      description:
        'Understanding your rights when government attempts to acquire your land or property.',
      iconEmoji: '🏠',
      keywords: [
        'property',
        'land',
        'acquisition',
        'government',
        'compensation',
        'demolition',
        'eviction',
      ],
      category: LawCategory.constitution,
      isFeatured: false,
    },
    mappings: [
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-43',
        relevanceOrder: 1,
        relevanceNote:
          'Section 43 guarantees your right to own property anywhere in Nigeria as a citizen.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-44',
        relevanceOrder: 2,
        relevanceNote:
          'Section 44 requires prompt compensation and proper legal process for any compulsory acquisition.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-46',
        relevanceOrder: 3,
        relevanceNote:
          'You can challenge improper acquisition or inadequate compensation in the High Court.',
      },
    ],
  },
];
