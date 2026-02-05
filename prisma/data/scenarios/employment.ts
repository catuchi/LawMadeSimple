/**
 * Employment Scenarios
 *
 * Scenarios related to workplace issues, employee rights, and labour law
 * protections in Nigeria.
 */

import { LawCategory } from '@prisma/client';
import type { ScenarioWithMappings } from '../types';

export const employmentScenarios: ScenarioWithMappings[] = [
  {
    scenario: {
      slug: 'wrongful-termination',
      title: 'I was fired unfairly or without notice',
      description:
        'Understanding your rights when terminated from employment without proper procedure or cause.',
      iconEmoji: '📋',
      keywords: ['fired', 'sacked', 'termination', 'dismissal', 'notice', 'job', 'employment'],
      category: LawCategory.labour,
      isFeatured: true,
    },
    mappings: [
      // Labour Act mappings will be added in Phase 8d
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-36',
        relevanceOrder: 1,
        relevanceNote:
          'Section 36 fair hearing principles apply to employment disputes - you deserve proper process.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-42',
        relevanceOrder: 2,
        relevanceNote:
          'If termination was based on discrimination (ethnicity, religion, sex), Section 42 protects you.',
      },
    ],
  },
  {
    scenario: {
      slug: 'unpaid-wages',
      title: 'My employer has not paid my salary',
      description: 'What to do when your employer fails to pay your wages or salaries on time.',
      iconEmoji: '💸',
      keywords: ['salary', 'wages', 'unpaid', 'employer', 'payment', 'money', 'owed'],
      category: LawCategory.labour,
      isFeatured: true,
    },
    mappings: [
      // Labour Act mappings about wages will be added in Phase 8d
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-36',
        relevanceOrder: 1,
        relevanceNote:
          'You can pursue unpaid wages through the courts under fair hearing provisions.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-34',
        relevanceOrder: 2,
        relevanceNote: 'Forced labour without pay violates Section 34. Work should be compensated.',
      },
    ],
  },
  {
    scenario: {
      slug: 'workplace-harassment',
      title: 'I am being harassed at work',
      description:
        'Understanding your rights when facing harassment, bullying, or hostile treatment at work.',
      iconEmoji: '😰',
      keywords: ['harassment', 'workplace', 'bullying', 'hostile', 'boss', 'colleague', 'abuse'],
      category: LawCategory.labour,
      isFeatured: true,
    },
    mappings: [
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-34',
        relevanceOrder: 1,
        relevanceNote:
          'Section 34 protects your dignity. Workplace harassment can constitute degrading treatment.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-42',
        relevanceOrder: 2,
        relevanceNote:
          'If harassment is based on sex, ethnicity, or religion, Section 42 anti-discrimination protections apply.',
      },
    ],
  },
  {
    scenario: {
      slug: 'denied-annual-leave',
      title: 'My employer denied my annual leave',
      description:
        'Understanding your statutory right to annual leave and what to do when it is denied.',
      iconEmoji: '🏖️',
      keywords: ['leave', 'annual', 'vacation', 'holiday', 'time off', 'employer', 'denied'],
      category: LawCategory.labour,
      isFeatured: false,
    },
    mappings: [
      // Labour Act Section 18-19 mappings will be added in Phase 8d
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-34',
        relevanceOrder: 1,
        relevanceNote:
          'Denial of rest can impact dignity and wellbeing protected under Section 34.',
      },
    ],
  },
  {
    scenario: {
      slug: 'workplace-injury',
      title: 'I was injured at work',
      description:
        'Understanding your rights to compensation and medical care after a workplace injury.',
      iconEmoji: '🏥',
      keywords: ['injury', 'workplace', 'accident', 'compensation', 'medical', 'safety', 'hurt'],
      category: LawCategory.labour,
      isFeatured: true,
    },
    mappings: [
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-33',
        relevanceOrder: 1,
        relevanceNote:
          'Section 33 right to life includes protection from unsafe working conditions.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-34',
        relevanceOrder: 2,
        relevanceNote:
          'Unsafe working conditions can violate your dignity protected under Section 34.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-36',
        relevanceOrder: 3,
        relevanceNote:
          'You can seek compensation through the courts under fair hearing provisions.',
      },
    ],
  },
  {
    scenario: {
      slug: 'maternity-rights',
      title: 'I was denied maternity leave or fired for being pregnant',
      description:
        'Understanding maternity rights and protections for pregnant workers in Nigeria.',
      iconEmoji: '🤰',
      keywords: [
        'maternity',
        'pregnant',
        'pregnancy',
        'leave',
        'mother',
        'discrimination',
        'woman',
      ],
      category: LawCategory.labour,
      isFeatured: true,
    },
    mappings: [
      // Labour Act Section 54 mappings about women will be added in Phase 8d
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-42',
        relevanceOrder: 1,
        relevanceNote:
          'Section 42 prohibits discrimination based on sex. Pregnancy discrimination is unlawful.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-34',
        relevanceOrder: 2,
        relevanceNote: 'Your dignity as a pregnant woman must be respected under Section 34.',
      },
    ],
  },
];
