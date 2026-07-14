import "server-only";
import { PrismaClient } from "@prisma/client";

/**
 * Reusable, server-only Prisma client. A single instance is shared across hot
 * reloads in development to avoid exhausting MySQL connections.
 * NEVER import this in a Client Component.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
