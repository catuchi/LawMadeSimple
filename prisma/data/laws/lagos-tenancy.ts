/**
 * Lagos State Tenancy Law 2011
 *
 * This file contains the law metadata and selected sections for the Lagos Tenancy Law.
 * Sections are selected based on relevance to everyday tenant-landlord scenarios.
 *
 * Note: This law applies only to Lagos State. Other states may have different tenancy laws.
 * The law does NOT apply in Apapa, Ikeja GRA, Ikoyi, and Victoria Island (federal areas).
 *
 * Source: http://lagosministryofjustice.org/wp-content/uploads/2022/01/Tenancy-Law-2011.pdf
 * Also referenced: https://www.lawglobalhub.com/section-13-tenancy-law-of-lagos-state-2011/
 */

import { LawCategory } from '@prisma/client';
import type { LawWithSections } from '../types';

export const lagosTenancy: LawWithSections = {
  law: {
    slug: 'lagos-tenancy-law-2011',
    title: 'Lagos State Tenancy Law 2011',
    shortTitle: 'Lagos Tenancy Law',
    description:
      'Regulates the relationship between landlords and tenants in Lagos State, including rent control, eviction procedures, and tenant protections.',
    category: LawCategory.property,
    effectiveDate: new Date('2011-08-01'),
    sourceUrl: 'http://lagosministryofjustice.org/wp-content/uploads/2022/01/Tenancy-Law-2011.pdf',
    isActive: true,
  },
  sections: [
    // Citation
    {
      slug: 'section-1',
      number: '1',
      title: 'Citation and Commencement',
      content:
        'This Law may be cited as the Tenancy Law of Lagos State 2011 and shall come into force on the date of its publication in the Lagos State Official Gazette.',
      summary: 'Establishes the title and effective date of the Lagos Tenancy Law.',
      orderIndex: 1,
    },

    // Advance Rent Limits
    {
      slug: 'section-4',
      number: '4',
      title: 'Advance Rent',
      content:
        '(1) It shall be unlawful for a landlord or his agent to demand or receive from a sitting tenant rent in excess of six (6) months from a monthly tenant and one (1) year from a yearly tenant.\n\n(2) It shall be unlawful for a landlord or his agent to demand or receive from a new or would-be tenant rent in excess of one (1) year.\n\n(3) Any landlord or agent who contravenes the provisions of this section commits an offence and is liable on conviction to a fine of One Hundred Thousand Naira (N100,000.00) or imprisonment for a term not exceeding three (3) months or to both fine and imprisonment.\n\n(4) It shall be unlawful for any person who receives or pays rent in excess of what is prescribed in this section.',
      summary:
        'Limits how much rent landlords can collect in advance: maximum 6 months from existing monthly tenants, 1 year from yearly tenants, and 1 year from new tenants. Violations carry fines up to N100,000 or 3 months imprisonment.',
      orderIndex: 4,
    },

    // Rent Receipts
    {
      slug: 'section-5',
      number: '5',
      title: 'Rent Payment Receipt',
      content:
        '(1) A landlord or his agent shall issue a receipt to a tenant upon payment of rent by the tenant.\n\n(2) Any landlord or agent who fails to issue a receipt to the tenant upon payment of rent commits an offence and is liable on conviction to a fine of One Hundred Thousand Naira (N100,000.00).',
      summary:
        'Landlords must issue receipts for all rent payments. Failure to do so is an offence punishable by N100,000 fine.',
      orderIndex: 5,
    },

    // Tenant Rights
    {
      slug: 'section-6',
      number: '6',
      title: 'Rights of a Tenant',
      content:
        '(1) Subject to the provisions of this Law and of any other law for the time being in force, a tenant shall be entitled to—\n(a) exclusive possession of the premises;\n(b) freedom from unreasonable disturbance by the landlord, his agent or any person claiming under him;\n(c) complete privacy in his home, subject to the terms of any express agreement with the landlord;\n(d) quiet and peaceable enjoyment of the premises;\n(e) have access to his premises at all times.\n\n(2) A tenant who has with the prior written consent of the landlord expended money on the improvement or renovation of the premises shall on the termination of the tenancy, on application to the Court be entitled to compensation with regard to such improvements.',
      summary:
        'Tenants have rights to exclusive possession, privacy, peaceful enjoyment, and 24/7 access to their rented premises. They can also claim compensation for landlord-approved improvements when the tenancy ends.',
      orderIndex: 6,
    },

    // Tenant Obligations
    {
      slug: 'section-7',
      number: '7',
      title: 'Obligations of the Tenant',
      content:
        'Subject to any express provisions to the contrary, it shall be the duty of the tenant—\n(a) to pay rent for the premises as and when due;\n(b) to pay such rates as are by law or by agreement payable by him and not the landlord;\n(c) to keep the interior of the premises in good and proper repair;\n(d) not to make any structural alterations or additions to the premises without the prior written consent of the landlord;\n(e) to permit the landlord or his agent at all reasonable times, on prior written notice except in emergencies, to enter upon the premises to view the state and condition thereof;\n(f) to use the premises only for the purpose for which it was let;\n(g) not to do or suffer to be done on the premises any act which is a nuisance to the occupiers of the adjoining or neighbouring premises;\n(h) to deliver up possession of the premises at the termination of the tenancy in the same state and condition as they were at the commencement of the tenancy, reasonable wear and tear excepted.',
      summary:
        'Tenants must pay rent on time, maintain the interior, avoid structural changes without permission, allow landlord inspections with notice, use premises only for agreed purposes, avoid being a nuisance to neighbors, and return the property in good condition.',
      orderIndex: 7,
    },

    // Landlord Obligations
    {
      slug: 'section-8',
      number: '8',
      title: 'Obligations of the Landlord',
      content:
        "Subject to any express provisions to the contrary, it shall be the duty of the landlord—\n(a) to put the tenant in exclusive possession of the premises;\n(b) not to disturb the tenant's quiet and peaceable enjoyment of the premises;\n(c) not to terminate or restrict the use of a common facility or service for the use of the premises;\n(d) to repair the exterior of the premises including the roof, walls and gate where applicable;\n(e) not to seize any item or property of the tenant or interfere with the tenant's access to his personal property;\n(f) to give the tenant at least seven (7) days prior written notice before any scheduled maintenance or repairs that may disrupt the tenant's use of the premises.",
      summary:
        'Landlords must give exclusive possession, not disturb tenants, maintain common facilities, repair exterior and structural elements (roof, walls, gate), never seize tenant property, and give 7 days notice before disruptive maintenance.',
      orderIndex: 8,
    },

    // Service Charges and Deposits
    {
      slug: 'section-10',
      number: '10',
      title: 'Service Charge, Facility and Security Deposits',
      content:
        '(1) A landlord or his agent may in addition to rent, demand from a tenant, payment of service charge, facility fee or security deposit for the premises.\n\n(2) Where a security deposit is collected from a tenant, the landlord shall refund the security deposit to the tenant at the termination of the tenancy less any amount owed by the tenant to the landlord.\n\n(3) Any landlord who fails to refund the security deposit to a tenant in accordance with subsection (2) of this section commits an offence and is liable on conviction to a fine of Fifty Thousand Naira (N50,000.00).',
      summary:
        'Landlords can collect service charges and security deposits. Security deposits must be refunded at the end of tenancy minus any debts owed. Failure to refund is an offence with N50,000 fine.',
      orderIndex: 10,
    },

    // Length of Notice
    {
      slug: 'section-13',
      number: '13',
      title: 'Length of Notice',
      content:
        "(1) Where there is no stipulation as to the notice to be given by either party to determine the tenancy, the following shall apply—\n(a) a week's notice for a tenant at will;\n(b) one (1) month's notice for a monthly tenant;\n(c) three (3) months' notice for a quarterly tenant;\n(d) three (3) months' notice for a half-yearly tenant;\n(e) six (6) months' notice for a yearly tenant.\n\n(2) In the case of a monthly tenancy, where the tenant is in arrears of rent for six (6) months, the tenancy shall lapse and the Court shall make an order for possession and arrears of rent upon proof of the arrears by the landlord.\n\n(3) In the case of a quarterly or half-yearly tenancy, where the tenant is in arrears of one (1) year rent, the tenancy shall lapse and the Court shall make an order for possession and arrears of rent upon proof of the arrears by the landlord.\n\n(4) The notice prescribed in paragraphs (c), (d) and (e) of subsection (1) of this section may expire either on the date of the anniversary or on any date after the date of the anniversary of the tenancy and need not expire on the anniversary of the tenancy.\n\n(5) In the case of a tenancy for a fixed term, no notice to quit shall be required once the tenancy has been determined by effluxion of time and where the landlord intends to proceed to Court to recover possession, he shall serve a seven (7) days written notice of his intention to apply to recover possession.\n\n(6) In the absence of any evidence or agreement to the contrary, a tenancy shall be deemed to be a tenancy determinable according to the period in respect of which rent is payable.",
      summary:
        'Sets minimum notice periods: 1 week (tenant at will), 1 month (monthly), 3 months (quarterly/half-yearly), 6 months (yearly). No notice needed if tenant owes 6+ months rent (monthly) or 1+ year (quarterly). Fixed-term tenancies end automatically but require 7-day court notice.',
      orderIndex: 13,
    },

    // Abandoned Premises Notice
    {
      slug: 'section-15',
      number: '15',
      title: 'Notice Required for Abandoned Premises',
      content:
        "(1) Where a tenant abandons the premises without giving prior notice to the landlord, the landlord may, after having given a seven (7) days' written notice to the tenant at the abandoned premises of his intention to recover possession, recover possession of the premises.\n\n(2) The notice to be given under subsection (1) of this section shall be in Form TL4 in the Schedule to this Law.",
      summary:
        'If a tenant abandons the property without notice, the landlord must post a 7-day written notice at the premises before recovering possession.',
      orderIndex: 15,
    },

    // Tenant Refusing to Leave
    {
      slug: 'section-16',
      number: '16',
      title: 'Tenant Refusing or Neglecting to Give Up Possession',
      content:
        "(1) Where a tenant refuses or neglects to give up possession of the premises on the expiration of a valid notice to quit, the landlord shall serve on the tenant a seven (7) days' written notice of his intention to apply to the Court to recover possession of the premises.\n\n(2) The notice to be given under subsection (1) of this section shall be in Form TL5 in the Schedule to this Law.",
      summary:
        'After a valid notice to quit expires and tenant refuses to leave, landlord must serve another 7-day notice before going to court. Self-help eviction is not allowed.',
      orderIndex: 16,
    },

    // Service of Notice
    {
      slug: 'section-17',
      number: '17',
      title: 'Service of Notice',
      content:
        '(1) Any notice required to be served under this Law may be served—\n(a) by delivering it to the person on whom it is to be served;\n(b) by leaving it at his last known address or place of abode;\n(c) by sending it by registered post to his last known address or place of abode;\n(d) by leaving it with some person apparently above the age of sixteen (16) years at his last known place of abode or business;\n(e) where the person to be served is a corporate body, by delivering it to the Secretary or other proper officer of the body corporate at its registered office.\n\n(2) Where a notice is sent by registered post, service shall be deemed to have been effected at the time when the notice would in the ordinary course of post be delivered.',
      summary:
        'Notices can be served by: personal delivery, leaving at last known address, registered post, giving to someone 16+ years at the address, or (for companies) at registered office. Posted notices are deemed served when normally delivered.',
      orderIndex: 17,
    },

    // Rent Increase Procedure
    {
      slug: 'section-37',
      number: '37',
      title: 'Rent Increase',
      content:
        "(1) A landlord who desires to increase the rent payable in respect of any premises shall give to the tenant not less than six (6) months' notice in writing of the proposed increase and the date when it is to take effect.\n\n(2) Where a tenant considers the rent or any increase in the rent charged by a landlord in respect of any premises to be excessive, the tenant may apply to the Court to assess and fix what in all the circumstances of the case should be the reasonable rent payable in respect of the premises.\n\n(3) On receipt of an application under subsection (2) of this section, the Court shall assess what would be a fair and reasonable rent for the premises having regard to the prevailing market rent for premises of similar description in the locality and shall fix the same as the rent payable by the tenant.",
      summary:
        'Landlords must give 6 months written notice before increasing rent. Tenants who think the increase is excessive can apply to court to have a fair rent determined based on local market rates.',
      orderIndex: 37,
    },

    // Unlawful Eviction - Offences
    {
      slug: 'section-44',
      number: '44',
      title: 'Offences',
      content:
        '(1) Any person who—\n(a) demolishes, alters or otherwise modifies a building or any part thereof occupied by a tenant with a view to ejecting the tenant without the approval of the Court;\n(b) attempts to forcibly eject or forcibly ejects a tenant;\n(c) threatens or molests a tenant by action or words;\n(d) wilfully damages any premises occupied by a tenant with a view to ejecting the tenant;\n(e) wilfully and without reasonable cause cuts off, withholds, diminishes, terminates or restricts any essential service in respect of premises occupied by a tenant with a view to ejecting or compelling the tenant to quit;\n(f) locks out or bolts out a tenant from the premises or any part thereof without the approval of the Court;\n(g) removes or interferes with any fittings or fixtures let or agreed to be let to a tenant for the time being lawfully in occupation of the premises with a view to ejecting the tenant;\n(h) removes, destroys or interferes with any property of a tenant lawfully occupying any premises with a view to compelling the tenant to quit the premises;\ncommits an offence and is liable on conviction to a fine of Two Hundred and Fifty Thousand Naira (N250,000.00) or to imprisonment for a term not exceeding six (6) months or to both fine and imprisonment.\n\n(2) Any person who aids, abets, counsels, assists or procures another person to commit an offence under subsection (1) of this section commits an offence and is liable on conviction to a fine of Two Hundred and Fifty Thousand Naira (N250,000.00) or to imprisonment for a term not exceeding six (6) months or to both fine and imprisonment.',
      summary:
        'It is a criminal offence to: demolish/alter building to eject tenant, forcibly evict, threaten/molest tenant, damage premises, cut off utilities, lock out tenant, remove fittings, or destroy tenant property. Penalty: N250,000 fine or 6 months imprisonment or both. Helpers also liable.',
      orderIndex: 44,
    },
  ],
};
