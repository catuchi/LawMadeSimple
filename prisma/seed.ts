/* eslint-disable no-console */
import { config } from 'dotenv';
import { PrismaClient, LawCategory } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Load environment variables from .env.local
config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting database seed...');

  // Seed Constitution of Nigeria (sample sections)
  const constitution = await prisma.law.upsert({
    where: { slug: 'constitution-1999' },
    update: {},
    create: {
      slug: 'constitution-1999',
      title: 'Constitution of the Federal Republic of Nigeria 1999 (as amended)',
      shortTitle: 'Constitution',
      description:
        'The supreme law of Nigeria, establishing the framework for government and protecting fundamental rights.',
      category: LawCategory.constitution,
      effectiveDate: new Date('1999-05-29'),
      sourceUrl: 'https://www.nigeria-law.org/ConstitutionOfTheFederalRepublicOfNigeria.htm',
      isActive: true,
    },
  });

  console.log(`Created law: ${constitution.title}`);

  // Sample fundamental rights sections
  const fundamentalRights = [
    {
      slug: 'section-33',
      number: '33',
      title: 'Right to Life',
      content:
        'Every person has a right to life, and no one shall be deprived intentionally of his life, save in execution of the sentence of a court in respect of a criminal offence of which he has been found guilty in Nigeria.',
      summary: 'Protects the fundamental right to life for all persons.',
      orderIndex: 33,
    },
    {
      slug: 'section-34',
      number: '34',
      title: 'Right to Dignity of Human Person',
      content:
        'Every individual is entitled to respect for the dignity of his person, and accordingly: (a) no person shall be subject to torture or to inhuman or degrading treatment; (b) no person shall be held in slavery or servitude; (c) no person shall be required to perform forced or compulsory labour.',
      summary: 'Guarantees human dignity and prohibits torture, slavery, and forced labour.',
      orderIndex: 34,
    },
    {
      slug: 'section-35',
      number: '35',
      title: 'Right to Personal Liberty',
      content:
        'Every person shall be entitled to his personal liberty and no person shall be deprived of such liberty save in the following cases and in accordance with a procedure permitted by law.',
      summary: 'Protects personal liberty and outlines lawful exceptions.',
      orderIndex: 35,
    },
    {
      slug: 'section-36',
      number: '36',
      title: 'Right to Fair Hearing',
      content:
        'In the determination of his civil rights and obligations, including any question or determination by or against any government or authority, a person shall be entitled to a fair hearing within a reasonable time by a court or other tribunal established by law.',
      summary: 'Ensures the right to fair trial and due process.',
      orderIndex: 36,
    },
    {
      slug: 'section-37',
      number: '37',
      title: 'Right to Private and Family Life',
      content:
        'The privacy of citizens, their homes, correspondence, telephone conversations and telegraphic communications is hereby guaranteed and protected.',
      summary: 'Protects privacy of home, communications, and family life.',
      orderIndex: 37,
    },
  ];

  for (const section of fundamentalRights) {
    await prisma.section.upsert({
      where: {
        lawId_slug: {
          lawId: constitution.id,
          slug: section.slug,
        },
      },
      update: {},
      create: {
        ...section,
        lawId: constitution.id,
      },
    });
    console.log(`Created section: ${section.title}`);
  }

  // Create sample scenario
  const scenario = await prisma.scenario.upsert({
    where: { slug: 'police-arrest-without-warrant' },
    update: {},
    create: {
      slug: 'police-arrest-without-warrant',
      title: 'Police arrested me without a warrant',
      description:
        'Understanding your rights when police arrest you without showing a warrant or explaining the reason.',
      keywords: ['police', 'arrest', 'warrant', 'detention', 'rights'],
      category: LawCategory.criminal,
      isFeatured: true,
    },
  });

  console.log(`Created scenario: ${scenario.title}`);

  // Link scenario to relevant section
  const section35 = await prisma.section.findFirst({
    where: { lawId: constitution.id, slug: 'section-35' },
  });

  if (section35) {
    await prisma.scenarioSection.upsert({
      where: {
        scenarioId_sectionId: {
          scenarioId: scenario.id,
          sectionId: section35.id,
        },
      },
      update: {},
      create: {
        scenarioId: scenario.id,
        sectionId: section35.id,
        relevanceOrder: 1,
        relevanceNote:
          'Section 35 protects your right to personal liberty. Police must follow legal procedures when arresting someone.',
      },
    });
    console.log('Linked scenario to Section 35');
  }

  console.log('Database seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
