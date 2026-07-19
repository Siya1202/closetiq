import { PrismaClient } from "@prisma/client";

// Prevents hot-reload in dev from creating a new PrismaClient (and new DB
// connection pool) on every file save — reuses a single instance via a
// global, same pattern used in ai-todo-mono.

declare global {
  // eslint-disable-next-line no-var
  var __prisma__: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  global.__prisma__ ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.__prisma__ = prisma;
}

export * from "@prisma/client";
