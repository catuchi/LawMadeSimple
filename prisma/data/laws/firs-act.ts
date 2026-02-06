/**
 * Federal Inland Revenue Service (Establishment) Act 2007
 *
 * This file contains the law metadata and selected sections for the FIRS Act.
 * Sections are selected based on relevance to businesses and taxpayers in Nigeria.
 *
 * Source: https://www.placng.org/lawsofnigeria/laws/F36.pdf
 *
 * Note: This Act establishes FIRS as the agency responsible for assessing, collecting,
 * and accounting for federal taxes in Nigeria. It covers tax administration, penalties,
 * and taxpayer rights.
 */

import { LawCategory } from '@prisma/client';
import type { LawWithSections } from '../types';

export const firsAct: LawWithSections = {
  law: {
    slug: 'firs-act',
    title: 'Federal Inland Revenue Service (Establishment) Act 2007',
    shortTitle: 'FIRS Act',
    description:
      'Establishes the Federal Inland Revenue Service and governs tax assessment, collection, enforcement, and taxpayer rights in Nigeria.',
    category: LawCategory.tax,
    effectiveDate: new Date('2007-04-18'),
    sourceUrl: 'https://www.placng.org/lawsofnigeria/laws/F36.pdf',
    isActive: true,
  },
  sections: [
    // =====================================================
    // PART I - ESTABLISHMENT AND FUNCTIONS
    // =====================================================
    {
      slug: 'section-1',
      number: '1',
      title: 'Establishment of the Service',
      content:
        '(1) There is hereby established the Federal Inland Revenue Service (in this Act referred to as "the Service"). (2) The Service shall be a body corporate with perpetual succession and a common seal and may sue and be sued in its corporate name.',
      summary:
        'FIRS is established as an independent body corporate. It can sue and be sued in its own name and operates continuously as a legal entity.',
      orderIndex: 1,
    },
    {
      slug: 'section-2',
      number: '2',
      title: 'Functions of the Service',
      content:
        '(1) Subject to this Act, the Service shall be responsible for: (a) control and administration of the different taxes specified in the First Schedule to this Act or other laws made or to be made from time to time by the National Assembly or other regulations made thereunder; (b) accounting for all taxes collected; (c) making recommendations, where appropriate, on tax policy and tax reform to the Federal Government; (d) general control and supervision over the assessment and collection of revenue accruable to the government of the Federation; (e) provision of general advisory services to the Federal Government on all taxation matters.',
      summary:
        'FIRS administers federal taxes including company income tax, VAT, petroleum profits tax, and others. It collects, accounts for, and advises the government on taxation.',
      orderIndex: 2,
    },
    {
      slug: 'section-8',
      number: '8',
      title: 'Powers of the Service',
      content:
        '(1) The Service shall have power to: (a) employ and determine the terms and conditions of service including disciplinary measures of the employees of the Service; (b) issue guidelines on: (i) registration of taxpayers, (ii) filing of returns, (iii) self-assessment of tax, (iv) tax payment procedures; (c) adopt measures to identify, trace and bring into the tax net persons who are liable to tax under any tax law but have not been paying tax; (d) collect tax at source as may be allowed by law; (e) adopt any anti-avoidance measure to counteract any transaction that is artificial or fictitious.',
      summary:
        'FIRS can make rules on registration, filing, self-assessment, and payment. It can track down non-compliant taxpayers and collect tax at source. It can counteract artificial arrangements designed to avoid tax.',
      orderIndex: 8,
    },

    // =====================================================
    // PART II - TAX ASSESSMENT AND COLLECTION
    // =====================================================
    {
      slug: 'section-25',
      number: '25',
      title: 'Assessment of Tax',
      content:
        '(1) Where any person fails to furnish returns required to be furnished by him under any tax law, or the relevant tax authority is not satisfied with the return made by any person, the relevant tax authority shall assess the person to the best of its judgment and charge interest and penalties where appropriate. (2) Any assessment made under subsection (1) of this section shall be served on the person assessed personally or by post to his last known address.',
      summary:
        'If you do not file returns or FIRS is not satisfied with your return, they can assess your tax based on their best judgment. Assessments include interest and penalties and must be served to you.',
      orderIndex: 25,
    },
    {
      slug: 'section-26',
      number: '26',
      title: 'Self-Assessment',
      content:
        '(1) Every taxpayer may self-assess by completing the appropriate tax form, indicating the tax due, and attaching to it the relevant information and returns required by the Service. (2) The taxpayer shall forward the returns to the Service together with evidence of payment of the whole or, as the case may require, part of the tax due. (3) Subject to the provisions of this Act, the return shall be accepted as delivered and shall form the basis of any tax due.',
      summary:
        'You can self-assess your tax by completing the proper form, calculating the tax due, and submitting with proof of payment. Self-assessments are generally accepted as filed.',
      orderIndex: 26,
    },
    {
      slug: 'section-27',
      number: '27',
      title: 'Review of Assessment',
      content:
        '(1) Any taxpayer aggrieved by an assessment made upon him may apply to the relevant tax authority for a review of the assessment within 30 days from the date of service of the notice of assessment. (2) The application for review shall state precisely the grounds on which the review is demanded. (3) After considering the application and any representations made by the taxpayer, the tax authority may confirm, amend, or cancel the assessment.',
      summary:
        'You have 30 days from receiving an assessment to request a review. State your grounds clearly. FIRS can confirm, amend, or cancel the assessment after considering your arguments.',
      orderIndex: 27,
    },
    {
      slug: 'section-28',
      number: '28',
      title: 'Appeal to Tax Appeal Tribunal',
      content:
        '(1) Any taxpayer aggrieved by the decision of the relevant tax authority under section 27 of this Act may appeal to the Tax Appeal Tribunal. (2) The appeal shall be filed within 30 days of the notification of the decision. (3) The Tax Appeal Tribunal shall hear the appeal and give its decision thereon.',
      summary:
        "If dissatisfied with FIRS's review decision, you can appeal to the Tax Appeal Tribunal within 30 days. The Tribunal is an independent body that hears tax disputes.",
      orderIndex: 28,
    },

    // =====================================================
    // PART III - TAX COLLECTION AND RECOVERY
    // =====================================================
    {
      slug: 'section-31',
      number: '31',
      title: 'Collection of Tax',
      content:
        '(1) Tax assessed in accordance with any tax law shall be payable by the person assessed within the time specified in the notice of assessment. (2) Where the tax is not paid within the time specified, the tax shall become a debt due to the Federal Government and recoverable by the Service through court action or any other means provided by law.',
      summary:
        'You must pay assessed tax within the time stated in the notice. Unpaid tax becomes a debt to the government and FIRS can recover it through courts or other legal means.',
      orderIndex: 31,
    },
    {
      slug: 'section-32',
      number: '32',
      title: 'Distress for Recovery of Tax',
      content:
        '(1) Where any person fails to pay tax due under any tax law within the time specified, the Service may by warrant authorize any person named therein to distrain upon the property of the taxpayer and may recover the amount due from the sale of any property distrained. (2) The warrant shall be in the form prescribed in the Schedule to this Act.',
      summary:
        'If you do not pay, FIRS can seize and sell your property to recover the tax owed. This requires a warrant and follows prescribed procedures.',
      orderIndex: 32,
    },
    {
      slug: 'section-35',
      number: '35',
      title: 'Interest on Unpaid Tax',
      content:
        '(1) Where a taxpayer fails to pay any tax due within the time specified, interest at the rate prescribed shall accrue on the tax from the due date until the date of payment. (2) The interest rate shall be as prescribed by the Minister from time to time.',
      summary:
        'Interest accrues on unpaid tax from the due date until you pay. The interest rate is set by the Minister. Paying late costs you more.',
      orderIndex: 35,
    },

    // =====================================================
    // PART IV - OFFENCES AND PENALTIES
    // =====================================================
    {
      slug: 'section-40',
      number: '40',
      title: 'Penalty for Non-Payment of Tax',
      content:
        '(1) Where any person fails to pay any tax within the time specified in a notice of assessment, he shall be guilty of an offence and liable on conviction to a penalty equal to 10% of the amount of the tax, in addition to the tax itself. (2) The penalty shall be recoverable in like manner as the tax.',
      summary:
        'Failing to pay tax on time is an offence. The penalty is 10% of the unpaid tax amount, added to what you already owe. The penalty is collected the same way as the tax.',
      orderIndex: 40,
    },
    {
      slug: 'section-41',
      number: '41',
      title: 'Penalty for Failure to Keep Records',
      content:
        '(1) Any person who fails to keep proper records and books of account as required by any tax law shall be guilty of an offence and liable on conviction to a fine of N50,000 in the first instance and N10,000 for every day during which the offence continues. (2) The records required to be kept shall be retained for a period of not less than six years.',
      summary:
        'You must keep proper financial records for at least 6 years. Failure to do so is punishable by ₦50,000 fine plus ₦10,000 per day the violation continues.',
      orderIndex: 41,
    },
    {
      slug: 'section-43',
      number: '43',
      title: 'Penalty for Making False Returns',
      content:
        '(1) Any person who makes any false statement or return in connection with any claim for refund of tax, or who delivers or causes to be delivered to the Service any false document, statement, or declaration in support of such claim, or who is party to any such fraud, shall be guilty of an offence and liable on conviction to imprisonment for a term not exceeding 3 years or to a fine of N500,000 or to both.',
      summary:
        'Making false tax returns or submitting fraudulent documents is a serious criminal offence. Punishment is up to 3 years imprisonment or ₦500,000 fine or both.',
      orderIndex: 43,
    },
    {
      slug: 'section-46',
      number: '46',
      title: 'Tax Evasion',
      content:
        '(1) Any person who with intent to evade or assist any other person to evade any tax: (a) makes any false return, statement or declaration; (b) makes or causes to be made any false entry in any books or records; (c) fails to make any entry in any books or records; (d) provides any false information; (e) procures, assists or advises any other person to do any act referred to in paragraphs (a) to (d) of this subsection; shall be guilty of an offence and liable on conviction to imprisonment for a term not exceeding 5 years or to a fine of N1,000,000 or to both.',
      summary:
        'Tax evasion is punishable by up to 5 years imprisonment or ₦1,000,000 fine or both. This includes false returns, false entries, omitting records, giving false information, or helping others evade tax.',
      orderIndex: 46,
    },

    // =====================================================
    // PART V - TAXPAYER RIGHTS AND OBLIGATIONS
    // =====================================================
    {
      slug: 'section-50',
      number: '50',
      title: 'Taxpayer Identification Number',
      content:
        '(1) Every taxable person shall register with the Service and obtain a Taxpayer Identification Number (TIN). (2) The TIN shall be used in all correspondence and transactions with the Service and for all tax matters. (3) No person shall open a bank account in Nigeria without a TIN. (4) Any person who fails to register shall be guilty of an offence.',
      summary:
        'Everyone liable to tax must register for a TIN. You need it for tax filings, correspondence with FIRS, and opening bank accounts. Failure to register is an offence.',
      orderIndex: 50,
    },
    {
      slug: 'section-51',
      number: '51',
      title: 'Tax Clearance Certificate',
      content:
        '(1) The Service shall, upon application by a person who has paid all outstanding taxes due from him, issue to such person a Tax Clearance Certificate. (2) A Tax Clearance Certificate shall be required for: (a) award of contracts by the Federal Government or any of its agencies; (b) approval for registration as a government contractor; (c) application for import or export license; (d) approval of building plans; (e) registration of a motor vehicle; and such other purposes as may be prescribed.',
      summary:
        'A Tax Clearance Certificate (TCC) proves you have no outstanding taxes. You need it for government contracts, import/export licenses, vehicle registration, and building approvals.',
      orderIndex: 51,
    },
  ],
};
