/**
 * Intellectual Property Protection Scenarios
 *
 * Scenarios related to copyright, trademarks, and patents for Nigerian
 * content creators, artists, musicians, entrepreneurs, and inventors.
 */

import { LawCategory } from '@prisma/client';
import type { ScenarioWithMappings } from '../types';

export const ipProtectionScenarios: ScenarioWithMappings[] = [
  // =====================================================
  // COPYRIGHT SCENARIOS
  // =====================================================
  {
    scenario: {
      slug: 'someone-copied-my-work',
      title: 'Someone copied my creative work without permission',
      description:
        'Understanding your rights and options when someone reproduces, distributes, or uses your music, writing, art, or other creative work without authorization.',
      iconEmoji: '📚',
      keywords: [
        'copyright',
        'infringement',
        'copied',
        'stolen',
        'piracy',
        'plagiarism',
        'music',
        'art',
        'content',
        'creator',
      ],
      category: LawCategory.intellectual_property,
      isFeatured: true,
    },
    mappings: [
      {
        lawSlug: 'copyright-act-2022',
        sectionSlug: 'section-40',
        relevanceOrder: 1,
        relevanceNote:
          'Section 40 defines what constitutes copyright infringement - doing any protected act without permission is infringement.',
      },
      {
        lawSlug: 'copyright-act-2022',
        sectionSlug: 'section-51',
        relevanceOrder: 2,
        relevanceNote:
          'Section 51 outlines your remedies: damages, injunction, account of profits, and delivery up of infringing copies.',
      },
      {
        lawSlug: 'copyright-act-2022',
        sectionSlug: 'section-52',
        relevanceOrder: 3,
        relevanceNote:
          'Section 52 makes commercial piracy criminal: minimum ₦500,000 fine or 12 months imprisonment.',
      },
      {
        lawSlug: 'copyright-act-2022',
        sectionSlug: 'section-10',
        relevanceOrder: 4,
        relevanceNote:
          'Section 10 confirms your exclusive rights to reproduce, distribute, perform, and adapt your work.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-43',
        relevanceOrder: 5,
        relevanceNote:
          'Section 43 protects your property rights - copyright is intellectual property protected by the Constitution.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-36',
        relevanceOrder: 6,
        relevanceNote:
          'Section 36 ensures you can pursue your infringement claim through the courts with fair hearing.',
      },
    ],
  },
  {
    scenario: {
      slug: 'using-music-in-video',
      title: 'Can I use music in my video content?',
      description:
        'Understanding the legal requirements for using copyrighted music in YouTube videos, TikToks, podcasts, or other content.',
      iconEmoji: '🎵',
      keywords: [
        'music',
        'license',
        'video',
        'YouTube',
        'TikTok',
        'podcast',
        'background music',
        'sync',
        'royalty',
        'streaming',
      ],
      category: LawCategory.intellectual_property,
      isFeatured: true,
    },
    mappings: [
      {
        lawSlug: 'copyright-act-2022',
        sectionSlug: 'section-10',
        relevanceOrder: 1,
        relevanceNote:
          'Section 10 gives music owners exclusive rights including the right to make films/recordings of their work. You need permission.',
      },
      {
        lawSlug: 'copyright-act-2022',
        sectionSlug: 'section-25',
        relevanceOrder: 2,
        relevanceNote:
          'Section 25 explains licensing - you can get a license from the copyright owner to use their music legally.',
      },
      {
        lawSlug: 'copyright-act-2022',
        sectionSlug: 'section-45',
        relevanceOrder: 3,
        relevanceNote:
          'Section 45 covers fair use - very brief clips for commentary/review may be allowed, but commercial use typically is not.',
      },
      {
        lawSlug: 'copyright-act-2022',
        sectionSlug: 'section-40',
        relevanceOrder: 4,
        relevanceNote:
          'Section 40 warns that using music without permission is infringement with serious consequences.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-39',
        relevanceOrder: 5,
        relevanceNote:
          "Section 39 protects freedom of expression, but this does not override copyright owners' rights.",
      },
    ],
  },
  {
    scenario: {
      slug: 'protect-my-content-online',
      title: 'How do I protect my content online from piracy?',
      description:
        'Understanding how to protect your digital content, use takedown notices, and enforce your rights against online infringement.',
      iconEmoji: '🛡️',
      keywords: [
        'online',
        'piracy',
        'takedown',
        'DMCA',
        'protection',
        'digital',
        'streaming',
        'social media',
        'upload',
        'website',
      ],
      category: LawCategory.intellectual_property,
      isFeatured: true,
    },
    mappings: [
      {
        lawSlug: 'copyright-act-2022',
        sectionSlug: 'section-61',
        relevanceOrder: 1,
        relevanceNote:
          'Section 61 establishes the notice and takedown system. You can send takedown notices to platforms hosting your content illegally.',
      },
      {
        lawSlug: 'copyright-act-2022',
        sectionSlug: 'section-60',
        relevanceOrder: 2,
        relevanceNote:
          'Section 60 makes it illegal to break digital locks (DRM) or sell devices designed to bypass copy protection.',
      },
      {
        lawSlug: 'copyright-act-2022',
        sectionSlug: 'section-1',
        relevanceOrder: 3,
        relevanceNote:
          'Section 1 confirms your content is automatically protected if it is original and fixed in some form (uploaded, recorded, written).',
      },
      {
        lawSlug: 'copyright-act-2022',
        sectionSlug: 'section-51',
        relevanceOrder: 4,
        relevanceNote:
          'Section 51 lists remedies including injunctions to stop ongoing infringement and damages for losses.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-43',
        relevanceOrder: 5,
        relevanceNote:
          'Section 43 constitutional property rights extend to your intellectual property.',
      },
    ],
  },
  {
    scenario: {
      slug: 'work-made-for-employer',
      title: 'Who owns creative work I made for my employer?',
      description:
        'Understanding copyright ownership when you create content, designs, or code as part of your job or as a freelancer.',
      iconEmoji: '💼',
      keywords: [
        'employer',
        'ownership',
        'work for hire',
        'employee',
        'freelance',
        'contract',
        'commissioned',
        'job',
        'company',
      ],
      category: LawCategory.intellectual_property,
      isFeatured: false,
    },
    mappings: [
      {
        lawSlug: 'copyright-act-2022',
        sectionSlug: 'section-20',
        relevanceOrder: 1,
        relevanceNote:
          'Section 20 says if you create work as part of your job, your employer owns the copyright unless you agree otherwise in writing.',
      },
      {
        lawSlug: 'copyright-act-2022',
        sectionSlug: 'section-21',
        relevanceOrder: 2,
        relevanceNote:
          'Section 21 covers commissioned works - the commissioner owns copyright in photos, films, portraits, and recordings they paid for.',
      },
      {
        lawSlug: 'copyright-act-2022',
        sectionSlug: 'section-15',
        relevanceOrder: 3,
        relevanceNote:
          'Section 15 preserves your moral rights even if your employer owns the copyright. You can still be credited as author.',
      },
      {
        lawSlug: 'copyright-act-2022',
        sectionSlug: 'section-25',
        relevanceOrder: 4,
        relevanceNote:
          'Section 25 allows modification of ownership by written agreement. Negotiate before starting work.',
      },
      {
        lawSlug: 'labour-act',
        sectionSlug: 'section-7',
        relevanceOrder: 5,
        relevanceNote:
          'Section 7 requires written employment terms. IP ownership should be specified in your contract.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-36',
        relevanceOrder: 6,
        relevanceNote:
          'Section 36 fair hearing protects your right to dispute ownership claims in court.',
      },
    ],
  },
  {
    scenario: {
      slug: 'someone-claiming-my-work',
      title: 'Someone is falsely claiming to have created my work',
      description:
        'Understanding your moral rights when someone claims authorship of your creative work or removes your credit.',
      iconEmoji: '😤',
      keywords: [
        'credit',
        'attribution',
        'authorship',
        'moral rights',
        'claim',
        'false',
        'steal',
        'name',
        'reputation',
      ],
      category: LawCategory.intellectual_property,
      isFeatured: true,
    },
    mappings: [
      {
        lawSlug: 'copyright-act-2022',
        sectionSlug: 'section-15',
        relevanceOrder: 1,
        relevanceNote:
          'Section 15 guarantees your moral right to claim authorship and object to distortion of your work. These rights cannot be sold.',
      },
      {
        lawSlug: 'copyright-act-2022',
        sectionSlug: 'section-51',
        relevanceOrder: 2,
        relevanceNote:
          'Section 51 allows you to sue for infringement of both economic and moral rights.',
      },
      {
        lawSlug: 'copyright-act-2022',
        sectionSlug: 'section-20',
        relevanceOrder: 3,
        relevanceNote:
          'Section 20 confirms you are the first owner of works you create, establishing your authorship claim.',
      },
      {
        lawSlug: 'criminal-code-act',
        sectionSlug: 'section-375',
        relevanceOrder: 4,
        relevanceNote:
          'Section 375 of Criminal Code covers defamation - false claims about your work may damage your reputation.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-34',
        relevanceOrder: 5,
        relevanceNote:
          'Section 34 protects your dignity - stealing credit for your work degrades your professional standing.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-36',
        relevanceOrder: 6,
        relevanceNote: 'Section 36 ensures you can vindicate your authorship through the courts.',
      },
    ],
  },
  {
    scenario: {
      slug: 'content-taken-down-unfairly',
      title: 'My content was taken down with a false copyright claim',
      description:
        'Understanding your options when someone files a fraudulent or mistaken copyright claim against your original content.',
      iconEmoji: '❌',
      keywords: [
        'takedown',
        'false claim',
        'strike',
        'YouTube',
        'counter notice',
        'dispute',
        'original',
        'DMCA',
        'unfair',
      ],
      category: LawCategory.intellectual_property,
      isFeatured: false,
    },
    mappings: [
      {
        lawSlug: 'copyright-act-2022',
        sectionSlug: 'section-61',
        relevanceOrder: 1,
        relevanceNote:
          'Section 61 covers takedowns. If the claim is false, you can file a counter-notice and the platform should restore your content.',
      },
      {
        lawSlug: 'copyright-act-2022',
        sectionSlug: 'section-45',
        relevanceOrder: 2,
        relevanceNote:
          'Section 45 fair use may protect your content if you used small portions for commentary, criticism, or education.',
      },
      {
        lawSlug: 'copyright-act-2022',
        sectionSlug: 'section-1',
        relevanceOrder: 3,
        relevanceNote:
          'Section 1 shows what is protected. If your content is original and different, the claim may be invalid.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-39',
        relevanceOrder: 4,
        relevanceNote:
          'Section 39 protects your freedom of expression. False claims that silence legitimate speech may be challenged.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-36',
        relevanceOrder: 5,
        relevanceNote: 'Section 36 ensures fair hearing if you need to take the dispute to court.',
      },
    ],
  },

  // =====================================================
  // TRADEMARK SCENARIOS
  // =====================================================
  {
    scenario: {
      slug: 'register-my-brand',
      title: 'How do I register my brand name or logo as a trademark?',
      description:
        'Understanding the process, requirements, and benefits of registering your brand name, logo, or slogan as a trademark in Nigeria.',
      iconEmoji: '™️',
      keywords: [
        'trademark',
        'register',
        'brand',
        'logo',
        'name',
        'business',
        'protection',
        'registry',
        'IPO',
      ],
      category: LawCategory.intellectual_property,
      isFeatured: true,
    },
    mappings: [
      {
        lawSlug: 'trademarks-act',
        sectionSlug: 'section-9',
        relevanceOrder: 1,
        relevanceNote:
          'Section 9 explains how to apply: written application with representation of your mark, goods/services, and prescribed fee.',
      },
      {
        lawSlug: 'trademarks-act',
        sectionSlug: 'section-5',
        relevanceOrder: 2,
        relevanceNote:
          'Section 5 lists what can be registered: distinctive names, invented words, logos. Generic/descriptive marks are harder to register.',
      },
      {
        lawSlug: 'trademarks-act',
        sectionSlug: 'section-10',
        relevanceOrder: 3,
        relevanceNote:
          'Section 10 covers the search process - the Registry checks for existing similar marks before accepting your application.',
      },
      {
        lawSlug: 'trademarks-act',
        sectionSlug: 'section-7',
        relevanceOrder: 4,
        relevanceNote:
          'Section 7 explains your rights after registration: exclusive use of your trademark for your registered goods.',
      },
      {
        lawSlug: 'trademarks-act',
        sectionSlug: 'section-23',
        relevanceOrder: 5,
        relevanceNote:
          'Section 23 covers duration: initial 7 years, renewable for 14-year periods indefinitely.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-43',
        relevanceOrder: 6,
        relevanceNote: 'Section 43 property rights extend to trademarks as intellectual property.',
      },
    ],
  },
  {
    scenario: {
      slug: 'someone-using-my-brand',
      title: 'Someone is using my brand name or logo without permission',
      description:
        'Understanding your rights and remedies when another business infringes your registered trademark.',
      iconEmoji: '⚠️',
      keywords: [
        'infringement',
        'brand',
        'copying',
        'trademark',
        'fake',
        'counterfeit',
        'similar',
        'confusion',
        'competitor',
      ],
      category: LawCategory.intellectual_property,
      isFeatured: true,
    },
    mappings: [
      {
        lawSlug: 'trademarks-act',
        sectionSlug: 'section-5-2',
        relevanceOrder: 1,
        relevanceNote:
          'Section 5(2) defines infringement: using an identical or confusingly similar mark on same/similar goods without permission.',
      },
      {
        lawSlug: 'trademarks-act',
        sectionSlug: 'section-43',
        relevanceOrder: 2,
        relevanceNote:
          'Section 43 allows you to sue for: damages, injunction (stop them), account of profits (take their earnings).',
      },
      {
        lawSlug: 'trademarks-act',
        sectionSlug: 'section-7',
        relevanceOrder: 3,
        relevanceNote:
          'Section 7 confirms your exclusive right to use the mark. Part A registration gives stronger protection than Part B.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-43',
        relevanceOrder: 4,
        relevanceNote: 'Section 43 protects your property rights including intellectual property.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-36',
        relevanceOrder: 5,
        relevanceNote:
          'Section 36 ensures you can pursue your infringement claim through the courts.',
      },
    ],
  },
  {
    scenario: {
      slug: 'brand-registration-rejected',
      title: 'My trademark application was rejected or opposed',
      description:
        'Understanding why trademark applications are refused and what options you have to appeal or modify your application.',
      iconEmoji: '🚫',
      keywords: [
        'rejected',
        'refused',
        'opposition',
        'appeal',
        'trademark',
        'registration',
        'similar',
        'conflict',
      ],
      category: LawCategory.intellectual_property,
      isFeatured: false,
    },
    mappings: [
      {
        lawSlug: 'trademarks-act',
        sectionSlug: 'section-6',
        relevanceOrder: 1,
        relevanceNote:
          'Section 6 lists grounds for refusal: deceptive, immoral, offensive marks, or marks too similar to existing registrations.',
      },
      {
        lawSlug: 'trademarks-act',
        sectionSlug: 'section-13',
        relevanceOrder: 2,
        relevanceNote:
          'Section 13 covers opposition proceedings. You can file a counter-statement to defend your application.',
      },
      {
        lawSlug: 'trademarks-act',
        sectionSlug: 'section-5',
        relevanceOrder: 3,
        relevanceNote:
          'Section 5 explains registrability requirements. Your mark may not be distinctive enough - consider Part B registration.',
      },
      {
        lawSlug: 'trademarks-act',
        sectionSlug: 'section-10',
        relevanceOrder: 4,
        relevanceNote:
          'Section 10 search revealed conflicts. You may need to modify your mark or challenge the earlier registration.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-36',
        relevanceOrder: 5,
        relevanceNote:
          'Section 36 ensures you have fair hearing rights including the right to appeal Registry decisions.',
      },
    ],
  },
  {
    scenario: {
      slug: 'counterfeit-products',
      title: 'Someone is selling counterfeit products with my brand',
      description:
        'Understanding your rights against counterfeiters and how to stop the sale of fake products bearing your trademark.',
      iconEmoji: '🏷️',
      keywords: [
        'counterfeit',
        'fake',
        'imitation',
        'knock-off',
        'pirated',
        'brand',
        'products',
        'market',
        'enforcement',
      ],
      category: LawCategory.intellectual_property,
      isFeatured: false,
    },
    mappings: [
      {
        lawSlug: 'trademarks-act',
        sectionSlug: 'section-5-2',
        relevanceOrder: 1,
        relevanceNote:
          'Section 5(2) makes counterfeiting infringement. Using your trademark on fake goods is illegal.',
      },
      {
        lawSlug: 'trademarks-act',
        sectionSlug: 'section-43',
        relevanceOrder: 2,
        relevanceNote:
          'Section 43 provides civil remedies: injunction, damages, and seizure of counterfeit goods.',
      },
      {
        lawSlug: 'trademarks-act',
        sectionSlug: 'section-48',
        relevanceOrder: 3,
        relevanceNote:
          'Section 48 makes falsifying trademark records criminal - up to 2 years imprisonment.',
      },
      {
        lawSlug: 'trademarks-act',
        sectionSlug: 'section-49',
        relevanceOrder: 4,
        relevanceNote:
          'Section 49 criminalizes falsely claiming goods are trademarked or registered.',
      },
      {
        lawSlug: 'criminal-code-act',
        sectionSlug: 'section-383',
        relevanceOrder: 5,
        relevanceNote:
          'Counterfeiting may also constitute stealing under Criminal Code Section 383.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-43',
        relevanceOrder: 6,
        relevanceNote: 'Section 43 protects your property rights in your trademark and brand.',
      },
    ],
  },

  // =====================================================
  // PATENT AND DESIGN SCENARIOS
  // =====================================================
  {
    scenario: {
      slug: 'protect-my-invention',
      title: 'How do I patent my invention in Nigeria?',
      description:
        'Understanding the process, requirements, and benefits of registering a patent for your invention or innovation.',
      iconEmoji: '💡',
      keywords: [
        'patent',
        'invention',
        'protect',
        'innovation',
        'register',
        'idea',
        'product',
        'technology',
        'inventor',
      ],
      category: LawCategory.intellectual_property,
      isFeatured: false,
    },
    mappings: [
      {
        lawSlug: 'patents-designs-act',
        sectionSlug: 'section-1',
        relevanceOrder: 1,
        relevanceNote:
          'Section 1 explains patentability: your invention must be new, inventive (not obvious), and industrially applicable.',
      },
      {
        lawSlug: 'patents-designs-act',
        sectionSlug: 'section-3',
        relevanceOrder: 2,
        relevanceNote:
          'Section 3 covers the application: submit a request, specification with description and claims, and drawings.',
      },
      {
        lawSlug: 'patents-designs-act',
        sectionSlug: 'section-2',
        relevanceOrder: 3,
        relevanceNote:
          'Section 2 says the first to file gets the patent. Apply quickly before someone else does.',
      },
      {
        lawSlug: 'patents-designs-act',
        sectionSlug: 'section-9',
        relevanceOrder: 4,
        relevanceNote:
          'Section 9 explains your rights: exclusive right to make, import, sell, and use your invention.',
      },
      {
        lawSlug: 'patents-designs-act',
        sectionSlug: 'section-7',
        relevanceOrder: 5,
        relevanceNote:
          'Section 7 covers duration: patents last 20 years from filing with annual renewal fees.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-43',
        relevanceOrder: 6,
        relevanceNote:
          'Section 43 property rights extend to intellectual property including patents.',
      },
    ],
  },
  {
    scenario: {
      slug: 'someone-copied-my-design',
      title: 'Someone copied my product design',
      description:
        'Understanding your rights when another business copies the visual appearance or design of your product.',
      iconEmoji: '🎨',
      keywords: [
        'design',
        'copied',
        'product',
        'appearance',
        'infringement',
        'industrial design',
        'look',
        'visual',
        'aesthetic',
      ],
      category: LawCategory.intellectual_property,
      isFeatured: false,
    },
    mappings: [
      {
        lawSlug: 'patents-designs-act',
        sectionSlug: 'section-17',
        relevanceOrder: 1,
        relevanceNote:
          'Section 17 gives you exclusive rights to reproduce your design in products and to import/sell such products.',
      },
      {
        lawSlug: 'patents-designs-act',
        sectionSlug: 'section-12',
        relevanceOrder: 2,
        relevanceNote:
          'Section 12 explains registrable designs: the visual appearance must be new and not contrary to morality.',
      },
      {
        lawSlug: 'patents-designs-act',
        sectionSlug: 'section-14',
        relevanceOrder: 3,
        relevanceNote:
          'Section 14 covers registration: submit drawings/photographs and specify the products your design is for.',
      },
      {
        lawSlug: 'patents-designs-act',
        sectionSlug: 'section-16',
        relevanceOrder: 4,
        relevanceNote:
          'Section 16 covers duration: design protection lasts 5 years, renewable twice (total 15 years).',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-43',
        relevanceOrder: 5,
        relevanceNote: 'Section 43 protects your property rights including design registrations.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-36',
        relevanceOrder: 6,
        relevanceNote: 'Section 36 ensures fair hearing for enforcing your design rights in court.',
      },
    ],
  },
  {
    scenario: {
      slug: 'invention-made-at-work',
      title: 'I invented something at my workplace - who owns it?',
      description:
        'Understanding ownership of inventions made during employment and your right to compensation.',
      iconEmoji: '🏭',
      keywords: [
        'employee',
        'invention',
        'ownership',
        'workplace',
        'employer',
        'compensation',
        'patent',
        'rights',
        'job',
      ],
      category: LawCategory.intellectual_property,
      isFeatured: false,
    },
    mappings: [
      {
        lawSlug: 'patents-designs-act',
        sectionSlug: 'section-6',
        relevanceOrder: 1,
        relevanceNote:
          'Section 6 says if you invented using employer resources, the employer owns the patent but must pay you fair compensation.',
      },
      {
        lawSlug: 'patents-designs-act',
        sectionSlug: 'section-2',
        relevanceOrder: 2,
        relevanceNote:
          'Section 2 covers who has the right to patent. The employer may file in their name if Section 6 applies.',
      },
      {
        lawSlug: 'labour-act',
        sectionSlug: 'section-7',
        relevanceOrder: 3,
        relevanceNote:
          'Section 7 requires written employment terms. Check if your contract addresses inventions and IP.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-36',
        relevanceOrder: 4,
        relevanceNote:
          'Section 36 ensures fair hearing if you need to dispute ownership or compensation.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-43',
        relevanceOrder: 5,
        relevanceNote:
          'Section 43 protects your property rights. Even if the employer owns the patent, you have a right to compensation.',
      },
    ],
  },
];
