import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
  connectionUrl: string | undefined;
};

function createPrismaClient(): PrismaClient {
  // Use DIRECT_URL for the Prisma adapter (bypasses PgBouncer which has compatibility issues)
  // Fall back to DATABASE_URL if DIRECT_URL is not set
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL or DIRECT_URL environment variable is not set");
  }

  const pool = new Pool({
    connectionString,
    connectionTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    max: 10,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: ["query"],
  });
}

// Check if we need to recreate the client (connection string changed)
const currentConnectionUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (globalForPrisma.connectionUrl !== currentConnectionUrl) {
  // Connection URL changed, reset the cached client
  globalForPrisma.prisma = undefined;
  globalForPrisma.connectionUrl = currentConnectionUrl;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
