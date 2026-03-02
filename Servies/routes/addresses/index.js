"use strict";

import * as handler from "./handler.js";

export default async function addressRoutes(fastify) {;
  const auth = { preHandler: [fastify.authenticate] };
  fastify.get("/", {
    ...auth,
    schema: { tags: ["Addresses"], summary: "My addresses" },
    handler: handler.listAddresses,
  });
  fastify.post("/", {
    ...auth,
    schema: {
      tags: ["Addresses"],
      summary: "Add address",
      body: {
        type: "object",
        required: ["name", "phone", "address_line1", "city"],
        properties: {
          name: { type: "string" },
          phone: { type: "string" },
          address_line1: { type: "string" },
          address_line2: { type: "string" },
          city: { type: "string" },
          postal_code: { type: "string" },
          province: { type: "string" },
          is_default: { type: "boolean" },
        },
      },
    },
    handler: handler.addAddress,
  });
  fastify.put("/:id", {
    ...auth,
    schema: { tags: ["Addresses"], summary: "Update address" },
    handler: handler.updateAddress,
  });
  fastify.delete("/:id", {
    ...auth,
    schema: { tags: ["Addresses"], summary: "Delete address" },
    handler: handler.deleteAddress,
  });
  fastify.put("/:id/default", {
    ...auth,
    schema: { tags: ["Addresses"], summary: "Set default address" },
    handler: handler.setDefault,
  });
};
