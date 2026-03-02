"use strict";

import "dotenv/config.js";
import buildApp from "./app.js";

import prisma from "./config/prisma.js";

const PORT = process.env.PORT || 3001;

const start = async () => {
  // Verify DB connection via Prisma
  try {
    await prisma.$connect();
    console.log("✅ PostgreSQL connected via Prisma");
  } catch (err) {
    console.error("❌ Prisma DB connection failed:", err.message);
    process.exit(1);
  }

  const app = await buildApp();

  try {
    await app.listen({ port: Number(PORT), host: "0.0.0.0" });
    console.log(`\n🚀 ShopLK API running on http://localhost:${PORT}`);
    console.log(`📚 Swagger Docs   → http://localhost:${PORT}/docs`);
    console.log(`❤️  Health Check  → http://localhost:${PORT}/health\n`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }

  // Graceful shutdown
  const shutdown = async () => {
    await prisma.$disconnect();
    await app.close();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

start();
