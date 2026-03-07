"use strict";

import * as handler from "./handler.js";

export default async function paymentsRoutes(fastify) {
  const admin = { preHandler: [fastify.authenticateAdmin] };

  fastify.get("/", {
    ...admin,
    schema: {
      tags: ["Payments"],
      summary: "List all payments (Admin only)",
      querystring: {
        type: "object",
        properties: {
          status: { type: "string" },
          page: { type: "integer" },
          limit: { type: "integer" },
        },
      },
    },
    handler: handler.listAllPayments,
  });

  fastify.get("/:id", {
    ...admin,
    schema: {
      tags: ["Payments"],
      summary: "Get payment details (Admin only)",
      params: {
        type: "object",
        properties: { id: { type: "integer" } },
      },
    },
    handler: handler.getPaymentById,
  });
}
