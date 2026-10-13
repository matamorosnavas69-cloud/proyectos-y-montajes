import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/mydb";

// Configure pg pool with explicit session isolation for the proyectos_y_montajes schema
const pool = new Pool({ connectionString });

pool.on("connect", (client) => {
  client.query("SET search_path TO proyectos_y_montajes, public").catch((err) => {
    console.error("[PostgreSQL Pool] Error setting search_path:", err);
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
