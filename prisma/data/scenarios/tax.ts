/**
 * Tax Scenarios
 *
 * Scenarios related to tax obligations, assessment, disputes, and compliance
 * for businesses and individuals under Nigerian tax laws.
 */

import { LawCategory } from '@prisma/client';
import type { ScenarioWithMappings } from '../types';

export const taxScenarios: ScenarioWithMappings[] = [
  {
    scenario: {
      slug: 'tax-assessment-wrong',
      title: 'I received a tax assessment that I believe is wrong',
      description:
        'Understanding your rights to challenge a tax assessment from FIRS that you believe is incorrect or unfair.',
      iconEmoji: '📊',
      keywords: [
        'assessment',
        'wrong',
        'dispute',
        'FIRS',
        'tax',
        'incorrect',
        'challenge',
        'appeal',
        'review',
      ],
      category: LawCategory.tax,
      isFeatured: true,
    },
    mappings: [
      {
        lawSlug: 'firs-act',
        sectionSlug: 'section-27',
        relevanceOrder: 1,
        relevanceNote:
          'Section 27 gives you 30 days to request a review of any assessment. State your grounds clearly. FIRS can confirm, amend, or cancel it.',
      },
      {
        lawSlug: 'firs-act',
        sectionSlug: 'section-28',
        relevanceOrder: 2,
        relevanceNote:
          "Section 28 allows appeal to the Tax Appeal Tribunal within 30 days if dissatisfied with FIRS's review decision.",
      },
      {
        lawSlug: 'firs-act',
        sectionSlug: 'section-25',
        relevanceOrder: 3,
        relevanceNote:
          'Section 25 explains how assessments are made - if you did not file returns, FIRS can assess based on their judgment.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-36',
        relevanceOrder: 4,
        relevanceNote:
          'Section 36 fair hearing rights protect your ability to challenge assessments through proper procedures.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-44',
        relevanceOrder: 5,
        relevanceNote:
          'Section 44 allows taxation but requires due process. Arbitrary assessments can be challenged.',
      },
    ],
  },
  {
    scenario: {
      slug: 'how-to-file-taxes',
      title: 'How do I file and pay my business taxes in Nigeria?',
      description:
        'Understanding the requirements and process for filing tax returns and paying taxes as a business or self-employed person.',
      iconEmoji: '📁',
      keywords: [
        'file',
        'pay',
        'taxes',
        'returns',
        'business',
        'self-employed',
        'filing',
        'TIN',
        'compliance',
        'VAT',
      ],
      category: LawCategory.tax,
      isFeatured: true,
    },
    mappings: [
      {
        lawSlug: 'firs-act',
        sectionSlug: 'section-50',
        relevanceOrder: 1,
        relevanceNote:
          'Section 50 requires every taxable person to register for a TIN first. You need this for all tax matters.',
      },
      {
        lawSlug: 'firs-act',
        sectionSlug: 'section-26',
        relevanceOrder: 2,
        relevanceNote:
          'Section 26 allows self-assessment: complete the form, calculate tax due, and submit with proof of payment.',
      },
      {
        lawSlug: 'firs-act',
        sectionSlug: 'section-8',
        relevanceOrder: 3,
        relevanceNote:
          'Section 8 says FIRS issues guidelines on registration, filing, and payment procedures. Follow their published guidelines.',
      },
      {
        lawSlug: 'firs-act',
        sectionSlug: 'section-41',
        relevanceOrder: 4,
        relevanceNote:
          'Section 41 requires keeping records for 6 years. Maintain proper books of account to support your returns.',
      },
      {
        lawSlug: 'firs-act',
        sectionSlug: 'section-51',
        relevanceOrder: 5,
        relevanceNote:
          'Section 51 explains TCC requirements - you may need a Tax Clearance Certificate for contracts and licenses.',
      },
    ],
  },
  {
    scenario: {
      slug: 'tax-penalty-received',
      title: 'I received a tax penalty notice from FIRS',
      description:
        'Understanding what tax penalties mean, why they were imposed, and what options you have to respond.',
      iconEmoji: '⚠️',
      keywords: [
        'penalty',
        'fine',
        'FIRS',
        'late',
        'notice',
        'interest',
        'non-compliance',
        'payment',
        'default',
      ],
      category: LawCategory.tax,
      isFeatured: true,
    },
    mappings: [
      {
        lawSlug: 'firs-act',
        sectionSlug: 'section-40',
        relevanceOrder: 1,
        relevanceNote:
          'Section 40 imposes 10% penalty for late payment of tax. This is added to the tax you already owe.',
      },
      {
        lawSlug: 'firs-act',
        sectionSlug: 'section-35',
        relevanceOrder: 2,
        relevanceNote:
          'Section 35 charges interest on unpaid tax from the due date. The longer you delay, the more you pay.',
      },
      {
        lawSlug: 'firs-act',
        sectionSlug: 'section-41',
        relevanceOrder: 3,
        relevanceNote:
          'Section 41 penalizes failure to keep records: ₦50,000 initial fine plus ₦10,000 per day continuing.',
      },
      {
        lawSlug: 'firs-act',
        sectionSlug: 'section-27',
        relevanceOrder: 4,
        relevanceNote:
          'Section 27 allows you to request review within 30 days if you believe the penalty is unjustified.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-36',
        relevanceOrder: 5,
        relevanceNote:
          'Section 36 ensures fair hearing - you can challenge penalties through proper appeal procedures.',
      },
    ],
  },
  {
    scenario: {
      slug: 'tax-audit-notice',
      title: 'FIRS is auditing my business - what should I do?',
      description:
        'Understanding your rights and obligations when FIRS conducts a tax audit or investigation of your business.',
      iconEmoji: '🔍',
      keywords: [
        'audit',
        'investigation',
        'FIRS',
        'records',
        'books',
        'examination',
        'compliance',
        'documents',
        'business',
      ],
      category: LawCategory.tax,
      isFeatured: false,
    },
    mappings: [
      {
        lawSlug: 'firs-act',
        sectionSlug: 'section-8',
        relevanceOrder: 1,
        relevanceNote:
          'Section 8 gives FIRS power to investigate, track non-compliant taxpayers, and counter tax avoidance schemes.',
      },
      {
        lawSlug: 'firs-act',
        sectionSlug: 'section-41',
        relevanceOrder: 2,
        relevanceNote:
          'Section 41 requires 6 years of records. Present your records as requested. Missing records attract penalties.',
      },
      {
        lawSlug: 'firs-act',
        sectionSlug: 'section-25',
        relevanceOrder: 3,
        relevanceNote:
          'Section 25 allows FIRS to assess based on judgment if your records are inadequate or returns unsatisfactory.',
      },
      {
        lawSlug: 'firs-act',
        sectionSlug: 'section-27',
        relevanceOrder: 4,
        relevanceNote:
          'Section 27 gives you 30 days to challenge any assessment arising from the audit.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-36',
        relevanceOrder: 5,
        relevanceNote:
          'Section 36 ensures due process. You have the right to fair treatment during the audit process.',
      },
    ],
  },
  {
    scenario: {
      slug: 'tax-refund-claim',
      title: 'I am owed a tax refund but have not received it',
      description:
        'Understanding how to claim a tax refund and what to do if FIRS delays processing your refund.',
      iconEmoji: '💵',
      keywords: [
        'refund',
        'overpaid',
        'excess',
        'claim',
        'withholding',
        'return',
        'credit',
        'payment',
        'FIRS',
      ],
      category: LawCategory.tax,
      isFeatured: false,
    },
    mappings: [
      {
        lawSlug: 'firs-act',
        sectionSlug: 'section-26',
        relevanceOrder: 1,
        relevanceNote:
          'Section 26 covers self-assessment. If you overpaid, your return should show a credit or refund due.',
      },
      {
        lawSlug: 'firs-act',
        sectionSlug: 'section-43',
        relevanceOrder: 2,
        relevanceNote:
          'Section 43 warns against false refund claims. Ensure your claim is legitimate and documented.',
      },
      {
        lawSlug: 'firs-act',
        sectionSlug: 'section-27',
        relevanceOrder: 3,
        relevanceNote:
          'Section 27 allows you to request review of decisions. If FIRS denies or delays your refund, request a review.',
      },
      {
        lawSlug: 'firs-act',
        sectionSlug: 'section-28',
        relevanceOrder: 4,
        relevanceNote:
          'Section 28 allows appeal to Tax Appeal Tribunal if the review does not resolve your refund issue.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-36',
        relevanceOrder: 5,
        relevanceNote:
          'Section 36 ensures you can pursue your refund through proper legal channels.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-44',
        relevanceOrder: 6,
        relevanceNote:
          'Section 44 protects your property. If you overpaid, you have a right to recover the excess.',
      },
    ],
  },
  {
    scenario: {
      slug: 'tax-clearance-certificate',
      title: 'How do I get a Tax Clearance Certificate?',
      description:
        'Understanding the purpose of Tax Clearance Certificates, when you need them, and how to apply.',
      iconEmoji: '📜',
      keywords: [
        'TCC',
        'clearance',
        'certificate',
        'contract',
        'license',
        'registration',
        'government',
        'application',
      ],
      category: LawCategory.tax,
      isFeatured: false,
    },
    mappings: [
      {
        lawSlug: 'firs-act',
        sectionSlug: 'section-51',
        relevanceOrder: 1,
        relevanceNote:
          'Section 51 explains TCC: issued when all taxes are paid. Required for contracts, licenses, vehicle registration, building approvals.',
      },
      {
        lawSlug: 'firs-act',
        sectionSlug: 'section-50',
        relevanceOrder: 2,
        relevanceNote:
          'Section 50 requires TIN registration first. You need a TIN before you can get a TCC.',
      },
      {
        lawSlug: 'firs-act',
        sectionSlug: 'section-26',
        relevanceOrder: 3,
        relevanceNote:
          'Section 26 self-assessment ensures your returns are filed. You need to be compliant to get a TCC.',
      },
      {
        lawSlug: 'firs-act',
        sectionSlug: 'section-31',
        relevanceOrder: 4,
        relevanceNote:
          'Section 31 requires payment of all assessed taxes. Outstanding taxes must be cleared before TCC is issued.',
      },
      {
        lawSlug: 'cama-2020',
        sectionSlug: 'section-27',
        relevanceOrder: 5,
        relevanceNote:
          'Companies may need TCC for CAC compliance. Ensure tax compliance when registering or renewing company status.',
      },
    ],
  },
];
