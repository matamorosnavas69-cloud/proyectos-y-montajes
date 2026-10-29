import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const DEFAULT_DB_URL =
  'postgresql://postgres.vkqyisrjpxzflleqiydx:RTmekG3Z7oeOhXY2@aws-0-us-west-1.pooler.supabase.com:5432/postgres?schema=proyectos_y_montajes';

function getSanitizedDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL?.trim();
  if (!raw) return DEFAULT_DB_URL;

  // Clean password brackets if user pasted literal [password]
  const cleaned = raw.replace(/:\[([^\]]+)\]@/, ':$1@');
  try {
    new URL(cleaned);
    return cleaned;
  } catch {
    console.warn('[Prisma] Invalid DATABASE_URL detected, falling back to canonical database URL.');
    return DEFAULT_DB_URL;
  }
}

const connectionString = getSanitizedDatabaseUrl();

// Configure pg pool with explicit session isolation for the proyectos_y_montajes schema
const pool = new Pool({ connectionString });

pool.on('connect', (client) => {
  client.query('SET search_path TO proyectos_y_montajes, public').catch((err) => {
    console.error('[PostgreSQL Pool] Error setting search_path:', err);
  });
});

const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Next.js uses an edge runtime or dev reloads which can instantiate multiple Prisma clients.
// This ensures a single instance.
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
