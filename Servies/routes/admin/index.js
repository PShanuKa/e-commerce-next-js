"use strict";

import * as handler from "./handler.js";

export default async function adminRoutes(fastify) {
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
  fastify.get("/orders/:id", {
    ...admin,
    schema: {
      tags: ["Admin"],
      summary: "Get order details",
      params: {
        type: "object",
        properties: { id: { type: "integer" } },
      },
    },
    handler: handler.getOrderDetails,
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
  fastify.post("/users", {
    ...admin,
    schema: {
      tags: ["Admin"],
      summary: "Create customer",
      body: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          phone: { type: "string" },
          password: { type: "string", minLength: 6 },
        },
      },
    },
    handler: handler.createCustomer,
  });
  fastify.put("/users/:id", {
    ...admin,
    schema: {
      tags: ["Admin"],
      summary: "Update customer",
      params: {
        type: "object",
        properties: { id: { type: "integer" } },
      },
      body: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          phone: { type: "string" },
          role: { type: "string" },
          isActive: { type: "boolean" },
        },
      },
    },
    handler: handler.updateCustomer,
  });

  fastify.get("/users/:id", {
    ...admin,
    schema: {
      tags: ["Admin"],
      summary: "Get customer details",
      params: {
        type: "object",
        properties: { id: { type: "integer" } },
      },
    },
    handler: handler.getCustomerDetails,
  });
}
