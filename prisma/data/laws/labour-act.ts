/**
 * Labour Act (Cap L1 LFN 2004)
 *
 * This file contains the law metadata and selected sections for the Labour Act.
 * Sections are selected based on relevance to everyday employment scenarios.
 *
 * Source: https://lawsofnigeria.placng.org/laws/L1.pdf
 *
 * Note: The Labour Act applies primarily to "Workers" (employees who perform
 * manual labour or clerical work), not administrative or professional employees.
 */

import { LawCategory } from '@prisma/client';
import type { LawWithSections } from '../types';

export const labourAct: LawWithSections = {
  law: {
    slug: 'labour-act',
    title: 'Labour Act (Cap L1 LFN 2004)',
    shortTitle: 'Labour Act',
    description:
      'Governs employment relationships in Nigeria, covering contracts of employment, wages, working conditions, termination, and worker protections including maternity rights.',
    category: LawCategory.labour,
    effectiveDate: new Date('1974-08-01'), // Originally enacted 1974, codified 2004
    sourceUrl: 'https://lawsofnigeria.placng.org/laws/L1.pdf',
    isActive: true,
  },
  sections: [
    // =====================================================
    // PART I - GENERAL
    // =====================================================
    {
      slug: 'section-1',
      number: '1',
      title: 'Payment of Wages in Legal Tender',
      content:
        'Wages shall be made payable in legal tender and not otherwise, and any contract whereby wages are made payable in any other manner shall be illegal, null and void. No employer shall impose in any contract for the payment of wages any terms as to the place at which, or the manner in which, or the person to whom, or the time at which, such wages are to be paid, which are illegal, unreasonable, or unreasonably inconvenient to the worker.',
      summary:
        'Requires all wages to be paid in legal tender (official currency). Any contract requiring payment in other forms is void. Employers cannot impose unreasonable conditions on how wages are paid.',
      orderIndex: 1,
    },
    {
      slug: 'section-5',
      number: '5',
      title: 'Permitted Deductions from Wages',
      content:
        'No deductions shall be made from wages unless such deductions are: (a) authorised by any enactment; (b) agreed by the worker in writing and related to provident or pension fund contributions; (c) authorised by the terms of any collective agreement in force between the employer and the trade union; (d) for the recovery of any advance, not exceeding three months wages, made to the worker. No deduction made by an employer shall exceed one-third of the wages due to the worker for the pay period.',
      summary:
        'Limits deductions from wages to specific authorized purposes including pension contributions and union dues. Total deductions cannot exceed one-third of wages. Employers cannot make unauthorized deductions.',
      orderIndex: 5,
    },

    // =====================================================
    // PART II - CONTRACTS OF EMPLOYMENT
    // =====================================================
    {
      slug: 'section-7',
      number: '7',
      title: 'Written Particulars of Terms of Employment',
      content:
        "Not later than three months after the beginning of a worker's period of employment with an employer, the employer shall give to the worker a written statement specifying: (a) the name of the employer or group of employers; (b) the name and address of the worker and the place of engagement; (c) the nature of the employment; (d) the appropriate period of notice to be given by the party wishing to terminate the contract; (e) the rates of wages and method of calculation thereof and the manner and periodicity of payment of wages; (f) any terms and conditions relating to hours of work, holidays, and holiday pay; (g) any terms and conditions relating to incapacity for work due to sickness or injury, including any provisions for sick pay; and (h) any special conditions of the contract.",
      summary:
        'Employers must provide a written employment contract within 3 months of starting work. The contract must include your name, job description, wages, notice period, working hours, holiday entitlements, and sick leave provisions.',
      orderIndex: 7,
    },
    {
      slug: 'section-9',
      number: '9',
      title: 'General Provisions as to Contracts',
      content:
        'Every contract shall be deemed to include the following provisions: (a) no contract shall be deemed to bind any member of the family or dependants of a worker unless express provision to that effect is made therein and is assented to by such member or dependant; (b) no contract shall be made with any person under the age of sixteen years, except as an apprentice; (c) no contract shall provide for the payment of wages at intervals exceeding one month unless the written consent of the State Authority has been previously obtained; (d) no contract shall limit the liability of an employer for the death of, or personal injury to, a worker arising in the course of his employment.',
      summary:
        'Sets basic contract rules: workers must be 16 or older (except apprentices), wages must be paid at least monthly, and employers cannot limit liability for workplace injuries or deaths.',
      orderIndex: 9,
    },
    {
      slug: 'section-10',
      number: '10',
      title: 'Transfer of Contract to Another Employer',
      content:
        'No contract, other than a probationary contract, shall be transferred from one employer to another without the written consent of the worker given in the presence of and endorsed by a labour officer, who shall first explain to the worker the terms of the new contract and who shall first satisfy himself that no undue influence has been brought to bear on the worker to make the transfer.',
      summary:
        'Your employment cannot be transferred to another employer without your written consent. A labour officer must witness the transfer and ensure you understand the new terms and are not being pressured.',
      orderIndex: 10,
    },
    {
      slug: 'section-11',
      number: '11',
      title: 'Termination of Contract by Notice',
      content:
        'Either party to a contract of employment may terminate the contract on the expiration of notice given by him to the other party of his intention to do so. The length of notice shall be: (a) one day, where the contract has continued for a period of three months or less; (b) one week, where the contract has continued for more than three months but less than two years; (c) two weeks, where the contract has continued for two years but less than five years; (d) one month, where the contract has continued for five years or more. Nothing in this section shall prevent either party from waiving his right to notice on any occasion, or accepting payment in lieu of notice.',
      summary:
        'Either party can end employment with proper notice. Notice periods increase with length of service: 1 day (under 3 months), 1 week (3 months to 2 years), 2 weeks (2-5 years), 1 month (over 5 years). Payment in lieu of notice is allowed.',
      orderIndex: 11,
    },
    {
      slug: 'section-12',
      number: '12',
      title: 'Common Employment Not a Defence',
      content:
        'It shall not be a defence for an employer who is sued in respect of a personal injury caused by the negligence of a worker employed by him, that the worker causing such injury was at the time of the injury in common employment with the worker so injured.',
      summary:
        'An employer cannot avoid liability for a workplace injury by claiming it was caused by a fellow employee. The employer remains responsible for injuries caused by any of their workers.',
      orderIndex: 12,
    },

    // =====================================================
    // PART II - WAGES, HOURS, LEAVE
    // =====================================================
    {
      slug: 'section-13',
      number: '13',
      title: 'Hours of Work and Overtime',
      content:
        '(1) Normal hours of work in any undertaking shall be those fixed: (a) by mutual agreement; or (b) by collective bargaining within the organization or industry concerned; or (c) by an industrial wages board. (2) Hours which a worker is required to work in excess of the normal hours fixed under subsection (1) shall constitute overtime. (3) Where a worker is at work for six hours or more a day, his work shall be interrupted by allowing one or more suitably spaced rest-intervals of not less than one hour in the aggregate. (4) Every worker shall be entitled to at least one continuous period of rest of not less than twenty-four consecutive hours in every week.',
      summary:
        'Working hours are set by agreement, collective bargaining, or wages board. Working beyond normal hours is overtime. Workers on 6+ hour shifts must get at least 1 hour total break time. Every worker is entitled to at least 24 consecutive hours of rest per week.',
      orderIndex: 13,
    },
    {
      slug: 'section-16',
      number: '16',
      title: 'Sick Leave',
      content:
        "Subject to the provisions of the Workmen's Compensation Act, a worker shall be entitled to be paid wages up to twelve working days in any one calendar year during absence from work caused by temporary illness certified by a registered medical practitioner: Provided that (a) the employment of the worker by the employer has subsisted for the period of his absence; (b) the worker is ready to work except for such temporary illness. An employer may require a worker absent by reason of temporary illness to be examined at the employer's expense by a registered medical practitioner named by the employer.",
      summary:
        'Workers are entitled to 12 days of paid sick leave per year if certified by a doctor. The employer can require examination by their own doctor at their expense. The worker must still be employed and ready to work but for the illness.',
      orderIndex: 16,
    },
    {
      slug: 'section-17',
      number: '17',
      title: 'Duty of Employer to Provide Work',
      content:
        'Subject to the provisions of any collective agreement in force, the employer shall provide work suitable to his capacity for any worker who has presented himself for work unless such worker has broken his contract of employment or unless a supervening emergency, unpredictable at the time when the contract was made, has rendered the performance of the contract by the employer impracticable: Provided that if the employer fails to provide such work for the worker he shall continue to pay wages to the worker during the period of such failure, except that in the event of any emergency mentioned in this section the employer shall be obliged to pay wages only for the first week of such period.',
      summary:
        'Employers must provide suitable work to workers who show up ready to work. If no work is available, the employer must still pay wages. In emergencies, employers only need to pay for the first week without work.',
      orderIndex: 17,
    },
    {
      slug: 'section-18',
      number: '18',
      title: 'Annual Holidays with Pay',
      content:
        "(1) Every worker shall be entitled after twelve months continuous service to a holiday with full pay of: (a) at least six working days; or (b) in the case of persons under the age of sixteen years (including apprentices), at least twelve working days. (2) The holiday may be deferred by agreement between the employer and the worker: Provided that the holiday-earning period shall not thereby be increased beyond twenty-four months continuous service. (3) It shall be unlawful for an employer to pay wages in lieu of the holiday to a worker whose contract has not terminated. (4) When a worker's employment terminates after he has completed six months but less than twelve months service, he shall be entitled to compensation for each completed month.",
      summary:
        'After 12 months of work, adults are entitled to at least 6 days paid annual leave (12 days for those under 16). Leave cannot be substituted with cash payment while still employed. Pro-rata compensation applies if employment ends after 6 months.',
      orderIndex: 18,
    },
    {
      slug: 'section-19',
      number: '19',
      title: 'Calculation of Leave Pay and Sickness Benefits',
      content:
        'In the calculation of leave pay and sickness benefits only that part of his wages which a worker receives in money (excluding overtime and other allowances) shall be taken into account.',
      summary:
        'Leave pay and sick pay are calculated based on basic wages only. Overtime pay and other allowances are not included in these calculations.',
      orderIndex: 19,
    },
    {
      slug: 'section-20',
      number: '20',
      title: 'Redundancy',
      content:
        '(1) In the event of redundancy: (a) the employer shall inform the trade union or workers\' representative concerned of the reasons for and the extent of the anticipated redundancy; (b) the principle of "last in, first out" shall be adopted in the discharge of the particular category of workers affected, subject to all factors of relative merit, including skill, ability and reliability; (c) the employer shall use his best endeavours to negotiate redundancy payments to any discharged workers who are not protected by regulations made under subsection (2). (2) The Minister may make regulations providing for the compulsory payment of redundancy allowances on the termination of a worker\'s employment because of his redundancy. (3) For the purposes of this section, "redundancy" means an involuntary and permanent loss of employment caused by an excess of manpower.',
      summary:
        'If redundancy occurs, employers must inform the trade union, generally apply "last in, first out" while considering skill and merit, and try to negotiate redundancy payments. Redundancy means permanent job loss due to excess workforce.',
      orderIndex: 20,
    },

    // =====================================================
    // PART III - SPECIAL CLASSES OF WORKERS (WOMEN)
    // =====================================================
    {
      slug: 'section-54',
      number: '54',
      title: 'Maternity Protection',
      content:
        '(1) In any public or private industrial or commercial undertaking or agricultural undertaking or in any branch thereof, a woman: (a) shall have the right to leave her work if she produces a medical certificate given by a registered medical practitioner stating that her confinement will probably take place within six weeks; (b) shall not be permitted to work during the six weeks following her confinement; (c) if she has been continuously employed by her then employer for a period of six months or more immediately prior to her absence shall be paid not less than fifty per cent of the wages she would have earned if she had not been absent; (d) if she is nursing her child, shall be allowed half an hour twice a day during her working hours for that purpose. (2) No employer shall give a woman notice of dismissal during her absence on maternity leave, or notice of dismissal expiring during such absence. (3) No employer shall be liable to pay any medical expenses incurred by a woman during or on account of her pregnancy or confinement.',
      summary:
        'Pregnant women can take 6 weeks leave before expected delivery with medical certificate. Women cannot work for 6 weeks after childbirth. If employed 6+ months, they receive at least 50% wages during maternity leave. Nursing mothers get two 30-minute breaks daily. Employers cannot dismiss women during maternity leave.',
      orderIndex: 54,
    },
    {
      slug: 'section-55',
      number: '55',
      title: 'Night Work for Women',
      content:
        '(1) No woman shall be employed on night work in a public or private industrial undertaking or in any branch thereof, or in any agricultural undertaking or any branch thereof. (2) This section shall not apply to women employed in nursing and welfare services who are not ordinarily engaged in manual work. (3) For the purposes of this section "night" means a period of at least eleven consecutive hours, including the interval between ten o\'clock in the evening and five o\'clock in the morning.',
      summary:
        'Women generally cannot be required to work at night in industrial or agricultural jobs. Night means 11 consecutive hours including 10pm to 5am. This does not apply to nursing and welfare workers.',
      orderIndex: 55,
    },

    // =====================================================
    // PART III - SPECIAL CLASSES OF WORKERS (YOUNG PERSONS)
    // =====================================================
    {
      slug: 'section-59',
      number: '59',
      title: 'Employment of Young Persons - General',
      content:
        '(1) No child shall: (a) be employed or work in any capacity except where he is employed by a member of his family on light work of an agricultural, horticultural or domestic character approved by the Minister; (b) be required in any case to lift, carry or move anything so heavy as to be likely to injure his physical development. (2) No young person under the age of fifteen years shall be employed or work in any industrial undertaking. (3) Young persons shall not be required to work in employment which is injurious to their health, dangerous or unsuitable.',
      summary:
        'Children can only work for family members on light farm or household tasks. No young person under 15 can work in industrial jobs. Young workers cannot be made to lift heavy items or do dangerous work that could harm their development.',
      orderIndex: 59,
    },
    {
      slug: 'section-60',
      number: '60',
      title: 'Employment During School Hours',
      content:
        'No child of compulsory school age shall be employed during school hours, or required to be employed during the night. For the purposes of this section: "child" means a young person under the age of fourteen years; "night" means the period between 8 o\'clock in the evening and 6 o\'clock in the morning.',
      summary:
        'Children under 14 cannot work during school hours or at night (8pm to 6am). Education takes priority over employment for school-age children.',
      orderIndex: 60,
    },
  ],
};
