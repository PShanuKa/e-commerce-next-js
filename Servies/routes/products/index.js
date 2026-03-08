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
        required: ["name", "price", "stock_qty", "category_id"],
        properties: {
          name: { type: "string", minLength: 1 },
          description: { type: "string" },
          price: { type: "number", minimum: 0.01 },
          original_price: { type: "number", minimum: 0 },
          stock_qty: { type: "integer", minimum: 0 },
          category_id: { type: "integer", minimum: 1 },
          brand: { type: "string" },
          badge: { type: "string" },
          availability: {
            type: "string",
            enum: ["in_stock", "ships_2_3_days", "pre_order"],
          },
          images: { type: "array", items: { type: "string" } },
        },
        errorMessage: {
          required: {
            name: "Product name is required",
            price: "Price is required",
            stock_qty: "Stock quantity is required",
            category_id: "Category is required",
          },
          properties: {
            name: "Product name cannot be empty",
            price: "Price must be at least 0.01",
            stock_qty: "Stock quantity must be a non-negative integer",
            category_id: "Please select a valid category",
          },
        },
      },
    },
    preHandler: [fastify.authenticateAdmin],
    handler: handler.createProduct,
  });

  // PUT /api/products/:id
  fastify.put("/:id", {
    schema: {
      tags: ["Products"],
      summary: "Update product (Admin)",
      params: {
        type: "object",
        properties: { id: { type: "integer" } },
      },
      body: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 1 },
          description: { type: "string" },
          price: { type: "number", minimum: 0.01 },
          original_price: { type: "number", minimum: 0 },
          stock_qty: { type: "integer", minimum: 0 },
          category_id: { type: "integer", minimum: 1 },
          brand: { type: "string" },
          badge: { type: "string" },
          availability: {
            type: "string",
            enum: ["in_stock", "ships_2_3_days", "pre_order"],
          },
          images: { type: "array", items: { type: "string" } },
          is_active: { type: "boolean" },
        },
        errorMessage: {
          properties: {
            name: "Product name cannot be empty",
            price: "Price must be at least 0.01",
            stock_qty: "Stock quantity must be a non-negative integer",
            category_id: "Please select a valid category",
          },
        },
      },
    },
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
