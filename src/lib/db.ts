import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  // Limit pool size to prevent exhausting Supabase session pooler connections
  // during Next.js builds (multiple workers × default 10 connections = exhaustion)
  const pool = new Pool({
    connectionString,
    max: 3, // Conservative limit per process
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Always store in global to prevent connection exhaustion during builds
// (Next.js build workers share globalThis but not module scope)
globalForPrisma.prisma = prisma;

export default prisma;
