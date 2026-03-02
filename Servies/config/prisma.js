"use strict";

import { PrismaClient } from "@prisma/client";

// Reuse a single Prisma Client instance across the app
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  errorFormat: "minimal",
});

export default prisma;
