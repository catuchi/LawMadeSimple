/**
 * Patents and Designs Act (Cap P2 LFN 2004)
 *
 * This file contains the law metadata and selected sections for the Patents and Designs Act.
 * Sections are selected based on relevance to inventors and product designers in Nigeria.
 *
 * Source: http://lawsofnigeria.placng.org/laws/P2.pdf
 *
 * Note: This Act governs the registration and protection of patents (inventions) and
 * industrial designs in Nigeria. It provides legal framework for protecting innovations.
 */

import { LawCategory } from '@prisma/client';
import type { LawWithSections } from '../types';

export const patentsAct: LawWithSections = {
  law: {
    slug: 'patents-designs-act',
    title: 'Patents and Designs Act (Cap P2 LFN 2004)',
    shortTitle: 'Patents & Designs Act',
    description:
      'Governs the registration and protection of patents (inventions) and industrial designs in Nigeria. Provides exclusive rights to inventors and designers for their innovations.',
    category: LawCategory.intellectual_property,
    effectiveDate: new Date('1970-12-01'),
    sourceUrl: 'http://lawsofnigeria.placng.org/laws/P2.pdf',
    isActive: true,
  },
  sections: [
    // =====================================================
    // PART I - PATENTS
    // =====================================================
    {
      slug: 'section-1',
      number: '1',
      title: 'Patentable Inventions',
      content:
        '(1) Subject to this section, an invention is patentable: (a) if it is new, results from inventive activity and is capable of industrial application; or (b) if it constitutes an improvement upon a patented invention and also is new, results from inventive activity and is capable of industrial application. (2) For the purposes of subsection (1) of this section: (a) an invention is new if it does not form part of the state of the art; (b) an invention results from inventive activity if it does not obviously follow from the state of the art, either as to the method, the application, the combination of methods, or the product which it concerns, or as to the industrial result it produces; (c) an invention is capable of industrial application if it can be manufactured or used in any kind of industry, including agriculture.',
      summary:
        'An invention can be patented if it is: (1) new - not already known publicly, (2) inventive - not obvious to experts, and (3) industrially applicable - can be manufactured or used in industry. Improvements to existing patents can also be patented.',
      orderIndex: 1,
    },
    {
      slug: 'section-2',
      number: '2',
      title: 'Right to Patent',
      content:
        '(1) The right to a patent in respect of an invention is vested in the statutory inventor, that is to say, the person who, whether or not he is the true inventor, is the first to file, or validly to claim a foreign priority for, a patent application in respect of the invention. (2) Where two or more persons have jointly made an invention, the right to a patent is vested in them jointly. (3) Where two or more persons have made the same invention independently of each other, the one among them who first files or claims foreign priority is entitled to the patent.',
      summary:
        'The first person to file a patent application gets the patent, even if someone else invented it earlier but did not file. Joint inventors share the patent right. This is a "first-to-file" system.',
      orderIndex: 2,
    },
    {
      slug: 'section-3',
      number: '3',
      title: 'Application for Patent',
      content:
        "(1) An application for a patent shall be made to the Registrar and shall contain: (a) a request for a patent; (b) a specification including a description of the invention, a claim or claims, and where appropriate, relevant drawings; (c) such other matter as may be prescribed. (2) Where the applicant is not the inventor, the request shall be accompanied by a statement justifying the applicant's right to the patent. (3) The applicant may, at any time before the patent is granted, amend the application, provided that the amendment does not extend beyond the disclosure in the initial application.",
      summary:
        'To apply for a patent, submit: a request for patent, a specification describing your invention with claims and drawings, and other prescribed documents. If you are not the inventor, explain your right to apply.',
      orderIndex: 3,
    },
    {
      slug: 'section-4',
      number: '4',
      title: 'Examination and Grant of Patent',
      content:
        '(1) The Registrar shall examine every application as to its conformity with section 3(1) of this Act and, unless he requires it to be amended, shall accept it accordingly. (2) Subject to subsection (3) of this section, upon acceptance of an application, the Registrar shall grant the patent. (3) The Registrar may make or require to be made such investigation as he considers necessary to verify that the conditions referred to in section 1(1) of this Act are fulfilled.',
      summary:
        'The Registrar examines applications for compliance with requirements. Patents are granted upon acceptance. The Registrar can investigate whether the invention is truly new and inventive before granting.',
      orderIndex: 4,
    },
    {
      slug: 'section-7',
      number: '7',
      title: 'Duration of Patent',
      content:
        '(1) A patent shall expire at the end of the twentieth year from the date of the filing of the relevant patent application. (2) Annual fees, the amounts of which shall be fixed by the Minister, shall be payable in advance to the Registrar in respect of each year of the duration of the patent.',
      summary:
        'Patents last for 20 years from the filing date. You must pay annual renewal fees in advance each year to maintain the patent. If you stop paying, the patent lapses.',
      orderIndex: 7,
    },
    {
      slug: 'section-9',
      number: '9',
      title: 'Rights Conferred by Patent',
      content:
        '(1) Subject to this Act, a patent shall confer upon the patentee the right to preclude any other person from doing any of the following acts: (a) where the patent has been granted in respect of a product, the act of making, importing, selling or using the product, or stocking it for the purpose of selling or using it; (b) where the patent has been granted in respect of a process, the act of applying the process or doing, in respect of a product obtained directly by means of the process, any of the acts mentioned in paragraph (a) of this subsection.',
      summary:
        'A patent gives you the exclusive right to make, import, sell, use, or stock your invention. For process patents, others cannot use your process or sell products made using it.',
      orderIndex: 9,
    },
    {
      slug: 'section-6',
      number: '6',
      title: 'Employee Inventions',
      content:
        '(1) If an employee whose employment contract does not require him to exercise inventive activity makes, in the field of activity of his employer, an invention using data or means that his employment has put at his disposal, the right to the patent shall belong to the employer, subject to the payment to the employee of just remuneration taking into account the importance of the invention. (2) The right to the patent for any other invention made by an employee shall belong to the employee.',
      summary:
        "If you invent something at work using your employer's resources, the employer owns the patent but must pay you fair compensation. Inventions made outside work belong to you.",
      orderIndex: 6,
    },

    // =====================================================
    // PART II - INDUSTRIAL DESIGNS
    // =====================================================
    {
      slug: 'section-12',
      number: '12',
      title: 'Registrable Industrial Designs',
      content:
        '(1) Subject to this section, an industrial design is registrable if: (a) it is new; and (b) it is not contrary to public order or morality. (2) An industrial design shall be considered new if it has not been disclosed to the public, anywhere in the world, by publication in tangible form, or in Nigeria by use or in any other way, prior to the filing date or, where applicable, the priority date, of the application for registration.',
      summary:
        'Industrial designs (the visual appearance of products) can be registered if new and not immoral. "New" means not publicly disclosed anywhere in the world before you apply.',
      orderIndex: 12,
    },
    {
      slug: 'section-13',
      number: '13',
      title: 'Right to Design Registration',
      content:
        '(1) The right to registration of an industrial design shall be vested in the statutory creator, that is to say, the person who, whether or not he is the true creator, is the first to file, or validly to claim a foreign priority for, an application for registration. (2) The provisions of section 2(2) and (3) of this Act shall apply, mutatis mutandis, in respect of industrial designs.',
      summary:
        'Like patents, the first person to file a design application gets the registration. Joint creators share the right. This is also a "first-to-file" system.',
      orderIndex: 13,
    },
    {
      slug: 'section-14',
      number: '14',
      title: 'Application for Design Registration',
      content:
        '(1) An application for registration of an industrial design shall be made to the Registrar and shall contain: (a) a request for registration; (b) where appropriate, drawings or photographs of the design; (c) an indication of the kind of products for which the industrial design is to be used; (d) such other matter as may be prescribed.',
      summary:
        'To register a design, submit: a request for registration, drawings or photographs showing your design, what products the design is for, and other prescribed documents.',
      orderIndex: 14,
    },
    {
      slug: 'section-16',
      number: '16',
      title: 'Duration of Design Registration',
      content:
        '(1) The registration of an industrial design shall be in force initially for five years from the filing date of the application for registration. (2) The registration may be renewed for two further consecutive periods of five years each. (3) The amount of the renewal fees shall be as fixed by the Minister.',
      summary:
        'Design registration lasts 5 years initially and can be renewed twice for 5 years each (total 15 years maximum). Renewal fees apply.',
      orderIndex: 16,
    },
    {
      slug: 'section-17',
      number: '17',
      title: 'Rights Conferred by Design Registration',
      content:
        '(1) Subject to this Act, registration of an industrial design shall confer upon the registered owner the right to preclude any other person from doing any of the following acts: (a) reproducing the industrial design in the manufacture of a product; (b) importing, selling or utilizing for commercial purposes a product reproducing the industrial design; (c) holding such a product for the purpose of selling it or of utilizing it for commercial purposes.',
      summary:
        'Design registration gives you the exclusive right to manufacture products with your design, and to import, sell, or commercially use such products. Others cannot copy your design.',
      orderIndex: 17,
    },
  ],
};
