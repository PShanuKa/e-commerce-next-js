"use strict";

import * as handler from "./handler.js";

export default async function wishlistRoutes(fastify) {;
  const auth = { preHandler: [fastify.authenticate] };
  fastify.get("/", {
    ...auth,
    schema: { tags: ["Wishlist"], summary: "Get my wishlist" },
    handler: handler.getWishlist,
  });
  fastify.post("/:productId", {
    ...auth,
    schema: { tags: ["Wishlist"], summary: "Add to wishlist" },
    handler: handler.addToWishlist,
  });
  fastify.delete("/:productId", {
    ...auth,
    schema: { tags: ["Wishlist"], summary: "Remove from wishlist" },
    handler: handler.removeFromWishlist,
  });
};
