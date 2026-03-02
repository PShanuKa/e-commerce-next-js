"use strict";

import * as handler from "./handler.js";

export default async function adminRoutes(fastify) {;
  const admin = { preHandler: [fastify.authenticateAdmin] };

  fastify.get("/stats", {
    ...admin,
    schema: { tags: ["Admin"], summary: "Dashboard stats" },
    handler: handler.getDashboardStats,
  });
  fastify.get("/orders", {
    ...admin,
    schema: {
      tags: ["Admin"],
      summary: "All orders (with filter)",
      querystring: {
        type: "object",
        properties: {
          status: { type: "string" },
          page: { type: "integer" },
          limit: { type: "integer" },
        },
      },
    },
    handler: handler.listAllOrders,
  });
  fastify.put("/orders/:id/status", {
    ...admin,
    schema: {
      tags: ["Admin"],
      summary: "Update order status",
      body: {
        type: "object",
        required: ["status"],
        properties: {
          status: {
            type: "string",
            enum: [
              "pending",
              "processing",
              "shipped",
              "delivered",
              "cancelled",
            ],
          },
        },
      },
    },
    handler: handler.updateOrderStatus,
  });
  fastify.get("/users", {
    ...admin,
    schema: { tags: ["Admin"], summary: "All customers" },
    handler: handler.listAllUsers,
  });
};
