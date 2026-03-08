"use strict";

import * as handler from "./handler.js";

export default async function categoriesRoutes(fastify) {
  // ── Public ────────────────────────────────────────────────────────────────
  fastify.get("/", {
    schema: {
      tags: ["Categories"],
      summary: "List active categories (public)",
    },
    handler: handler.listCategories,
  });

  fastify.get("/:slug", {
    schema: { tags: ["Categories"], summary: "Get category by slug (public)" },
    handler: handler.getCategory,
  });

  // ── Admin ─────────────────────────────────────────────────────────────────
  fastify.get("/admin/all", {
    schema: {
      tags: ["Categories"],
      summary: "List all categories incl. deleted (Admin)",
    },
    preHandler: [fastify.authenticateAdmin],
    handler: handler.listAllCategories,
  });

  fastify.post("/", {
    schema: {
      tags: ["Categories"],
      summary: "Create category (Admin)",
      body: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", minLength: 1 },
          image_url: { type: "string" },
          parent_id: { type: "integer" },
        },
        errorMessage: {
          required: {
            name: "Category name is required",
          },
          properties: {
            name: "Category name cannot be empty",
          },
        },
      },
    },
    preHandler: [fastify.authenticateAdmin],
    handler: handler.createCategory,
  });

  fastify.put("/:id", {
    schema: {
      tags: ["Categories"],
      summary: "Update category (Admin)",
      params: {
        type: "object",
        properties: { id: { type: "integer" } },
      },
      body: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 1 },
          image_url: { type: "string" },
          parent_id: { type: "integer" },
        },
        errorMessage: {
          properties: {
            name: "Category name cannot be empty",
          },
        },
      },
    },
    preHandler: [fastify.authenticateAdmin],
    handler: handler.updateCategory,
  });

  // Soft delete
  fastify.delete("/:id", {
    schema: { tags: ["Categories"], summary: "Soft-delete category (Admin)" },
    preHandler: [fastify.authenticateAdmin],
    handler: handler.deleteCategory,
  });

  // Restore soft-deleted
  fastify.patch("/:id/restore", {
    schema: { tags: ["Categories"], summary: "Restore category (Admin)" },
    preHandler: [fastify.authenticateAdmin],
    handler: handler.restoreCategory,
  });
}
