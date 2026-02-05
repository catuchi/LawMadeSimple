/**
 * Employment Scenarios
 *
 * Scenarios related to workplace issues, employee rights, and labour law
 * protections in Nigeria. Updated with Labour Act section mappings.
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
      {
        lawSlug: 'labour-act',
        sectionSlug: 'section-11',
        relevanceOrder: 1,
        relevanceNote:
          'Section 11 specifies minimum notice periods based on your length of service. If fired without proper notice, you may be entitled to compensation.',
      },
      {
        lawSlug: 'labour-act',
        sectionSlug: 'section-7',
        relevanceOrder: 2,
        relevanceNote:
          'Section 7 requires employers to provide written terms within 3 months. If no contract exists, default notice periods apply.',
      },
      {
        lawSlug: 'labour-act',
        sectionSlug: 'section-20',
        relevanceOrder: 3,
        relevanceNote:
          'If terminated due to redundancy, Section 20 requires "last in, first out" principle and redundancy payments.',
      },
      {
        lawSlug: 'labour-act',
        sectionSlug: 'section-17',
        relevanceOrder: 4,
        relevanceNote:
          'Section 17 requires employers to provide work or continue paying wages. Being laid off without pay may violate this.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-36',
        relevanceOrder: 5,
        relevanceNote:
          'Section 36 fair hearing principles apply to employment disputes - you deserve proper process before termination.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-42',
        relevanceOrder: 6,
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
      {
        lawSlug: 'labour-act',
        sectionSlug: 'section-1',
        relevanceOrder: 1,
        relevanceNote:
          'Section 1 requires wages to be paid in legal tender. Any contract requiring other payment forms is void.',
      },
      {
        lawSlug: 'labour-act',
        sectionSlug: 'section-9',
        relevanceOrder: 2,
        relevanceNote:
          'Section 9 requires wages to be paid at least monthly. Delays beyond one month violate the law.',
      },
      {
        lawSlug: 'labour-act',
        sectionSlug: 'section-5',
        relevanceOrder: 3,
        relevanceNote:
          'Section 5 limits deductions to one-third of wages for authorized purposes only. Unauthorized deductions are illegal.',
      },
      {
        lawSlug: 'labour-act',
        sectionSlug: 'section-17',
        relevanceOrder: 4,
        relevanceNote:
          'Section 17 requires employers to pay wages even when no work is available, except in emergencies.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-36',
        relevanceOrder: 5,
        relevanceNote:
          'You can pursue unpaid wages through the courts under fair hearing provisions.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-34',
        relevanceOrder: 6,
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
        lawSlug: 'labour-act',
        sectionSlug: 'section-9',
        relevanceOrder: 1,
        relevanceNote:
          'Section 9 protects workers from conditions that harm their dignity and wellbeing. Harassment violates employment standards.',
      },
      {
        lawSlug: 'labour-act',
        sectionSlug: 'section-12',
        relevanceOrder: 2,
        relevanceNote:
          'Section 12 holds employers liable for injuries caused by other workers. Harassment causing harm is covered.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-34',
        relevanceOrder: 3,
        relevanceNote:
          'Section 34 protects your dignity. Workplace harassment can constitute degrading treatment.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-42',
        relevanceOrder: 4,
        relevanceNote:
          'If harassment is based on sex, ethnicity, or religion, Section 42 anti-discrimination protections apply.',
      },
      {
        lawSlug: 'criminal-code-act',
        sectionSlug: 'section-351',
        relevanceOrder: 5,
        relevanceNote:
          'Physical harassment or threats may constitute assault under Section 351 of the Criminal Code.',
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
      {
        lawSlug: 'labour-act',
        sectionSlug: 'section-18',
        relevanceOrder: 1,
        relevanceNote:
          'Section 18 guarantees at least 6 days paid annual leave after 12 months of service (12 days if under 16). Employers cannot pay cash instead of giving leave.',
      },
      {
        lawSlug: 'labour-act',
        sectionSlug: 'section-19',
        relevanceOrder: 2,
        relevanceNote:
          'Section 19 explains how leave pay is calculated - basic wages only, excluding overtime and allowances.',
      },
      {
        lawSlug: 'labour-act',
        sectionSlug: 'section-7',
        relevanceOrder: 3,
        relevanceNote:
          'Section 7 requires your employment contract to specify holiday and holiday pay terms.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-34',
        relevanceOrder: 4,
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
        lawSlug: 'labour-act',
        sectionSlug: 'section-12',
        relevanceOrder: 1,
        relevanceNote:
          'Section 12 ensures employers cannot avoid liability by blaming a co-worker. The employer is responsible for workplace injuries.',
      },
      {
        lawSlug: 'labour-act',
        sectionSlug: 'section-9',
        relevanceOrder: 2,
        relevanceNote:
          'Section 9 prohibits contracts that limit employer liability for worker death or injury. Such clauses are void.',
      },
      {
        lawSlug: 'labour-act',
        sectionSlug: 'section-16',
        relevanceOrder: 3,
        relevanceNote:
          'Section 16 provides 12 days paid sick leave per year for certified illness or injury.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-33',
        relevanceOrder: 4,
        relevanceNote:
          'Section 33 right to life includes protection from unsafe working conditions.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-34',
        relevanceOrder: 5,
        relevanceNote:
          'Unsafe working conditions can violate your dignity protected under Section 34.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-36',
        relevanceOrder: 6,
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
        'nursing',
      ],
      category: LawCategory.labour,
      isFeatured: true,
    },
    mappings: [
      {
        lawSlug: 'labour-act',
        sectionSlug: 'section-54',
        relevanceOrder: 1,
        relevanceNote:
          'Section 54 protects pregnant workers: 6 weeks pre-delivery leave, 6 weeks post-delivery (mandatory), at least 50% wages if employed 6+ months, nursing breaks, and protection from dismissal during maternity leave.',
      },
      {
        lawSlug: 'labour-act',
        sectionSlug: 'section-55',
        relevanceOrder: 2,
        relevanceNote:
          'Section 55 protects women from being required to work night shifts in industrial and agricultural settings.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-42',
        relevanceOrder: 3,
        relevanceNote:
          'Section 42 prohibits discrimination based on sex. Pregnancy discrimination is unlawful.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-34',
        relevanceOrder: 4,
        relevanceNote: 'Your dignity as a pregnant woman must be respected under Section 34.',
      },
    ],
  },
  {
    scenario: {
      slug: 'no-written-contract',
      title: 'My employer never gave me a written contract',
      description:
        'Understanding your rights when you have no formal written employment agreement.',
      iconEmoji: '📝',
      keywords: [
        'contract',
        'written',
        'agreement',
        'informal',
        'verbal',
        'employment',
        'no contract',
      ],
      category: LawCategory.labour,
      isFeatured: false,
    },
    mappings: [
      {
        lawSlug: 'labour-act',
        sectionSlug: 'section-7',
        relevanceOrder: 1,
        relevanceNote:
          'Section 7 requires employers to provide written employment terms within 3 months. Failure to do so is a legal violation.',
      },
      {
        lawSlug: 'labour-act',
        sectionSlug: 'section-9',
        relevanceOrder: 2,
        relevanceNote:
          'Section 9 sets minimum standards that apply even without a written contract: monthly wage payment, minimum age 16, and employer liability.',
      },
      {
        lawSlug: 'labour-act',
        sectionSlug: 'section-11',
        relevanceOrder: 3,
        relevanceNote:
          'Without a written contract, the default notice periods in Section 11 apply based on your length of service.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-36',
        relevanceOrder: 4,
        relevanceNote:
          'You can enforce your employment rights through the courts even without a written contract.',
      },
    ],
  },
  {
    scenario: {
      slug: 'excessive-working-hours',
      title: 'I am forced to work excessive hours without overtime pay',
      description:
        'Understanding your rights regarding working hours, rest breaks, and overtime compensation.',
      iconEmoji: '⏰',
      keywords: [
        'overtime',
        'hours',
        'overwork',
        'rest',
        'break',
        'tired',
        'excessive',
        'long hours',
      ],
      category: LawCategory.labour,
      isFeatured: false,
    },
    mappings: [
      {
        lawSlug: 'labour-act',
        sectionSlug: 'section-13',
        relevanceOrder: 1,
        relevanceNote:
          'Section 13 requires rest breaks (1 hour minimum for 6+ hour shifts) and 24 consecutive hours weekly rest. Hours beyond normal constitute overtime.',
      },
      {
        lawSlug: 'labour-act',
        sectionSlug: 'section-7',
        relevanceOrder: 2,
        relevanceNote:
          'Section 7 requires your contract to specify working hours. Check your written terms.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-34',
        relevanceOrder: 3,
        relevanceNote:
          'Excessive forced work without proper compensation can violate your dignity rights under Section 34.',
      },
    ],
  },
];
