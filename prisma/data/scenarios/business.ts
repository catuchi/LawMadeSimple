/**
 * Business Scenarios
 *
 * Scenarios related to company registration, business operations, and
 * corporate governance under CAMA 2020 for Nigerian entrepreneurs and SMEs.
 */

import { LawCategory } from '@prisma/client';
import type { ScenarioWithMappings } from '../types';

export const businessScenarios: ScenarioWithMappings[] = [
  {
    scenario: {
      slug: 'start-a-company',
      title: 'How do I register a company in Nigeria?',
      description:
        'Understanding the steps, requirements, and legal framework for incorporating a private or public limited company with the Corporate Affairs Commission (CAC).',
      iconEmoji: '🏢',
      keywords: [
        'register',
        'company',
        'incorporation',
        'CAC',
        'limited',
        'business',
        'startup',
        'incorporate',
        'LLC',
        'private company',
      ],
      category: LawCategory.business,
      isFeatured: true,
    },
    mappings: [
      {
        lawSlug: 'cama-2020',
        sectionSlug: 'section-18',
        relevanceOrder: 1,
        relevanceNote:
          'Section 18 explains who can form a company - two or more persons, or just one person for a sole proprietorship company.',
      },
      {
        lawSlug: 'cama-2020',
        sectionSlug: 'section-27',
        relevanceOrder: 2,
        relevanceNote:
          'Section 27 covers the registration process - submit memorandum and articles to CAC, receive certificate within a day.',
      },
      {
        lawSlug: 'cama-2020',
        sectionSlug: 'section-28',
        relevanceOrder: 3,
        relevanceNote:
          'Section 28 explains what registration means - your company becomes a separate legal entity that can sue, own property, and contract.',
      },
      {
        lawSlug: 'cama-2020',
        sectionSlug: 'section-40',
        relevanceOrder: 4,
        relevanceNote:
          'Section 40 sets minimum share capital requirements: ₦100,000 for private companies, ₦2,000,000 for public companies.',
      },
      {
        lawSlug: 'cama-2020',
        sectionSlug: 'section-86',
        relevanceOrder: 5,
        relevanceNote:
          'Section 86 describes small company benefits - if you qualify, you may not need an auditor and can use simplified accounts.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-43',
        relevanceOrder: 6,
        relevanceNote:
          'Section 43 guarantees your right to own property, which includes ownership of business assets through your company.',
      },
    ],
  },
  {
    scenario: {
      slug: 'register-business-name',
      title: 'How do I register a business name in Nigeria?',
      description:
        'Understanding the legal requirements for registering a business name (as opposed to a company) for sole traders and partnerships.',
      iconEmoji: '📝',
      keywords: [
        'business name',
        'register',
        'sole trader',
        'enterprise',
        'partnership',
        'CAC',
        'registration',
        'trading name',
      ],
      category: LawCategory.business,
      isFeatured: true,
    },
    mappings: [
      {
        lawSlug: 'cama-2020',
        sectionSlug: 'section-822',
        relevanceOrder: 1,
        relevanceNote:
          'Section 822 requires you to register any business name different from your personal name. Operating without registration is illegal.',
      },
      {
        lawSlug: 'cama-2020',
        sectionSlug: 'section-824',
        relevanceOrder: 2,
        relevanceNote:
          'Section 824 lists what to provide for registration: business name, nature of business, address, and your personal details.',
      },
      {
        lawSlug: 'cama-2020',
        sectionSlug: 'section-839',
        relevanceOrder: 3,
        relevanceNote:
          'Section 839 warns of penalties: ₦50,000 fine per day for operating unregistered, and you cannot enforce contracts in court.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-43',
        relevanceOrder: 4,
        relevanceNote:
          'Section 43 protects your property rights including the right to operate a lawful business.',
      },
    ],
  },
  {
    scenario: {
      slug: 'register-ngo-church',
      title: 'How do I register an NGO or church in Nigeria?',
      description:
        'Understanding how to register a non-profit organization, religious body, charity, or association as incorporated trustees with CAC.',
      iconEmoji: '⛪',
      keywords: [
        'NGO',
        'church',
        'charity',
        'non-profit',
        'incorporated trustees',
        'registration',
        'association',
        'foundation',
        'religious',
        'club',
      ],
      category: LawCategory.business,
      isFeatured: true,
    },
    mappings: [
      {
        lawSlug: 'cama-2020',
        sectionSlug: 'section-823',
        relevanceOrder: 1,
        relevanceNote:
          'Section 823 allows religious, educational, charitable, and social organizations to register as incorporated trustees.',
      },
      {
        lawSlug: 'cama-2020',
        sectionSlug: 'section-842',
        relevanceOrder: 2,
        relevanceNote:
          'Section 842 explains that NGO property belongs to the organization, not members. Assets must be used for stated purposes only.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-38',
        relevanceOrder: 3,
        relevanceNote:
          'Section 38 guarantees freedom of religion, including the right to establish religious organizations.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-40',
        relevanceOrder: 4,
        relevanceNote:
          'Section 40 protects freedom of association, allowing you to form organizations for lawful purposes.',
      },
    ],
  },
  {
    scenario: {
      slug: 'director-removed-unfairly',
      title: 'I was unfairly removed as a company director',
      description:
        'Understanding your rights when you are removed from a board of directors without proper procedure or for improper reasons.',
      iconEmoji: '👔',
      keywords: [
        'director',
        'removed',
        'board',
        'unfair',
        'dismissal',
        'corporate',
        'shareholders',
        'meeting',
        'rights',
      ],
      category: LawCategory.business,
      isFeatured: false,
    },
    mappings: [
      {
        lawSlug: 'cama-2020',
        sectionSlug: 'section-302',
        relevanceOrder: 1,
        relevanceNote:
          'Section 302 allows shareholders to remove directors by ordinary resolution, but you have the right to be heard at the meeting.',
      },
      {
        lawSlug: 'cama-2020',
        sectionSlug: 'section-237',
        relevanceOrder: 2,
        relevanceNote:
          'Section 237 requires at least 21 days notice for meetings. If proper notice was not given, the removal may be invalid.',
      },
      {
        lawSlug: 'cama-2020',
        sectionSlug: 'section-265',
        relevanceOrder: 3,
        relevanceNote:
          'Section 265 sets minimum director requirements. Your removal may be invalid if it leaves the company below minimum.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-36',
        relevanceOrder: 4,
        relevanceNote:
          'Section 36 fair hearing principles apply - you deserve proper notice and opportunity to be heard before removal.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-43',
        relevanceOrder: 5,
        relevanceNote:
          'If you also hold shares, Section 43 protects your property rights as a shareholder even if removed as director.',
      },
    ],
  },
  {
    scenario: {
      slug: 'company-not-paying-dividends',
      title: 'My company is profitable but not paying dividends',
      description:
        'Understanding your rights as a shareholder when directors refuse to declare or pay dividends despite company profits.',
      iconEmoji: '💰',
      keywords: [
        'dividend',
        'profit',
        'shareholder',
        'investment',
        'returns',
        'company',
        'directors',
        'distribution',
        'AGM',
      ],
      category: LawCategory.business,
      isFeatured: false,
    },
    mappings: [
      {
        lawSlug: 'cama-2020',
        sectionSlug: 'section-426',
        relevanceOrder: 1,
        relevanceNote:
          'Section 426 says dividends can only come from profits and are declared at AGM. The AGM cannot exceed what directors recommend.',
      },
      {
        lawSlug: 'cama-2020',
        sectionSlug: 'section-114',
        relevanceOrder: 2,
        relevanceNote:
          'Section 114 confirms shareholders have the right to vote at meetings, including on dividend declarations.',
      },
      {
        lawSlug: 'cama-2020',
        sectionSlug: 'section-303',
        relevanceOrder: 3,
        relevanceNote:
          'Section 303 allows minority shareholders to apply to court if company affairs are conducted in an oppressive manner.',
      },
      {
        lawSlug: 'cama-2020',
        sectionSlug: 'section-235',
        relevanceOrder: 4,
        relevanceNote:
          'Section 235 requires annual general meetings where dividends are normally declared. Request an AGM if none has been held.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-36',
        relevanceOrder: 5,
        relevanceNote:
          'Section 36 fair hearing rights mean you can pursue your claim in court if negotiations fail.',
      },
    ],
  },
  {
    scenario: {
      slug: 'partner-dispute',
      title: 'I am having a dispute with my business partner',
      description:
        'Understanding options when partners or co-shareholders disagree about company direction, finances, or management.',
      iconEmoji: '🤝',
      keywords: [
        'partner',
        'dispute',
        'shareholders',
        'disagreement',
        'co-founder',
        'deadlock',
        'buyout',
        'conflict',
        'business',
      ],
      category: LawCategory.business,
      isFeatured: true,
    },
    mappings: [
      {
        lawSlug: 'cama-2020',
        sectionSlug: 'section-303',
        relevanceOrder: 1,
        relevanceNote:
          'Section 303 allows shareholders to apply to court if they are being oppressed or treated unfairly by other shareholders or directors.',
      },
      {
        lawSlug: 'cama-2020',
        sectionSlug: 'section-622',
        relevanceOrder: 2,
        relevanceNote:
          'Section 622 allows court to wind up a company if "just and equitable" - this can resolve deadlocked partnerships.',
      },
      {
        lawSlug: 'cama-2020',
        sectionSlug: 'section-258',
        relevanceOrder: 3,
        relevanceNote:
          'Section 258 allows written resolutions if all agree - useful for resolving disputes without formal meetings.',
      },
      {
        lawSlug: 'cama-2020',
        sectionSlug: 'section-114',
        relevanceOrder: 4,
        relevanceNote:
          'Section 114 confirms your shares are your property and transferable - consider negotiating a buyout.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-36',
        relevanceOrder: 5,
        relevanceNote:
          'Section 36 ensures you can seek fair resolution of disputes through the courts.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-43',
        relevanceOrder: 6,
        relevanceNote:
          'Section 43 protects your property rights in your shares regardless of the dispute.',
      },
    ],
  },
  {
    scenario: {
      slug: 'company-compliance',
      title: 'What annual requirements must my company fulfill?',
      description:
        'Understanding ongoing CAC compliance requirements for registered companies including filing annual returns, holding AGMs, and maintaining records.',
      iconEmoji: '📋',
      keywords: [
        'annual returns',
        'compliance',
        'CAC',
        'filing',
        'AGM',
        'records',
        'requirements',
        'corporate',
        'obligations',
      ],
      category: LawCategory.business,
      isFeatured: false,
    },
    mappings: [
      {
        lawSlug: 'cama-2020',
        sectionSlug: 'section-235',
        relevanceOrder: 1,
        relevanceNote:
          'Section 235 requires companies to hold an Annual General Meeting each year, not more than 15 months apart.',
      },
      {
        lawSlug: 'cama-2020',
        sectionSlug: 'section-86',
        relevanceOrder: 2,
        relevanceNote:
          'Section 86 provides relief for small companies - simplified accounts and no mandatory auditor requirement.',
      },
      {
        lawSlug: 'cama-2020',
        sectionSlug: 'section-282',
        relevanceOrder: 3,
        relevanceNote:
          'Section 282 requires directors to disclose any interests in company transactions. Non-disclosure is criminal.',
      },
      {
        lawSlug: 'cama-2020',
        sectionSlug: 'section-305',
        relevanceOrder: 4,
        relevanceNote:
          "Section 305 sets out director duties including acting in good faith and in the company's best interest.",
      },
    ],
  },
  {
    scenario: {
      slug: 'close-my-company',
      title: 'How do I close down or wind up my company?',
      description:
        'Understanding the legal process for voluntarily dissolving a company when you want to cease business operations.',
      iconEmoji: '🔒',
      keywords: [
        'close',
        'wind up',
        'dissolve',
        'liquidation',
        'shutdown',
        'end',
        'company',
        'voluntary',
        'strike off',
      ],
      category: LawCategory.business,
      isFeatured: false,
    },
    mappings: [
      {
        lawSlug: 'cama-2020',
        sectionSlug: 'section-572',
        relevanceOrder: 1,
        relevanceNote:
          'Section 572 explains voluntary winding up - shareholders can pass a special resolution to wind up the company.',
      },
      {
        lawSlug: 'cama-2020',
        sectionSlug: 'section-622',
        relevanceOrder: 2,
        relevanceNote:
          'Section 622 lists circumstances for court-ordered winding up including company inactivity for a year or insolvency.',
      },
      {
        lawSlug: 'cama-2020',
        sectionSlug: 'section-258',
        relevanceOrder: 3,
        relevanceNote:
          'Section 258 allows written resolutions - useful for passing the special resolution to wind up without holding a meeting.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-36',
        relevanceOrder: 4,
        relevanceNote:
          'Section 36 ensures creditors and stakeholders have fair hearing rights in the winding up process.',
      },
    ],
  },
];
