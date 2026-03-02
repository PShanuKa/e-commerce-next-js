"use strict";

import * as handler from "./handler.js";

export default async function categoriesRoutes(fastify) {;
  fastify.get("/", {
    schema: { tags: ["Categories"], summary: "List all categories" },
    handler: handler.listCategories,
  });
  fastify.post("/", {
    schema: {
      tags: ["Categories"],
      summary: "Create category (Admin)",
      body: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          image_url: { type: "string" },
          parent_id: { type: "integer" },
        },
      },
    },
    preHandler: [fastify.authenticateAdmin],
    handler: handler.createCategory,
  });
  fastify.put("/:id", {
    schema: { tags: ["Categories"], summary: "Update category (Admin)" },
    preHandler: [fastify.authenticateAdmin],
    handler: handler.updateCategory,
  });
  fastify.delete("/:id", {
    schema: { tags: ["Categories"], summary: "Delete category (Admin)" },
    preHandler: [fastify.authenticateAdmin],
    handler: handler.deleteCategory,
  });
};
