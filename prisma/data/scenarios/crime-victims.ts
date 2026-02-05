/**
 * Crime Victims Scenarios
 *
 * Scenarios for people who have been victims of crimes such as assault,
 * theft, robbery, defamation, and property crimes.
 */

import { LawCategory } from '@prisma/client';
import type { ScenarioWithMappings } from '../types';

export const crimeVictimsScenarios: ScenarioWithMappings[] = [
  {
    scenario: {
      slug: 'victim-of-assault',
      title: 'Someone physically assaulted me',
      description:
        'What to do if you are attacked, beaten, or physically harmed by another person.',
      iconEmoji: '🤛',
      keywords: ['assault', 'attack', 'beaten', 'fight', 'violence', 'harm', 'injury', 'physical'],
      category: LawCategory.criminal,
      isFeatured: true,
    },
    mappings: [
      {
        lawSlug: 'criminal-code-act',
        sectionSlug: 'section-351',
        relevanceOrder: 1,
        relevanceNote:
          'Section 351 criminalizes common assault - any unlawful physical contact or threatening behavior. Punishable by 1 year imprisonment.',
      },
      {
        lawSlug: 'criminal-code-act',
        sectionSlug: 'section-352',
        relevanceOrder: 2,
        relevanceNote:
          'If the assault caused visible injury (bruises, cuts, swelling), Section 352 applies - assault occasioning actual bodily harm is a felony with up to 5 years imprisonment.',
      },
      {
        lawSlug: 'criminal-code-act',
        sectionSlug: 'section-360',
        relevanceOrder: 3,
        relevanceNote:
          'For serious injuries (broken bones, permanent damage), Section 360 on grievous harm applies with up to 7 years imprisonment.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-34',
        relevanceOrder: 4,
        relevanceNote:
          'Section 34 protects your dignity and prohibits inhuman treatment. You have a constitutional right to be free from violence.',
      },
    ],
  },
  {
    scenario: {
      slug: 'someone-stole-from-me',
      title: 'Someone stole my property',
      description: 'Understanding theft laws and your options when your belongings are stolen.',
      iconEmoji: '🕵️',
      keywords: ['theft', 'steal', 'stolen', 'property', 'missing', 'taken', 'thief', 'robbed'],
      category: LawCategory.criminal,
      isFeatured: true,
    },
    mappings: [
      {
        lawSlug: 'criminal-code-act',
        sectionSlug: 'section-383',
        relevanceOrder: 1,
        relevanceNote:
          'Section 383 defines stealing - fraudulently taking property with intent to permanently deprive the owner. This is the foundation of theft charges.',
      },
      {
        lawSlug: 'criminal-code-act',
        sectionSlug: 'section-390',
        relevanceOrder: 2,
        relevanceNote:
          'Section 390 prescribes punishment - 3 years for simple theft, 7 years for valuable items (over ₦1,000), vehicles, or theft by employees.',
      },
      {
        lawSlug: 'criminal-code-act',
        sectionSlug: 'section-427',
        relevanceOrder: 3,
        relevanceNote:
          'Section 427 covers receiving stolen property. Anyone who knowingly buys or receives your stolen items faces up to 14 years imprisonment.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-44',
        relevanceOrder: 4,
        relevanceNote:
          'Section 44 protects your property rights. Only the government can compulsorily acquire property, and only with compensation.',
      },
    ],
  },
  {
    scenario: {
      slug: 'i-was-robbed',
      title: 'I was robbed at gunpoint or with threats',
      description: 'What to do when someone steals from you using violence, threats, or weapons.',
      iconEmoji: '🔫',
      keywords: [
        'robbery',
        'armed',
        'gunpoint',
        'threat',
        'violence',
        'mugged',
        'attacked',
        'weapon',
      ],
      category: LawCategory.criminal,
      isFeatured: true,
    },
    mappings: [
      {
        lawSlug: 'criminal-code-act',
        sectionSlug: 'section-401',
        relevanceOrder: 1,
        relevanceNote:
          'Section 401 defines robbery - theft accompanied by violence or threats of violence before, during, or after the taking.',
      },
      {
        lawSlug: 'criminal-code-act',
        sectionSlug: 'section-402',
        relevanceOrder: 2,
        relevanceNote:
          'Section 402 prescribes severe punishment: minimum 21 years for robbery, death penalty if armed with weapons or if victim is injured.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-33',
        relevanceOrder: 3,
        relevanceNote:
          'Section 33 protects your right to life. Armed robbery that endangers your life is one of the most serious offences.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-34',
        relevanceOrder: 4,
        relevanceNote:
          'Section 34 protects you from inhuman treatment. The trauma of robbery violates your fundamental dignity.',
      },
    ],
  },
  {
    scenario: {
      slug: 'someone-defamed-me-online',
      title: 'Someone posted false and damaging things about me online',
      description:
        'Understanding defamation laws when someone spreads lies about you on social media or online.',
      iconEmoji: '📱',
      keywords: [
        'defamation',
        'libel',
        'slander',
        'social media',
        'online',
        'false',
        'reputation',
        'lies',
        'facebook',
        'twitter',
      ],
      category: LawCategory.criminal,
      isFeatured: true,
    },
    mappings: [
      {
        lawSlug: 'criminal-code-act',
        sectionSlug: 'section-373',
        relevanceOrder: 1,
        relevanceNote:
          'Section 373 defines defamation - any statement that damages your reputation by exposing you to hatred, contempt, ridicule, or harming your profession.',
      },
      {
        lawSlug: 'criminal-code-act',
        sectionSlug: 'section-375',
        relevanceOrder: 2,
        relevanceNote:
          'Section 375 criminalizes publishing defamatory content. Online posts count as publications. Punishable by up to 2 years imprisonment.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-34',
        relevanceOrder: 3,
        relevanceNote:
          'Section 34 protects your dignity. False statements that damage your reputation violate your right to dignity.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-39',
        relevanceOrder: 4,
        relevanceNote:
          'Section 39 grants freedom of expression, but this right does not protect defamatory statements. Defamation is not protected speech.',
      },
    ],
  },
  {
    scenario: {
      slug: 'someone-broke-into-my-house',
      title: 'Someone broke into my home or property',
      description:
        'What to do when intruders enter your property through force or without permission.',
      iconEmoji: '🚪',
      keywords: [
        'burglary',
        'break-in',
        'intruder',
        'home invasion',
        'trespass',
        'forced entry',
        'property',
      ],
      category: LawCategory.criminal,
      isFeatured: false,
    },
    mappings: [
      {
        lawSlug: 'criminal-code-act',
        sectionSlug: 'section-343',
        relevanceOrder: 1,
        relevanceNote:
          'Section 343 covers breaking into buildings - entering by breaking doors, windows, or walls with intent to commit an offence. Punishable by 7 years.',
      },
      {
        lawSlug: 'criminal-code-act',
        sectionSlug: 'section-342',
        relevanceOrder: 2,
        relevanceNote:
          'Section 342 covers criminal trespass - entering property with intent to commit offence or intimidate. Punishable by 3 years.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-37',
        relevanceOrder: 3,
        relevanceNote:
          'Section 37 guarantees the privacy of your home. Breaking into your property violates this constitutional right.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-43',
        relevanceOrder: 4,
        relevanceNote:
          'Section 43 protects your right to own property. Home invasion is an attack on this fundamental right.',
      },
    ],
  },
  {
    scenario: {
      slug: 'threatened-or-blackmailed',
      title: 'Someone is threatening or blackmailing me',
      description:
        'What to do when someone threatens to harm you, expose secrets, or demands money through threats.',
      iconEmoji: '😰',
      keywords: [
        'threat',
        'blackmail',
        'extortion',
        'intimidation',
        'demand',
        'money',
        'expose',
        'secret',
      ],
      category: LawCategory.criminal,
      isFeatured: true,
    },
    mappings: [
      {
        lawSlug: 'criminal-code-act',
        sectionSlug: 'section-406',
        relevanceOrder: 1,
        relevanceNote:
          'Section 406 criminalizes extortion by threats - demanding money or benefit by threatening to accuse someone of a crime. Punishable by 14 years.',
      },
      {
        lawSlug: 'criminal-code-act',
        sectionSlug: 'section-351',
        relevanceOrder: 2,
        relevanceNote:
          'Section 351 covers assault, which includes threatening behavior that puts you in fear of violence.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-34',
        relevanceOrder: 3,
        relevanceNote:
          'Section 34 protects your dignity. Being subjected to threats and intimidation violates your fundamental right to dignity.',
      },
      {
        lawSlug: 'constitution-1999',
        sectionSlug: 'section-35',
        relevanceOrder: 4,
        relevanceNote:
          'Section 35 protects personal liberty. Coercion through threats restricts your ability to act freely.',
      },
    ],
  },
];
