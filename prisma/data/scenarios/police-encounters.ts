/**
 * Police Encounters Scenarios
 *
 * Scenarios related to interactions with law enforcement, including arrests,
 * detention, and understanding your rights when dealing with police.
 */

import { LawCategory } from '@prisma/client';
import type { ScenarioWithMappings } from '../types';

export const policeEncountersScenarios: ScenarioWithMappings[] = [
  {
    scenario: {
      slug: 'police-arrest-without-warrant',
      title: 'Police arrested me without a warrant',
      description:
        'Understanding your rights when police arrest you without showing a warrant or explaining the reason.',
      iconEmoji: '👮',
      keywords: ['police', 'arrest', 'warrant', 'detention', 'rights', 'custody'],
      category: LawCategory.criminal,
      isFeatured: true,
    },
    mappings: [
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-35',
        relevanceOrder: 1,
        relevanceNote:
          'Section 35 protects your right to personal liberty. Police must follow legal procedures when arresting someone, including informing you of charges within 24 hours.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-36',
        relevanceOrder: 2,
        relevanceNote:
          'Section 36 ensures your right to fair hearing - you are presumed innocent until proven guilty.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-34',
        relevanceOrder: 3,
        relevanceNote:
          'Section 34 protects you from torture or inhuman treatment while in police custody.',
      },
      {
        lawSlug: 'criminal-code-act',
        sectionSlug: 'section-366',
        relevanceOrder: 4,
        relevanceNote:
          'Section 366 makes wrongful confinement a criminal offence. Police who detain you illegally can be prosecuted under this section.',
      },
    ],
  },
  {
    scenario: {
      slug: 'detained-beyond-24-hours',
      title: 'Police held me for more than 24 hours without charge',
      description:
        'What to do when police detain you beyond the legal time limit without bringing you before a court.',
      iconEmoji: '⏰',
      keywords: ['detention', 'police', 'bail', 'court', 'holding', 'cell', '24 hours', 'charge'],
      category: LawCategory.criminal,
      isFeatured: true,
    },
    mappings: [
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-35',
        relevanceOrder: 1,
        relevanceNote:
          'Section 35(4) requires you to be brought before a court within a reasonable time - typically 24-48 hours. Extended detention without charge is unconstitutional.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-46',
        relevanceOrder: 2,
        relevanceNote:
          'Section 46 allows you to apply to the High Court for enforcement of your fundamental rights if unlawfully detained.',
      },
      {
        lawSlug: 'criminal-code-act',
        sectionSlug: 'section-366',
        relevanceOrder: 3,
        relevanceNote:
          'Wrongful confinement is a criminal offence under Section 366. Keeping you beyond the legal limit without valid reason could constitute this offence.',
      },
    ],
  },
  {
    scenario: {
      slug: 'police-demanding-bribe',
      title: 'Police officers demanded a bribe from me',
      description:
        'Understanding your rights and options when police officers request illegal payments.',
      iconEmoji: '💰',
      keywords: ['bribe', 'police', 'corruption', 'extortion', 'checkpoint', 'payment', 'illegal'],
      category: LawCategory.criminal,
      isFeatured: true,
    },
    mappings: [
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-34',
        relevanceOrder: 1,
        relevanceNote:
          'Extortion violates your dignity. Section 34 protects you from degrading treatment.',
      },
      {
        lawSlug: 'criminal-code-act',
        sectionSlug: 'section-406',
        relevanceOrder: 2,
        relevanceNote:
          'Section 406 criminalizes extortion by threats. Police threatening arrest or prosecution to extract money commit this offence, punishable by up to 14 years.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-46',
        relevanceOrder: 3,
        relevanceNote: 'You can seek legal redress for violations of your fundamental rights.',
      },
    ],
  },
  {
    scenario: {
      slug: 'police-searched-without-warrant',
      title: 'Police searched my property without a warrant',
      description:
        'Know your rights when police want to search your home, vehicle, or personal belongings.',
      iconEmoji: '🔍',
      keywords: ['search', 'police', 'warrant', 'property', 'home', 'vehicle', 'rights'],
      category: LawCategory.criminal,
      isFeatured: false,
    },
    mappings: [
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-37',
        relevanceOrder: 1,
        relevanceNote:
          'Section 37 guarantees the privacy of your home. Police generally need a warrant to search your property.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-35',
        relevanceOrder: 2,
        relevanceNote:
          'If arrested during an illegal search, Section 35 protects your liberty rights.',
      },
      {
        lawSlug: 'criminal-code-act',
        sectionSlug: 'section-342',
        relevanceOrder: 3,
        relevanceNote:
          'Criminal trespass under Section 342 applies when someone enters property without lawful authority. An unlawful police search could potentially constitute this offence.',
      },
    ],
  },
  {
    scenario: {
      slug: 'denied-access-to-lawyer',
      title: 'Police denied me access to a lawyer',
      description: 'Understanding your right to legal representation when in police custody.',
      iconEmoji: '⚖️',
      keywords: ['lawyer', 'attorney', 'counsel', 'police', 'custody', 'rights', 'legal aid'],
      category: LawCategory.criminal,
      isFeatured: true,
    },
    mappings: [
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-35',
        relevanceOrder: 1,
        relevanceNote:
          'Section 35(2) gives you the right to remain silent and consult with a legal practitioner before answering questions.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-36',
        relevanceOrder: 2,
        relevanceNote:
          'Section 36(6)(c) guarantees your right to defend yourself with a legal practitioner of your choice.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-46',
        relevanceOrder: 3,
        relevanceNote:
          'Section 46(4)(b) mandates legal aid for indigent citizens whose rights are infringed.',
      },
    ],
  },
  {
    scenario: {
      slug: 'police-brutality',
      title: 'I was beaten or mistreated by police',
      description:
        'What to do if you experience physical abuse or torture by law enforcement officers.',
      iconEmoji: '🤕',
      keywords: ['brutality', 'police', 'violence', 'abuse', 'torture', 'beating', 'sars', 'force'],
      category: LawCategory.criminal,
      isFeatured: true,
    },
    mappings: [
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-34',
        relevanceOrder: 1,
        relevanceNote:
          'Section 34 explicitly prohibits torture and inhuman or degrading treatment. This is a fundamental right that cannot be suspended.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-33',
        relevanceOrder: 2,
        relevanceNote: 'In severe cases, Section 33 protects your fundamental right to life.',
      },
      {
        lawSlug: 'criminal-code-act',
        sectionSlug: 'section-351',
        relevanceOrder: 3,
        relevanceNote:
          'Common assault under Section 351 is a criminal offence. Police who beat suspects commit assault.',
      },
      {
        lawSlug: 'criminal-code-act',
        sectionSlug: 'section-352',
        relevanceOrder: 4,
        relevanceNote:
          'If the beating causes injury, Section 352 applies - assault occasioning actual bodily harm is a felony punishable by 5 years.',
      },
      {
        lawSlug: 'criminal-code-act',
        sectionSlug: 'section-360',
        relevanceOrder: 5,
        relevanceNote:
          'Grievous harm under Section 360 applies when injuries are serious - punishable by 7 years imprisonment.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-46',
        relevanceOrder: 6,
        relevanceNote:
          'You can apply to the High Court for compensation and public apology from the appropriate authority.',
      },
    ],
  },
];
