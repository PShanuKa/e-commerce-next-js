"use strict";

import fp from "fastify-plugin";
import jwt from "@fastify/jwt";

export default fp(async (fastify) => {;
  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET || "sellora_super_secret_jwt_key_2025",
    sign: { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
    cookie: { cookieName: "token", signed: false },
  });

  // Decorate shorthand
  fastify.decorate("authenticate", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply
        .status(401)
        .send({ success: false, error: "Unauthorized. Please login." });
    }
  });

  fastify.decorate("authenticateAdmin", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      return reply.status(401).send({ success: false, error: "Unauthorized." });
    }
    if (request.user.role !== "admin") {
      return reply
        .status(403)
        .send({ success: false, error: "Admin access required." });
    }
  });
});
