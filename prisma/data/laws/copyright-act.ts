/**
 * Copyright Act 2022
 *
 * This file contains the law metadata and selected sections for the Copyright Act 2022.
 * Sections are selected based on relevance to content creators, musicians, artists, and
 * digital creators in Nigeria.
 *
 * Source: https://placng.org/i/wp-content/uploads/2023/04/Copyright-Act-2022.pdf
 *
 * Note: This is Nigeria's modern copyright law, replacing the Copyright Act 1988.
 * It introduces provisions for digital content, online platforms, and technological protection.
 */

import { LawCategory } from '@prisma/client';
import type { LawWithSections } from '../types';

export const copyrightAct: LawWithSections = {
  law: {
    slug: 'copyright-act-2022',
    title: 'Copyright Act 2022',
    shortTitle: 'Copyright Act',
    description:
      'Protects the rights of creators of literary, musical, artistic, cinematographic, and other works in Nigeria. Covers copyright ownership, duration, infringement, and remedies for content creators.',
    category: LawCategory.intellectual_property,
    effectiveDate: new Date('2023-03-17'),
    sourceUrl: 'https://placng.org/i/wp-content/uploads/2023/04/Copyright-Act-2022.pdf',
    isActive: true,
  },
  sections: [
    // =====================================================
    // PART I - WORKS ELIGIBLE FOR COPYRIGHT
    // =====================================================
    {
      slug: 'section-1',
      number: '1',
      title: 'Works Eligible for Copyright',
      content:
        '(1) Subject to this section, the following works shall be eligible for copyright: (a) literary works; (b) musical works; (c) artistic works; (d) cinematograph films; (e) sound recordings; (f) broadcasts. (2) A literary, musical or artistic work shall not be eligible for copyright unless: (a) sufficient effort has been expended on making the work to give it an original character; (b) the work has been fixed in any medium of expression from which it can be perceived, reproduced, or otherwise communicated, either directly or with the aid of any machine or device.',
      summary:
        'Copyright protects literary works (books, articles, code), musical works, artistic works, films, sound recordings, and broadcasts. The work must be original and fixed in some form (written, recorded, etc.).',
      orderIndex: 1,
    },
    {
      slug: 'section-2',
      number: '2',
      title: 'Literary Works',
      content:
        '(1) In this Act, "literary work" includes: (a) novels, stories, poetry, drama; (b) textbooks, treatises, histories, biographies, essays, articles; (c) encyclopaedias, dictionaries, directories; (d) letters, reports, memoranda; (e) tables, compilations; (f) computer programs; (g) databases that constitute intellectual creation by reason of the selection or arrangement of their contents. (2) A literary work need not have literary merit.',
      summary:
        'Literary works include books, articles, poetry, computer programs, databases, reports, and compilations. There is no requirement for literary quality - even a list or manual can be protected.',
      orderIndex: 2,
    },
    {
      slug: 'section-5',
      number: '5',
      title: 'Musical Works',
      content:
        'In this Act, "musical work" means any work consisting of music, exclusive of any words intended to be sung, spoken, or performed with the music. A musical work need not be in a written notation to qualify for copyright.',
      summary:
        'Musical works are protected separately from lyrics. The music (melody, harmony, arrangement) is protected even if not written down as sheet music - recording is sufficient.',
      orderIndex: 5,
    },
    {
      slug: 'section-6',
      number: '6',
      title: 'Artistic Works',
      content:
        '(1) In this Act, "artistic work" means: (a) graphic works including paintings, drawings, etchings, lithographs, woodcuts, engravings; (b) photographs not part of a cinematograph film; (c) sculptures; (d) works of architecture being buildings or models of buildings; (e) works of artistic craftsmanship. (2) An artistic work need not have artistic quality.',
      summary:
        'Artistic works include paintings, drawings, photographs, sculptures, architecture, and crafts. Like literary works, there is no requirement for artistic merit - even simple designs can be protected.',
      orderIndex: 6,
    },
    {
      slug: 'section-7',
      number: '7',
      title: 'Cinematograph Films',
      content:
        'In this Act, "cinematograph film" means any fixation of a sequence of visual images on any material which can be used to show a moving picture or which is capable of being shown as a moving picture, and includes the recording of a sound track associated with the cinematograph film.',
      summary:
        'Films, videos, and any recorded moving images are protected. This includes the associated sound track. Home videos, TikToks, and YouTube videos all qualify.',
      orderIndex: 7,
    },
    {
      slug: 'section-8',
      number: '8',
      title: 'Sound Recordings',
      content:
        'In this Act, "sound recording" means any exclusively aural fixation of sounds of a performance or other sounds, or a representation of sounds, regardless of the method by which the sounds are fixed or the medium in which the sounds are embodied.',
      summary:
        'Sound recordings include any audio recording regardless of format - MP3s, podcasts, voice notes, studio recordings. The recording itself is protected separately from the underlying music or words.',
      orderIndex: 8,
    },
    {
      slug: 'section-9',
      number: '9',
      title: 'Broadcasts',
      content:
        'In this Act, "broadcast" means sounds or images or both, or the representations thereof, whether digital or analogue, transmitted by wire or wireless means for simultaneous or near-simultaneous reception by members of the public or for transmission to subscribers to a diffusion service, or both, and includes cable transmission and internet streaming.',
      summary:
        'Broadcasts include radio, TV, cable, and internet streaming transmissions. Live streams and on-demand services are protected.',
      orderIndex: 9,
    },

    // =====================================================
    // PART II - COPYRIGHT RIGHTS AND OWNERSHIP
    // =====================================================
    {
      slug: 'section-10',
      number: '10',
      title: 'Nature of Copyright',
      content:
        '(1) Subject to the exceptions specified in this Part, copyright in a literary or musical work shall be the exclusive right to: (a) reproduce the work in any material form; (b) publish the work; (c) perform the work in public; (d) produce, reproduce, perform, or publish any translation of the work; (e) make any cinematograph film or sound recording of the work; (f) distribute to the public the original or copies of the work by way of rental, lease, hire, loan, or similar arrangement; (g) communicate to the public by broadcast or cable; (h) make an adaptation of the work; (i) do any of the above in relation to an adaptation.',
      summary:
        'Copyright gives you exclusive rights to: reproduce, publish, perform, translate, record, distribute, broadcast, and adapt your work. No one can do these without your permission.',
      orderIndex: 10,
    },
    {
      slug: 'section-11',
      number: '11',
      title: 'Copyright in Artistic Works',
      content:
        'Copyright in an artistic work shall be the exclusive right to: (a) reproduce the work in any material form; (b) publish the work; (c) include the work in any cinematograph film; (d) make any adaptation of the work; (e) do, in relation to an adaptation of the work, any of the acts specified in paragraphs (a) to (d).',
      summary:
        'For artistic works, you have exclusive rights to reproduce, publish, include in films, and adapt your work. This covers paintings, photographs, sculptures, and designs.',
      orderIndex: 11,
    },
    {
      slug: 'section-15',
      number: '15',
      title: 'Moral Rights',
      content:
        "(1) The author of a work eligible for copyright under this Act shall have the right: (a) to claim authorship of the work; (b) to object to any distortion, mutilation, or other modification of, or other derogatory action in relation to, the work which would be prejudicial to the author's honour or reputation. (2) Moral rights shall be independent of the author's copyright and may be asserted whether or not the author has transferred, licensed, or assigned the copyright in the work. (3) Moral rights shall not be assignable but may be waived by written agreement.",
      summary:
        'Even if you sell your copyright, you keep moral rights: the right to be credited as author and to object to changes that harm your reputation. Moral rights cannot be sold, only waived in writing.',
      orderIndex: 15,
    },

    // =====================================================
    // PART III - OWNERSHIP AND FIRST OWNERSHIP
    // =====================================================
    {
      slug: 'section-20',
      number: '20',
      title: 'First Ownership of Copyright',
      content:
        '(1) Subject to this section, the author of a work shall be the first owner of the copyright in the work. (2) Where a literary, artistic, or musical work is made by the author in the course of employment by another person under a contract of service, the employer shall be the first owner of any copyright in the work. (3) Ownership of copyright under subsection (2) may be modified by express agreement between the parties.',
      summary:
        'You automatically own copyright in works you create. However, if you create something as part of your job, your employer owns it unless you agree otherwise in writing.',
      orderIndex: 20,
    },
    {
      slug: 'section-21',
      number: '21',
      title: 'Commissioned Works',
      content:
        '(1) Where a person commissions the taking of a photograph, the making of a film, the painting or drawing of a portrait, or the making of a sound recording, and the work is made in pursuance of that commission, the person who commissioned the work shall be the first owner of the copyright, subject to the moral rights of the author. (2) The copyright owner may assign, license, or otherwise dispose of the copyright subject to terms agreed.',
      summary:
        'If you commission someone to create a photograph, film, portrait, or recording, you own the copyright unless agreed otherwise. The creator keeps moral rights to be credited.',
      orderIndex: 21,
    },
    {
      slug: 'section-25',
      number: '25',
      title: 'Assignment and Licensing',
      content:
        '(1) Subject to this section, copyright shall be assignable by the owner of the copyright. (2) An assignment of copyright shall be in writing signed by or on behalf of the assignor. (3) An assignment may be limited so as to apply to only some of the rights comprised in the copyright, to a particular period, or to a specified country or territory. (4) A licence may be granted by a copyright owner for any act that would otherwise be an infringement of copyright.',
      summary:
        'You can sell (assign) or license your copyright. Assignments must be in writing. You can assign partial rights, time-limited rights, or geographic rights. Licensing lets others use your work while you keep ownership.',
      orderIndex: 25,
    },

    // =====================================================
    // PART IV - DURATION OF COPYRIGHT
    // =====================================================
    {
      slug: 'section-30',
      number: '30',
      title: 'Duration of Copyright in Literary, Musical, and Artistic Works',
      content:
        "(1) Copyright in a literary, musical, or artistic work shall subsist during the life of the author and 70 years after the end of the year of the author's death. (2) Where a work is of joint authorship, copyright shall subsist during the life of the last surviving author and 70 years after the end of the year of death of that author. (3) Where the author is a body corporate, copyright shall subsist for 70 years after the end of the year of first publication.",
      summary:
        "Copyright lasts for the author's lifetime plus 70 years. For joint works, it is 70 years after the last author dies. For corporate works, it is 70 years from first publication.",
      orderIndex: 30,
    },
    {
      slug: 'section-31',
      number: '31',
      title: 'Duration of Copyright in Other Works',
      content:
        '(1) Copyright in a cinematograph film or photograph shall subsist for 50 years after the end of the year of first publication. (2) Copyright in a sound recording shall subsist for 50 years after the end of the year of the making or first publication. (3) Copyright in a broadcast shall subsist for 50 years after the end of the year of first broadcast.',
      summary:
        'Films, photographs, sound recordings, and broadcasts are protected for 50 years from publication or broadcast. This is shorter than the 70 years for written or artistic works.',
      orderIndex: 31,
    },

    // =====================================================
    // PART V - INFRINGEMENT AND REMEDIES
    // =====================================================
    {
      slug: 'section-40',
      number: '40',
      title: 'Acts Constituting Infringement',
      content:
        '(1) Copyright is infringed by a person who, without a licence from the owner of the copyright, does or causes or permits another person to do in Nigeria any of the acts controlled by copyright. (2) Copyright is also infringed by a person who imports into Nigeria, or distributes, sells, offers for sale, lets for hire, or exposes for sale or hire, or has in possession for the purpose of sale or hire, any copy of a work which is an infringing copy.',
      summary:
        'You infringe copyright by doing any protected act without permission: copying, distributing, performing, broadcasting. Importing, selling, or possessing pirated copies is also infringement.',
      orderIndex: 40,
    },
    {
      slug: 'section-42',
      number: '42',
      title: 'Secondary Infringement',
      content:
        '(1) Copyright in a work is also infringed by a person who, without the licence of the copyright owner: (a) sells, lets for hire, or exposes for sale or hire; (b) offers or exposes for sale or hire; (c) distributes; (d) imports into Nigeria otherwise than for private and domestic use; (e) in the course of a business, has in possession; any article which that person knows or has reason to believe is an infringing copy of the work.',
      summary:
        'Even if you did not make the copy yourself, you infringe by selling, renting, distributing, or importing copies you know are pirated. Business possession of pirated goods is infringement.',
      orderIndex: 42,
    },
    {
      slug: 'section-51',
      number: '51',
      title: 'Civil Remedies for Infringement',
      content:
        '(1) Infringement of copyright shall be actionable at the suit of the owner of the copyright. (2) In an action for infringement, the relief available to the plaintiff includes: (a) damages; (b) injunction; (c) account of profits; (d) delivery up of infringing copies; (e) any other remedy as the court may deem fit. (3) In assessing damages, the court may have regard to the flagrancy of the infringement and any benefit accruing to the defendant.',
      summary:
        'You can sue infringers for: damages (compensation), injunction (stop them), account of profits (take their earnings), delivery up (hand over copies). Courts can award extra damages for flagrant infringement.',
      orderIndex: 51,
    },
    {
      slug: 'section-52',
      number: '52',
      title: 'Criminal Offences',
      content:
        '(1) A person who, at a time when copyright subsists in a work: (a) makes for sale or hire; (b) imports into Nigeria except for private and domestic use; (c) sells, lets for hire, or offers for sale; (d) exhibits in public in the course of trade; (e) distributes for trade or to affect prejudicially the owner of the copyright; any article which he knows to be an infringing copy of the work, commits an offence and is liable on conviction to a fine of at least N500,000 or imprisonment of not less than 12 months or both.',
      summary:
        'Commercial piracy is criminal. Making, importing, selling, or distributing pirated works knowingly is punishable by minimum ₦500,000 fine or 12 months imprisonment or both.',
      orderIndex: 52,
    },

    // =====================================================
    // PART VI - FAIR USE AND EXCEPTIONS
    // =====================================================
    {
      slug: 'section-45',
      number: '45',
      title: 'Fair Use',
      content:
        '(1) Fair use of a work protected by copyright shall not constitute an infringement of copyright. (2) In determining whether the use of a work in any particular case constitutes fair use, the factors to be considered shall include: (a) the purpose and character of the use, including whether such use is of a commercial nature or is for non-profit educational purposes; (b) the nature of the work; (c) the amount and substantiality of the portion used in relation to the work as a whole; (d) the effect of the use upon the potential market for or value of the work.',
      summary:
        'Fair use is allowed and not infringement. Courts consider: commercial vs. educational purpose, nature of work, how much was used, and market impact. Small quotes for commentary, education, or parody may be fair use.',
      orderIndex: 45,
    },
    {
      slug: 'section-46',
      number: '46',
      title: 'Permitted Acts for Education and Research',
      content:
        '(1) The doing of any of the following acts for purposes of education, personal or private use, criticism, review, or news reporting shall not constitute infringement of copyright: (a) reproduction of a work for use in face-to-face teaching in an educational institution; (b) quotation from a published work in a manner consistent with fair practice and to the extent justified by the purpose; (c) reproduction by libraries and archives; (d) reproduction for judicial or administrative proceedings.',
      summary:
        'Educational use, personal study, criticism, reviews, and news reporting are permitted. Teachers can copy for classroom use. Libraries can make preservation copies. Court proceedings can use copies.',
      orderIndex: 46,
    },

    // =====================================================
    // PART VII - ONLINE AND DIGITAL PROVISIONS
    // =====================================================
    {
      slug: 'section-60',
      number: '60',
      title: 'Technological Protection Measures',
      content:
        '(1) It shall be an offence for any person to knowingly circumvent any technological measure that effectively controls access to a work protected under this Act. (2) It shall be an offence for any person to manufacture, import, distribute, sell, let for hire, advertise for sale or hire, or possess for commercial purposes, any device, product, or component primarily designed for the purpose of circumventing technological protection measures.',
      summary:
        'Breaking digital locks (DRM) to access protected content is illegal. Making, selling, or possessing devices designed to break copy protection is also a criminal offence.',
      orderIndex: 60,
    },
    {
      slug: 'section-61',
      number: '61',
      title: 'Notice and Takedown',
      content:
        '(1) An online service provider shall not be liable for copyright infringement by reason of storing, at the direction of a user of the service, content that infringes copyright, if the service provider: (a) does not have actual knowledge of the infringement; (b) upon obtaining knowledge, acts expeditiously to remove or disable access to the content; (c) has designated an agent to receive infringement notices. (2) A copyright owner may notify the service provider of infringement. (3) Upon receiving valid notice, the service provider shall expeditiously remove or disable access to the content.',
      summary:
        'Online platforms are not liable for user-uploaded content if they respond to takedown notices. Copyright owners can send takedown notices. Platforms must remove infringing content promptly when notified.',
      orderIndex: 61,
    },
  ],
};
