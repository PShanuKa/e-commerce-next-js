"use strict";

import * as handler from "./handler.js";

export default async function reviewRoutes(fastify) {;
  fastify.get("/", {
    schema: {
      tags: ["Reviews"],
      summary: "Get product reviews + rating stats",
      querystring: {
        type: "object",
        required: ["productId"],
        properties: {
          productId: { type: "integer" },
          page: { type: "integer" },
          limit: { type: "integer" },
        },
      },
    },
    handler: handler.getReviews,
  });
  fastify.post("/", {
    preHandler: [fastify.authenticate],
    schema: {
      tags: ["Reviews"],
      summary: "Add or update a review",
      body: {
        type: "object",
        required: ["product_id", "rating"],
        properties: {
          product_id: { type: "integer" },
          rating: { type: "integer", minimum: 1, maximum: 5 },
          comment: { type: "string" },
        },
      },
    },
    handler: handler.addReview,
  });
  fastify.delete("/:id", {
    preHandler: [fastify.authenticate],
    schema: { tags: ["Reviews"], summary: "Delete own review" },
    handler: handler.deleteReview,
  });
};
