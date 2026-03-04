"use strict";

import fp from "fastify-plugin";
import cors from "@fastify/cors";

export default fp(async (fastify) => {;
  await fastify.register(cors, {
    // origin: ["http://localhost:5173", "http://localhost:3000"],
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });
});
