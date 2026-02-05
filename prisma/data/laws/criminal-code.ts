/**
 * Criminal Code Act (Cap C38 LFN 2004)
 *
 * This file contains the law metadata and selected sections for the Criminal Code.
 * Sections are selected based on relevance to everyday scenarios.
 *
 * Note: The Criminal Code applies to Southern Nigeria. Northern states use the Penal Code.
 *
 * Source: https://lawsofnigeria.placng.org/laws/C38.pdf
 */

import { LawCategory } from '@prisma/client';
import type { LawWithSections } from '../types';

export const criminalCode: LawWithSections = {
  law: {
    slug: 'criminal-code-act',
    title: 'Criminal Code Act (Cap C38 LFN 2004)',
    shortTitle: 'Criminal Code',
    description:
      'Defines criminal offences and their punishments in Southern Nigeria. Covers offences against persons, property, public order, and morality.',
    category: LawCategory.criminal,
    effectiveDate: new Date('1916-06-01'), // Originally enacted 1916, codified 2004
    sourceUrl: 'https://lawsofnigeria.placng.org/laws/C38.pdf',
    isActive: true,
  },
  sections: [
    // =====================================================
    // PART I - Introductory
    // =====================================================
    {
      slug: 'section-1',
      number: '1',
      title: 'Short Title',
      content: 'This Act may be cited as the Criminal Code Act.',
      summary: 'Establishes the official name of this legislation.',
      orderIndex: 1,
    },

    // =====================================================
    // ASSAULT & CAUSING HARM (Sections 351-360)
    // =====================================================
    {
      slug: 'section-351',
      number: '351',
      title: 'Common Assault',
      content:
        'A person who unlawfully assaults another is guilty of a misdemeanour, and is liable to imprisonment for one year.',
      summary:
        'Defines common assault as any unlawful physical contact or threat that puts someone in fear of immediate violence. Punishable by up to 1 year imprisonment.',
      orderIndex: 351,
    },
    {
      slug: 'section-352',
      number: '352',
      title: 'Assault Occasioning Actual Bodily Harm',
      content:
        'Any person who commits an assault occasioning actual bodily harm is guilty of a felony, and is liable to imprisonment for five years.',
      summary:
        'When an assault causes visible injury or harm to another person, it becomes a felony punishable by up to 5 years imprisonment.',
      orderIndex: 352,
    },
    {
      slug: 'section-353',
      number: '353',
      title: 'Assault on Males (Indecent Assault)',
      content:
        'Any person who unlawfully and indecently assaults any male person is guilty of a felony, and is liable to imprisonment for three years. The offender cannot be arrested without warrant.',
      summary:
        'Criminalizes indecent assault on male persons. Punishable by up to 3 years imprisonment.',
      orderIndex: 353,
    },
    {
      slug: 'section-355',
      number: '355',
      title: 'Assault on Females (Indecent Assault)',
      content:
        'Any person who unlawfully and indecently assaults a woman or girl is guilty of a misdemeanour, and is liable to imprisonment for two years.',
      summary:
        'Criminalizes indecent assault on female persons. Punishable by up to 2 years imprisonment.',
      orderIndex: 355,
    },
    {
      slug: 'section-360',
      number: '360',
      title: 'Grievous Harm',
      content:
        'Any person who unlawfully does grievous harm to another is guilty of a felony, and is liable to imprisonment for seven years.',
      summary:
        'Causing serious bodily injury (grievous harm) to another person is a felony punishable by up to 7 years imprisonment.',
      orderIndex: 360,
    },

    // =====================================================
    // UNLAWFUL RESTRAINT & DETENTION (Sections 364-366)
    // =====================================================
    {
      slug: 'section-364',
      number: '364',
      title: 'Kidnapping',
      content:
        'Any person who unlawfully imprisons any person, and takes him out of Nigeria, without his consent, is guilty of a felony, and is liable to imprisonment for ten years.',
      summary:
        'Kidnapping involves unlawfully imprisoning someone and taking them out of Nigeria. Punishable by up to 10 years imprisonment.',
      orderIndex: 364,
    },
    {
      slug: 'section-365',
      number: '365',
      title: 'Abduction',
      content:
        'Any person who by force or fraud takes or entices away any person, or unlawfully detains any person, with intent to cause that person to be confined or detained against his will, is guilty of a felony, and is liable to imprisonment for seven years.',
      summary:
        'Abduction involves taking, enticing, or detaining someone against their will through force or fraud. Punishable by up to 7 years imprisonment.',
      orderIndex: 365,
    },
    {
      slug: 'section-366',
      number: '366',
      title: 'Wrongful Confinement',
      content:
        'Any person who unlawfully confines or detains another in any place against his will, or otherwise unlawfully deprives another of his personal liberty, is guilty of a misdemeanour, and is liable to imprisonment for two years.',
      summary:
        'Wrongfully confining or detaining someone against their will is a criminal offence punishable by up to 2 years imprisonment.',
      orderIndex: 366,
    },

    // =====================================================
    // THEFT & STEALING (Sections 383-390)
    // =====================================================
    {
      slug: 'section-383',
      number: '383',
      title: 'Definition of Stealing',
      content:
        '(1) A person who fraudulently takes anything capable of being stolen, or fraudulently converts to his own use or to the use of any other person anything capable of being stolen, is said to steal that thing.\n\n(2) A person who takes or converts anything capable of being stolen is deemed to do so fraudulently if he does so with any of the following intents, that is to say -\n(a) an intent permanently to deprive the owner of the thing of it;\n(b) an intent to use the thing as a pledge or security;\n(c) an intent to part with it on a condition as to its return which the person taking or converting it may be unable to perform;\n(d) an intent to deal with it in such a manner that it cannot be returned in the condition in which it was at the time of the taking or conversion;\n(e) in the case of money, an intent to use it at the will of the person who takes or converts it, although he may intend afterwards to repay the amount to the owner.\n\n(3) The taking or conversion may be fraudulent, although it is effected without secrecy or attempt at concealment.',
      summary:
        'Stealing is defined as fraudulently taking or converting property belonging to another with intent to permanently deprive them of it. Includes taking as pledge, or handling property so it cannot be returned in original condition.',
      orderIndex: 383,
    },
    {
      slug: 'section-390',
      number: '390',
      title: 'Punishment for Stealing (General)',
      content:
        '(1) Any person who steals anything capable of being stolen is guilty of a felony, and is liable, if no other punishment is provided, to imprisonment for three years.\n\n(2) If the thing stolen is of the value of one thousand naira or upwards, or is a fixture or chattel let to hire with the house, lodging, flat, or apartment in which it is, or a testamentary instrument, whether the testator is living or dead, or a postal matter or other thing sent by post, or a vessel, motor vehicle, or aircraft or the equipment or part of a vessel, motor vehicle, or aircraft, he is liable to imprisonment for seven years.\n\n(3) If the offender is a person employed in the public service, and the thing stolen is the property of the State or of any local government council, he is liable to imprisonment for seven years.\n\n(4) If the offender is a clerk or servant, and the thing stolen is the property of his employer, or came into the possession of the offender on account of his employer, he is liable to imprisonment for seven years.',
      summary:
        'Stealing is a felony punishable by 3 years imprisonment generally. Punishment increases to 7 years for stealing valuable items (over ₦1,000), vehicles, items from employer, or government property.',
      orderIndex: 390,
    },
    {
      slug: 'section-427',
      number: '427',
      title: 'Receiving Stolen Property',
      content:
        'Any person who receives anything which has been obtained by means of any act constituting a felony or misdemeanour, or by means of any act done at a place not in Nigeria, which if it had been done in Nigeria would have constituted a felony or misdemeanour, and which is an offence under the laws in force in the place where it was done, knowing the same to have been so obtained, is guilty of a felony.\n\nIf the offence by means of which the thing was obtained is a felony, the offender is liable to imprisonment for fourteen years, except that, where the thing so received is a motor vehicle or the equipment or part of a motor vehicle, he is liable to imprisonment for a term of not less than seven years and not more than fourteen years without the option of a fine.\n\nIf the offence by means of which the thing was obtained is a misdemeanour, the offender is liable to imprisonment for seven years.',
      summary:
        'Knowingly receiving stolen property is a felony. If the original offence was a felony, punishment is up to 14 years (minimum 7 years for stolen vehicles). If original offence was a misdemeanour, punishment is up to 7 years.',
      orderIndex: 427,
    },

    // =====================================================
    // CRIMINAL TRESPASS (Sections 342-343)
    // =====================================================
    {
      slug: 'section-342',
      number: '342',
      title: 'Criminal Trespass',
      content:
        'Any person who enters into or upon property in the possession of another with intent to commit an offence or to intimidate, insult, or annoy any person in possession of such property, or, having lawfully entered into or upon such property, unlawfully remains there with intent thereby to intimidate, insult, or annoy any such person, or with intent to commit any offence, is guilty of the misdemeanour termed criminal trespass, and is liable to imprisonment for three years.',
      summary:
        'Entering or remaining on property with intent to commit an offence, or to intimidate, insult or annoy the occupant is criminal trespass. Punishable by up to 3 years imprisonment.',
      orderIndex: 342,
    },
    {
      slug: 'section-343',
      number: '343',
      title: 'Breaking into Buildings',
      content:
        'Any person who breaks into any building, whether by breaking a door, window, wall, or otherwise, with intent to commit an offence therein, or having entered therein with such intent, breaks out of the building, is guilty of a felony, and is liable to imprisonment for seven years.',
      summary:
        'Breaking into a building (through doors, windows, walls, etc.) with intent to commit an offence is a felony punishable by up to 7 years imprisonment.',
      orderIndex: 343,
    },

    // =====================================================
    // DEFAMATION (Sections 373-377)
    // =====================================================
    {
      slug: 'section-373',
      number: '373',
      title: 'Definition of Defamatory Matter',
      content:
        'Defamatory matter is matter likely to injure the reputation of any person by exposing him to hatred, contempt, or ridicule, or likely to damage any person in his profession or trade by an injury to his reputation.',
      summary:
        "Defamatory matter is any communication likely to damage a person's reputation by exposing them to hatred, contempt, or ridicule, or harming their professional standing.",
      orderIndex: 373,
    },
    {
      slug: 'section-375',
      number: '375',
      title: 'Publication of Defamatory Matter',
      content:
        'Any person who, by print, writing, painting, effigy, or by any means otherwise than solely by gestures, spoken words, or other sounds, unlawfully publishes any defamatory matter concerning another person, with intent to defame that other person, is guilty of a misdemeanour, and is liable to imprisonment for two years.\n\nThe offender may be arrested without warrant.',
      summary:
        'Publishing defamatory content (in writing, print, images, etc.) with intent to defame someone is a criminal offence punishable by up to 2 years imprisonment.',
      orderIndex: 375,
    },

    // =====================================================
    // ROBBERY & EXTORTION (Sections 401-406)
    // =====================================================
    {
      slug: 'section-401',
      number: '401',
      title: 'Robbery Defined',
      content:
        'Any person who steals anything, and, at or immediately before or immediately after the time of stealing it, uses or threatens to use actual violence to any person or property in order to obtain or retain the thing stolen or to prevent or overcome resistance to its being stolen or retained, is said to be guilty of robbery.',
      summary:
        'Robbery is stealing accompanied by the use or threat of violence before, during, or after taking the property.',
      orderIndex: 401,
    },
    {
      slug: 'section-402',
      number: '402',
      title: 'Punishment for Robbery',
      content:
        '(1) Any person who commits the offence of robbery shall upon conviction be sentenced to imprisonment for not less than twenty-one years.\n\n(2) If -\n(a) any offender is armed with any firearm or any offensive weapon or any obnoxious or chemical material or is in company with any person so armed; or\n(b) at or immediately after the time of the robbery the said offender wounds or uses any personal violence to any person,\nthe offender shall upon conviction be sentenced to death.',
      summary:
        'Robbery is punishable by minimum 21 years imprisonment. If the robber is armed with a weapon or firearm, or causes injury during the robbery, the punishment is death.',
      orderIndex: 402,
    },
    {
      slug: 'section-406',
      number: '406',
      title: 'Extortion by Threats',
      content:
        'Any person who, with intent to extort or gain anything from any person, -\n(a) accuses or threatens to accuse any person of committing any felony or misdemeanour, or of offering or making any solicitation or threat to any person as an inducement to commit or permit the commission of any felony or misdemeanour; or\n(b) threatens that any person shall be accused by any other person of any felony or misdemeanour, or of any such act; or\n(c) knowing the contents of the writing, causes any person to receive any writing containing any such accusation or threat,\nis guilty of a felony, and is liable to imprisonment for fourteen years.',
      summary:
        'Threatening to accuse someone of a crime in order to extort money or benefit from them is extortion by threats. Punishable by up to 14 years imprisonment.',
      orderIndex: 406,
    },

    // =====================================================
    // CONSPIRACY & UNLAWFUL ASSEMBLY (Sections 516-518)
    // =====================================================
    {
      slug: 'section-516',
      number: '516',
      title: 'Conspiracy to Commit Felony',
      content:
        'Any person who conspires with another to commit any felony, or to do any act in any part of the world which if done in Nigeria would be a felony, and which is an offence under the laws in force in the place where it is proposed to be done, is guilty of a felony, and is liable, if no other punishment is provided, to imprisonment for seven years, or, if the greatest punishment to which a person convicted of the felony in question is liable is less than imprisonment for seven years, then to such lesser punishment.',
      summary:
        'Conspiring (agreeing) with others to commit a felony is itself a criminal offence. Punishable by up to 7 years imprisonment or the maximum punishment for the intended felony, whichever is less.',
      orderIndex: 516,
    },
    {
      slug: 'section-517',
      number: '517',
      title: 'Conspiracy to Commit Misdemeanour',
      content:
        'Any person who conspires with another to commit any misdemeanour, or to do any act in any part of the world which if done in Nigeria would be a misdemeanour, and which is an offence under the laws in force in the place where it is proposed to be done, is guilty of a misdemeanour, and is liable to imprisonment for two years, or to such punishment as is provided for the commission of such misdemeanour, whichever is less.',
      summary: 'Conspiring to commit a misdemeanour is punishable by up to 2 years imprisonment.',
      orderIndex: 517,
    },
    {
      slug: 'section-70',
      number: '70',
      title: 'Unlawful Assembly',
      content:
        'When three or more persons, with intent to carry out some common purpose, assemble in such a manner, or, being assembled, conduct themselves in such a manner, as to cause persons in the neighbourhood to fear on reasonable grounds that the persons so assembled will tumultuously disturb the peace, or will by such assembly needlessly and without any reasonable occasion provoke other persons tumultuously to disturb the peace, they are an unlawful assembly.\n\nIt is immaterial that the original assembling was lawful if, being assembled, they conduct themselves with a common purpose in such a manner as aforesaid.\n\nAn assembly of three or more persons who assemble for the purpose of protecting the house of any one of their number against persons threatening to break and enter the house, in order to commit a felony therein, is not an unlawful assembly.',
      summary:
        'An unlawful assembly is when 3 or more people gather with the intent to disturb the peace or provoke others to do so. Exception: gathering to protect a home from intruders is not unlawful.',
      orderIndex: 70,
    },
  ],
};
