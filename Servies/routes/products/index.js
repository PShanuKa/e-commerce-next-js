"use strict";

import * as handler from "./handler.js";

export default async function productsRoutes(fastify) {
  // GET /api/products — public with filters
  fastify.get("/", {
    schema: {
      tags: ["Products"],
      summary: "List products with filters (public)",
      querystring: {
        type: "object",
        properties: {
          page: { type: "integer", default: 1 },
          limit: { type: "integer", default: 16 },
          category: { type: "string" },
          search: { type: "string" },
          sort: {
            type: "string",
            enum: ["price_asc", "price_desc", "created_at"],
          },
          minPrice: { type: "number" },
          maxPrice: { type: "number" },
          availability: {
            type: "string",
            enum: ["in_stock", "ships_2_3_days", "pre_order"],
          },
        },
      },
    },
    handler: handler.listProducts,
  });

  // GET /api/products/admin/all — admin all products
  fastify.get("/admin/all", {
    schema: {
      tags: ["Products"],
      summary: "List all products incl inactive (Admin)",
      querystring: {
        type: "object",
        properties: {
          page: { type: "integer", default: 1 },
          limit: { type: "integer", default: 20 },
          search: { type: "string" },
          category: { type: "string" },
        },
      },
    },
    preHandler: [fastify.authenticateAdmin],
    handler: handler.listAdminProducts,
  });

  // GET /api/products/:id
  fastify.get("/:id", {
    schema: { tags: ["Products"], summary: "Get single product" },
    handler: handler.getProduct,
  });

  // POST /api/products
  fastify.post("/", {
    schema: {
      tags: ["Products"],
      summary: "Create product (Admin)",
      body: {
        type: "object",
        required: ["name", "price", "stock_qty"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          price: { type: "number" },
          original_price: { type: "number" },
          stock_qty: { type: "integer" },
          category_id: { type: "integer" },
          brand: { type: "string" },
          badge: { type: "string" },
          availability: {
            type: "string",
            enum: ["in_stock", "ships_2_3_days", "pre_order"],
          },
          images: { type: "array", items: { type: "string" } },
        },
      },
    },
    preHandler: [fastify.authenticateAdmin],
    handler: handler.createProduct,
  });

  // PUT /api/products/:id
  fastify.put("/:id", {
    schema: { tags: ["Products"], summary: "Update product (Admin)" },
    preHandler: [fastify.authenticateAdmin],
    handler: handler.updateProduct,
  });

  // DELETE /api/products/:id — soft delete (isActive: false)
  fastify.delete("/:id", {
    schema: { tags: ["Products"], summary: "Soft-delete product (Admin)" },
    preHandler: [fastify.authenticateAdmin],
    handler: handler.deleteProduct,
  });
}
