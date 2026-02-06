/**
 * Trade Marks Act (Cap T13 LFN 2004)
 *
 * This file contains the law metadata and selected sections for the Trademarks Act.
 * Sections are selected based on relevance to brand protection and business identity.
 *
 * Source: https://placng.org/lawsofnigeria/laws/TRADE%20MARKS%20ACT.pdf
 *
 * Note: This Act governs registration and protection of trademarks in Nigeria.
 * Registration provides strong legal protection for your brand name, logo, and marks.
 */

import { LawCategory } from '@prisma/client';
import type { LawWithSections } from '../types';

export const trademarksAct: LawWithSections = {
  law: {
    slug: 'trademarks-act',
    title: 'Trade Marks Act (Cap T13 LFN 2004)',
    shortTitle: 'Trademarks Act',
    description:
      'Governs the registration, protection, and enforcement of trademarks in Nigeria. Protects brand names, logos, and distinguishing marks used in commerce.',
    category: LawCategory.intellectual_property,
    effectiveDate: new Date('1965-01-01'),
    sourceUrl: 'https://placng.org/lawsofnigeria/laws/TRADE%20MARKS%20ACT.pdf',
    isActive: true,
  },
  sections: [
    // =====================================================
    // PART I - REGISTRATION AND REGISTRABILITY
    // =====================================================
    {
      slug: 'section-5',
      number: '5',
      title: 'Registrable Trade Marks',
      content:
        '(1) A trademark shall not be registered in Part A of the register unless it contains or consists of at least one of the following essential particulars: (a) the name of a company, individual, or firm, represented in a special or particular manner; (b) the signature of the applicant or some predecessor in his business; (c) an invented word or words; (d) a word or words having no direct reference to the character or quality of the goods; (e) any other distinctive mark. (2) A name, signature, word, or mark not registrable in Part A may be registered in Part B.',
      summary:
        'To register a trademark, it must be distinctive: a unique company name, signature, invented word, or mark. Generic or descriptive words are harder to register. Part A is for stronger marks, Part B for less distinctive ones.',
      orderIndex: 5,
    },
    {
      slug: 'section-6',
      number: '6',
      title: 'Prohibition on Registration of Certain Marks',
      content:
        '(1) A trademark shall not be registered: (a) if its use would be likely to deceive or cause confusion to the public; (b) if it is contrary to law or morality; (c) if it contains any scandalous design; (d) if it contains any matter likely to hurt the religious susceptibilities of any class of citizens of Nigeria. (2) A trademark shall not be registered if it is identical with or nearly resembles a mark already on the register for the same goods or description of goods.',
      summary:
        'You cannot register marks that are deceptive, immoral, offensive, or too similar to existing registered marks for the same goods. The Registrar will refuse such applications.',
      orderIndex: 6,
    },
    {
      slug: 'section-7',
      number: '7',
      title: 'Exclusive Right to Use',
      content:
        '(1) Subject to the provisions of this section, the registration of a person as proprietor of a trademark in Part A of the register shall, if valid, give to that person the exclusive right to the use of the trademark in relation to the goods in respect of which it is registered. (2) Registration in Part B shall not give any right to prevent third persons from using the mark unless the use would be likely to deceive or cause confusion.',
      summary:
        'Part A registration gives you exclusive rights to use your trademark for your goods. Part B registration only protects against uses that would cause confusion. Part A provides stronger protection.',
      orderIndex: 7,
    },
    {
      slug: 'section-9',
      number: '9',
      title: 'Application for Registration',
      content:
        '(1) Any person claiming to be the proprietor of a trademark used or proposed to be used by him and who is desirous of registering it shall apply in writing to the Registrar in the prescribed manner for registration. (2) The application shall be accompanied by the prescribed fee. (3) The application shall contain a representation of the trademark and shall state the goods or class of goods in respect of which registration is sought.',
      summary:
        'Apply to the Trademarks Registry in writing with: a representation of your mark (logo/name), the goods/services it covers, and the prescribed fee. You must be the owner or intend to use the mark.',
      orderIndex: 9,
    },
    {
      slug: 'section-10',
      number: '10',
      title: 'Search and Examination',
      content:
        '(1) On receipt of an application for registration of a trademark, the Registrar shall cause a search to be made amongst the existing entries in the register for the purpose of ascertaining whether there are on record any marks which are identical with or nearly resembling the trademark. (2) The Registrar may also cause a search to be made in any record maintained by him of pending applications. (3) The Registrar shall consider the application having regard to the matters set out in sections 5 and 6.',
      summary:
        'The Registrar searches existing trademarks to check for conflicts before accepting your application. Similar or identical marks for similar goods will cause problems.',
      orderIndex: 10,
    },
    {
      slug: 'section-11',
      number: '11',
      title: 'Acceptance and Publication',
      content:
        '(1) When an application has been accepted, the Registrar shall cause the application as accepted to be published in the prescribed manner. (2) Any person may, within the prescribed time after the date of the publication, give notice to the Registrar of opposition to the registration. (3) The Registrar shall send a copy of the notice to the applicant.',
      summary:
        'Accepted applications are published so others can oppose. If no one opposes within the deadline, or opposition fails, your mark proceeds to registration.',
      orderIndex: 11,
    },

    // =====================================================
    // PART II - OPPOSITION AND APPEALS
    // =====================================================
    {
      slug: 'section-13',
      number: '13',
      title: 'Opposition to Registration',
      content:
        '(1) Any person may, within two months from the date of any publication of an application, give notice to the Registrar of opposition to the registration. (2) The notice shall be given in writing in the prescribed manner, and shall include a statement of the grounds of opposition. (3) The Registrar shall send a copy of the notice to the applicant, and within the prescribed time the applicant shall send to the Registrar a counter-statement.',
      summary:
        'Anyone can oppose your trademark application within 2 months of publication. They must state grounds. You can file a counter-statement. The Registrar decides the opposition.',
      orderIndex: 13,
    },
    {
      slug: 'section-17',
      number: '17',
      title: 'Registration',
      content:
        '(1) When an application for registration of a trademark has been accepted and either the application has not been opposed and the time for opposition has expired, or the application has been opposed and the opposition has been decided in favour of the applicant, the Registrar shall, unless the application has been accepted in error, register the trademark. (2) A trademark when registered shall be registered as of the date of the application for registration.',
      summary:
        'If no one opposes or opposition fails, your trademark is registered effective from your application date. This backdates your protection to when you first applied.',
      orderIndex: 17,
    },
    {
      slug: 'section-23',
      number: '23',
      title: 'Duration and Renewal',
      content:
        '(1) The registration of a trademark shall be for a period of seven years, but may be renewed from time to time in accordance with the provisions of this section. (2) The Registrar shall, on application made by the registered proprietor in the prescribed manner and within the prescribed period, renew the registration of a trademark for a period of fourteen years from the date of expiration of the original registration or of the last renewal.',
      summary:
        'Initial registration lasts 7 years. You can renew for 14-year periods indefinitely. Apply before expiration to maintain protection. Renewal requires payment of prescribed fees.',
      orderIndex: 23,
    },

    // =====================================================
    // PART III - INFRINGEMENT AND REMEDIES
    // =====================================================
    {
      slug: 'section-5-2',
      number: '5(2)',
      title: 'Infringement of Registered Trademark',
      content:
        'The right to the exclusive use of a trademark given by registration as aforesaid shall be deemed to be infringed by any person who, not being the proprietor of the trademark or a registered user thereof using by way of the permitted use, uses a mark identical with it or so nearly resembling it as to be likely to deceive or cause confusion, in the course of trade, in relation to any goods in respect of which it is registered.',
      summary:
        "Using someone else's registered trademark or a confusingly similar mark on the same or similar goods is infringement. The mark owner can sue to stop you and claim damages.",
      orderIndex: 52,
    },
    {
      slug: 'section-43',
      number: '43',
      title: 'Action for Infringement',
      content:
        '(1) The proprietor of a registered trademark may bring an action for infringement. (2) In an action for infringement, all such relief by way of damages, injunctions, accounts, or otherwise shall be available to the plaintiff as is available in respect of the infringement of any other proprietary right. (3) The validity of the original registration may be questioned by the defendant.',
      summary:
        'Trademark owners can sue for: damages (compensation), injunctions (stop the infringer), account of profits (take their earnings). Defendants can challenge whether the registration was valid.',
      orderIndex: 43,
    },
    {
      slug: 'section-48',
      number: '48',
      title: 'Falsification of Register',
      content:
        '(1) Any person who makes or causes to be made a false entry in the register, or a writing falsely purporting to be a copy of an entry in the register, or produces or tenders any such writing knowing the entry or writing to be false, commits an offence and is liable on conviction to imprisonment for a term not exceeding two years.',
      summary:
        'Falsifying trademark records or producing fake trademark certificates is a criminal offence punishable by up to 2 years imprisonment.',
      orderIndex: 48,
    },
    {
      slug: 'section-49',
      number: '49',
      title: 'Falsely Representing Trademark as Registered',
      content:
        '(1) Any person who represents that a trademark is registered when it is not shall be guilty of an offence and liable on conviction to a fine. (2) For the purposes of this section, the use in Nigeria in relation to a trademark of the word "registered" or any other word or symbol referring to registration shall be deemed to be a representation that the trademark is registered under this Act.',
      summary:
        'Falsely claiming your mark is registered (using ® symbol when not registered) is a criminal offence. Only use the ® symbol if actually registered.',
      orderIndex: 49,
    },
  ],
};
