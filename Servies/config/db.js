"use strict";

import { Pool } from "pg";
import "dotenv/config.js";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL error:", err);
});

// Test connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ PostgreSQL connection failed:", err.message);
  } else {
    console.log("✅ PostgreSQL connected successfully");
    release();
  }
});

export default pool;
