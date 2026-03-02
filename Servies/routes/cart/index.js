"use strict";

import * as handler from "./handler.js";

export default async function cartRoutes(fastify) {;
  const auth = { preHandler: [fastify.authenticate] };

  fastify.get("/", {
    ...auth,
    schema: { tags: ["Cart"], summary: "Get my cart" },
    handler: handler.getCart,
  });
  fastify.post("/", {
    ...auth,
    schema: {
      tags: ["Cart"],
      summary: "Add item to cart",
      body: {
        type: "object",
        required: ["product_id"],
        properties: {
          product_id: { type: "integer" },
          quantity: { type: "integer", default: 1 },
          variant: { type: "string" },
        },
      },
    },
    handler: handler.addToCart,
  });
  fastify.put("/:productId", {
    ...auth,
    schema: {
      tags: ["Cart"],
      summary: "Update cart item qty",
      body: {
        type: "object",
        required: ["quantity"],
        properties: { quantity: { type: "integer", minimum: 1 } },
      },
    },
    handler: handler.updateCartItem,
  });
  fastify.delete("/clear", {
    ...auth,
    schema: { tags: ["Cart"], summary: "Clear entire cart" },
    handler: handler.clearCart,
  });
  fastify.delete("/:productId", {
    ...auth,
    schema: { tags: ["Cart"], summary: "Remove item from cart" },
    handler: handler.removeFromCart,
  });
};
