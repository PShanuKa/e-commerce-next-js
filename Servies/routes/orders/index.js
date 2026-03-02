"use strict";

import * as handler from "./handler.js";

export default async function ordersRoutes(fastify) {;
  const auth = { preHandler: [fastify.authenticate] };

  fastify.post("/", {
    ...auth,
    schema: {
      tags: ["Orders"],
      summary: "Place order from cart",
      body: {
        type: "object",
        properties: {
          address_id: { type: "integer" },
          payment_method: { type: "string", enum: ["cod", "card", "bank"] },
          coupon_discount: { type: "number" },
          notes: { type: "string" },
        },
      },
    },
    handler: handler.placeOrder,
  });
  fastify.get("/", {
    ...auth,
    schema: { tags: ["Orders"], summary: "My orders" },
    handler: handler.listMyOrders,
  });
  fastify.get("/:id", {
    ...auth,
    schema: { tags: ["Orders"], summary: "Order detail" },
    handler: handler.getOrder,
  });
  fastify.put("/:id/cancel", {
    ...auth,
    schema: { tags: ["Orders"], summary: "Cancel an order" },
    handler: handler.cancelOrder,
  });
};
