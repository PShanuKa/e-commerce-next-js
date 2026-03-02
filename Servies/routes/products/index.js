"use strict";

import * as handler from "./handler.js";

export default async function productsRoutes(fastify) {;
  // GET /api/products
  fastify.get("/", {
    schema: {
      tags: ["Products"],
      summary: "List all products with filters",
      querystring: {
        type: "object",
        properties: {
          page: { type: "integer", default: 1 },
          limit: { type: "integer", default: 16 },
          category: { type: "string" },
          search: { type: "string" },
          sort: {
            type: "string",
            enum: ["price_asc", "price_desc", "rating", "created_at"],
          },
          minPrice: { type: "number" },
          maxPrice: { type: "number" },
        },
      },
    },
    handler: handler.listProducts,
  });

  // GET /api/products/:id
  fastify.get("/:id", {
    schema: { tags: ["Products"], summary: "Get single product" },
    handler: handler.getProduct,
  });

  // POST /api/products — Admin only
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
          images: { type: "array", items: { type: "string" } },
        },
      },
    },
    preHandler: [fastify.authenticateAdmin],
    handler: handler.createProduct,
  });

  // PUT /api/products/:id — Admin only
  fastify.put("/:id", {
    schema: { tags: ["Products"], summary: "Update product (Admin)" },
    preHandler: [fastify.authenticateAdmin],
    handler: handler.updateProduct,
  });

  // DELETE /api/products/:id — Admin only
  fastify.delete("/:id", {
    schema: { tags: ["Products"], summary: "Delete product (Admin)" },
    preHandler: [fastify.authenticateAdmin],
    handler: handler.deleteProduct,
  });
};
