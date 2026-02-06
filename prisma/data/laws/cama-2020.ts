/**
 * Companies and Allied Matters Act 2020 (CAMA 2020)
 *
 * This file contains the law metadata and selected sections for CAMA 2020.
 * Sections are selected based on relevance to SME owners and entrepreneurs.
 *
 * Source: https://www.icnl.org/resources/library/companies-and-allied-matters-act-2020
 *
 * Note: CAMA 2020 is a comprehensive law with 870+ sections. This file contains
 * key sections relevant to everyday business registration and operations.
 */

import { LawCategory } from '@prisma/client';
import type { LawWithSections } from '../types';

export const cama2020: LawWithSections = {
  law: {
    slug: 'cama-2020',
    title: 'Companies and Allied Matters Act 2020',
    shortTitle: 'CAMA 2020',
    description:
      'Governs the registration and regulation of companies, business names, incorporated trustees (NGOs), and limited partnerships in Nigeria. Provides the legal framework for starting and running businesses.',
    category: LawCategory.business,
    effectiveDate: new Date('2020-08-07'),
    sourceUrl: 'https://www.icnl.org/resources/library/companies-and-allied-matters-act-2020',
    isActive: true,
  },
  sections: [
    // =====================================================
    // PART A - COMPANY FORMATION AND REGISTRATION
    // =====================================================
    {
      slug: 'section-18',
      number: '18',
      title: 'Formation of Company',
      content:
        '(1) Any two or more persons may form and incorporate a company by complying with the requirements of this Act in respect of registration. (2) One person may form and incorporate a company limited by shares for any lawful purpose by complying with the requirements of this Act in respect of registration. (3) A company formed under subsection (2) shall add to its name, immediately before the word "Limited" or "Ltd", the word "Sole Proprietorship" and shall be designated as a private company.',
      summary:
        'You can form a company with two or more people, or as a single person (sole proprietorship). Single-person companies must include "Sole Proprietorship" in their name and are automatically private companies.',
      orderIndex: 18,
    },
    {
      slug: 'section-27',
      number: '27',
      title: 'Registration of Memorandum and Articles',
      content:
        '(1) A company shall not be formed for an unlawful purpose. (2) The memorandum and articles shall be delivered to the Commission for registration. (3) The Commission shall retain and register the memorandum and articles and shall, on the same or next day, issue a certificate of incorporation. (4) The certificate of incorporation shall be conclusive evidence that all the requirements of this Act in respect of registration and of matters precedent and incidental thereto have been complied with.',
      summary:
        'To register a company, submit your memorandum and articles to CAC. You should receive your certificate of incorporation within one day. This certificate is conclusive proof your company is legally registered.',
      orderIndex: 27,
    },
    {
      slug: 'section-28',
      number: '28',
      title: 'Effect of Registration',
      content:
        '(1) On the registration of the memorandum of a company, the Commission shall certify under its seal that the company is incorporated, and in the case of a limited company, that the company is limited. (2) From the date of incorporation, the subscribers of the memorandum, together with any other persons who may become members of the company, shall be a body corporate capable of exercising all the functions of an incorporated company.',
      summary:
        'Once registered, your company becomes a separate legal entity (body corporate). This means it can sue, be sued, own property, and enter contracts in its own name, separate from its owners.',
      orderIndex: 28,
    },
    {
      slug: 'section-40',
      number: '40',
      title: 'Minimum Share Capital',
      content:
        '(1) A private company shall have a minimum issued share capital of N100,000 or such other sum as may be prescribed by the Commission. (2) A public company shall have a minimum issued share capital of N2,000,000 or such other sum as may be prescribed by the Commission. (3) The Commission may, from time to time, review the minimum share capital requirement under this section.',
      summary:
        'Private companies require minimum share capital of ₦100,000. Public companies require minimum share capital of ₦2,000,000. CAC can adjust these amounts from time to time.',
      orderIndex: 40,
    },
    {
      slug: 'section-86',
      number: '86',
      title: 'Small Companies',
      content:
        "(1) A company qualifies as a small company in a year if it satisfies at least two of the following conditions: (a) its turnover is not more than N120,000,000 or such amount as may be fixed by the Commission; (b) its net assets value is not more than N60,000,000 or such amount as may be fixed by the Commission; (c) none of its members is an alien; (d) none of its members is a government or government agency or its nominee; (e) its directors hold at least 51% of its equity share capital. (2) A small company is exempt from engaging an auditor and may prepare financial statements that show only a statement of the company's assets and liabilities.",
      summary:
        'Small companies (turnover under ₦120m, assets under ₦60m, owned by Nigerians) get regulatory relief: no mandatory auditor requirement and simplified financial statements. Directors must own at least 51% of shares.',
      orderIndex: 86,
    },

    // =====================================================
    // PART B - DIRECTORS AND MANAGEMENT
    // =====================================================
    {
      slug: 'section-265',
      number: '265',
      title: 'Number of Directors',
      content:
        '(1) Every company shall have at least two directors, except that a private company may have one director. (2) Every public company shall have at least three directors including one who is an independent director. (3) The Commission may review the number of directors required under this section.',
      summary:
        'Private companies need at least 1 director. Public companies need at least 3 directors, including 1 independent director. These are minimum requirements.',
      orderIndex: 265,
    },
    {
      slug: 'section-269',
      number: '269',
      title: 'Age Limit of Directors',
      content:
        '(1) No person shall be appointed or hold office as a director in a public company if that person is below the age of 18 years or above the age of 70 years. (2) There is no upper age limit for directors in a private company, but no person below the age of 18 shall be appointed a director in a private company.',
      summary:
        'Directors must be at least 18 years old. Public company directors cannot be over 70 years old. Private companies have no upper age limit for directors.',
      orderIndex: 269,
    },
    {
      slug: 'section-282',
      number: '282',
      title: 'Disclosure of Interests by Directors',
      content:
        '(1) A director of a company shall declare any interest, direct or indirect, in a proposed transaction or arrangement with the company before the company enters into the transaction or arrangement. (2) A director who fails to comply with subsection (1) commits an offence and is liable on conviction to a fine as the Court deems fit or imprisonment for a term not exceeding two years or both.',
      summary:
        'Directors must disclose any personal interest in company transactions before they happen. Failure to disclose is a criminal offence punishable by fine or up to 2 years imprisonment.',
      orderIndex: 282,
    },
    {
      slug: 'section-302',
      number: '302',
      title: 'Removal of Director',
      content:
        '(1) A company may by ordinary resolution remove a director before the expiration of his period of office, notwithstanding anything in its articles or in any agreement between it and him. (2) A director proposed to be removed is entitled to be heard at the meeting. (3) A vacancy created by the removal of a director under this section may be filled at the meeting by the appointment of another director.',
      summary:
        'Shareholders can remove a director at any time by ordinary resolution, even if their contract says otherwise. The director being removed has the right to be heard at the meeting.',
      orderIndex: 302,
    },
    {
      slug: 'section-305',
      number: '305',
      title: 'Directors Duties',
      content:
        '(1) A director of a company stands in a fiduciary relationship towards the company, and shall observe the utmost good faith towards the company in any transaction with it or on its behalf. (2) A director shall act at all times in what he believes to be the best interests of the company as a whole so as to preserve its assets, further its business, and promote the purposes for which it was formed. (3) A director shall not fetter his discretion to vote in a particular way.',
      summary:
        "Directors must act honestly and in the company's best interest at all times. They have a fiduciary duty to preserve company assets and further its business. They must exercise independent judgment.",
      orderIndex: 305,
    },
    {
      slug: 'section-343',
      number: '343',
      title: 'Liability for Acts of Directors',
      content:
        '(1) Where a director of a company is convicted of an offence arising out of the management of the company or where a receiver or manager is appointed to the company or the company goes into liquidation and it appears that the director has been guilty of any misfeasance or breach of trust, the Court may, on the application of the Official Receiver, liquidator, or any creditor or member, examine the conduct of the director and compel him to repay any money or restore any property.',
      summary:
        'Directors can be held personally liable for fraud, breach of trust, or mismanagement. Courts can order directors to repay money or restore property if they acted wrongfully.',
      orderIndex: 343,
    },

    // =====================================================
    // PART C - MEETINGS AND RESOLUTIONS
    // =====================================================
    {
      slug: 'section-235',
      number: '235',
      title: 'Annual General Meeting',
      content:
        '(1) Every company shall in each year hold a general meeting as its annual general meeting in addition to any other meetings in that year. (2) Not more than 15 months shall elapse between the date of one annual general meeting of a company and that of the next. (3) A private company may, by its articles, provide that the company shall not be required to hold an annual general meeting.',
      summary:
        'Companies must hold an Annual General Meeting (AGM) each year, no more than 15 months apart. Private companies can opt out of AGMs through their articles of association.',
      orderIndex: 235,
    },
    {
      slug: 'section-237',
      number: '237',
      title: 'Notice of Meetings',
      content:
        "(1) Any provision of a company's articles is void in so far as it provides for the calling of a meeting of the company by shorter notice than 21 days' notice in writing. (2) Notwithstanding that a meeting is called by shorter notice than that specified in subsection (1), it shall be deemed to have been duly called if it is so agreed: (a) in the case of a meeting called as the annual general meeting, by all the members entitled to attend and vote thereat; or (b) in the case of any other meeting, by a majority in number of the members having a right to attend and vote at the meeting.",
      summary:
        'Company meetings require at least 21 days written notice. However, shorter notice is valid if all members agree (for AGMs) or if a majority agrees (for other meetings).',
      orderIndex: 237,
    },
    {
      slug: 'section-258',
      number: '258',
      title: 'Written Resolutions',
      content:
        '(1) A resolution in writing agreed by all the members of a company entitled to vote on that resolution at a general meeting of the company shall be as effective as if passed at a general meeting duly convened and held. (2) The written resolution shall be recorded in the minute book of the company.',
      summary:
        'Members can pass resolutions in writing instead of holding a meeting, if all members entitled to vote agree. This is especially useful for small private companies.',
      orderIndex: 258,
    },

    // =====================================================
    // PART D - SHAREHOLDERS AND DIVIDENDS
    // =====================================================
    {
      slug: 'section-114',
      number: '114',
      title: 'Rights of Members',
      content:
        '(1) Subject to the provisions of this Act and of the conditions contained in the memorandum and articles, the shares or other interests of any member in a company shall be movable property, transferable in the manner provided by the articles of the company. (2) Every shareholder has a right to vote at general meetings and shall have such other rights as may be attached to his shares by this Act or the articles.',
      summary:
        "As a shareholder, you own your shares as personal property and can transfer them. You have the right to vote at meetings and receive dividends according to your shareholding and the company's articles.",
      orderIndex: 114,
    },
    {
      slug: 'section-426',
      number: '426',
      title: 'Dividends',
      content:
        '(1) No dividend shall be paid otherwise than out of profits. (2) Dividends shall be payable to members in proportion to their shares, unless the articles otherwise provide. (3) The company in general meeting may declare dividends, but no dividend shall exceed the amount recommended by the directors.',
      summary:
        'Dividends can only be paid from company profits. Shareholders receive dividends proportional to their shares. The AGM declares dividends but cannot exceed what directors recommend.',
      orderIndex: 426,
    },
    {
      slug: 'section-303',
      number: '303',
      title: 'Minority Shareholder Protection',
      content:
        '(1) Any member of a company who complains that the affairs of the company are being conducted in a manner that is oppressive or unfairly prejudicial to the interests of some part of the members, including himself, may apply to the Court for an order under this section. (2) The Court may, with a view to bringing to an end the matters complained of, make any order it thinks fit.',
      summary:
        'Minority shareholders can apply to court if they believe the company is being run in a way that oppresses or unfairly harms their interests. Courts have wide powers to remedy such situations.',
      orderIndex: 303,
    },

    // =====================================================
    // PART E - BUSINESS NAMES
    // =====================================================
    {
      slug: 'section-822',
      number: '822',
      title: 'Carrying on Business Under Business Name',
      content:
        "(1) No person shall carry on business in Nigeria under a business name that is not registered under this Part. (2) For the purposes of this section, a person carries on business under a business name if they carry on business under a name that is different from their legal name. (3) A natural person's legal name means the name appearing on their birth certificate or change of name document.",
      summary:
        'You must register any business name you use that is different from your personal name. Operating a business under an unregistered name is illegal.',
      orderIndex: 822,
    },
    {
      slug: 'section-824',
      number: '824',
      title: 'Registration of Business Names',
      content:
        '(1) Every person required to be registered under this Part shall furnish to the Commission the following particulars: (a) the business name; (b) the general nature of the business; (c) the principal place of the business; (d) the present name, nationality, usual residence and other business occupation of the individual or, in the case of a firm, of every partner; (e) any former names. (2) The Commission shall register such business name and issue a certificate of registration.',
      summary:
        'To register a business name, provide CAC with: your business name, what the business does, address, your personal details including nationality and residence, and any former names.',
      orderIndex: 824,
    },
    {
      slug: 'section-839',
      number: '839',
      title: 'Penalty for Non-Registration',
      content:
        '(1) A person who carries on business under a business name without being registered commits an offence and is liable on conviction to a fine of N50,000 for each day during which the offence continues. (2) Where any business is carried on under a business name without being registered, no right or claim under any contract made by that person in relation to the business shall be enforceable by action.',
      summary:
        'Operating without registering your business name is punishable by ₦50,000 fine per day. Critically, you cannot enforce contracts made under an unregistered business name in court.',
      orderIndex: 839,
    },

    // =====================================================
    // PART F - INCORPORATED TRUSTEES (NGOs, Churches, etc.)
    // =====================================================
    {
      slug: 'section-823',
      number: '823',
      title: 'Incorporated Trustees',
      content:
        '(1) Where two or more persons are associated in Nigeria as a body for any religious, educational, literary, scientific, social, development, cultural, sporting or charitable purpose, they may, subject to the provisions of this Part, apply to the Commission to have them incorporated as a body corporate. (2) An association shall not be registered unless its objects are such as to qualify for registration as a charity.',
      summary:
        'NGOs, religious organizations, clubs, and charities can register as incorporated trustees. This gives them legal status as a body corporate, allowing them to own property and sue in their own name.',
      orderIndex: 823,
    },
    {
      slug: 'section-842',
      number: '842',
      title: 'Property of Incorporated Trustees',
      content:
        '(1) The property of an incorporated trustee shall not vest in any individual member of the association. (2) Property of the incorporated trustee shall be used solely in furtherance of its objects and shall not be distributed to any member. (3) Where an incorporated trustee is dissolved, any remaining property after payment of debts shall be transferred to another incorporated trustee having similar objects.',
      summary:
        "Property of NGOs and charities belongs to the organization, not individual members. Assets must be used for the organization's stated purposes and cannot be distributed to members, even on dissolution.",
      orderIndex: 842,
    },

    // =====================================================
    // PART G - WINDING UP AND DISSOLUTION
    // =====================================================
    {
      slug: 'section-572',
      number: '572',
      title: 'Voluntary Winding Up',
      content:
        '(1) A company may be wound up voluntarily when the period, if any, fixed for the duration of the company by the articles expires, or the event, if any, occurs, on the occurrence of which the articles provide that the company is to be dissolved, and the company in general meeting has passed a resolution requiring the company to be wound up voluntarily. (2) A company may also be wound up voluntarily if the company resolves by special resolution that the company be wound up voluntarily.',
      summary:
        'A company can voluntarily wind up if its articles say so (time period expires or specified event occurs) or if shareholders pass a special resolution to wind up.',
      orderIndex: 572,
    },
    {
      slug: 'section-622',
      number: '622',
      title: 'Circumstances for Winding Up by Court',
      content:
        '(1) A company may be wound up by the Court if: (a) the company has by special resolution resolved that the company be wound up by the Court; (b) the company does not commence business within a year from its incorporation or suspends its business for a whole year; (c) the number of members is reduced below two, or in the case of a private company, below one; (d) the company is unable to pay its debts; (e) the Court is of opinion that it is just and equitable that the company should be wound up.',
      summary:
        "Courts can order a company wound up if: shareholders request it, the company is inactive for a year, membership falls below minimum, the company is insolvent, or it's just and equitable to do so.",
      orderIndex: 622,
    },
  ],
};
