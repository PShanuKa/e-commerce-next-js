"use strict";

import * as handler from "./handler.js";

export default async function addressRoutes(fastify) {
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
          name: {
            type: "string",
            minLength: 3,
            errorMessage: {
              minLength: "Name must be at least 3 characters",
            },
          },
          phone: {
            type: "string",
            pattern: "^[0-9]{10}$",
            errorMessage: {
              pattern: "Phone must be a valid 10-digit number",
            },
          },
          address_line1: {
            type: "string",
            minLength: 5,
            errorMessage: {
              minLength: "Address must be at least 5 characters",
            },
          },
          address_line2: { type: "string" },
          city: {
            type: "string",
            minLength: 2,
            errorMessage: {
              minLength: "City must be at least 2 characters",
            },
          },
          postal_code: {
            type: "string",
            pattern: "^([0-9]{5})?$",
            errorMessage: {
              pattern: "Postal code must be 5 digits",
            },
          },
          province: { type: "string" },
          is_default: { type: "boolean" },
        },
        errorMessage: {
          required: {
            name: "Full Name is required",
            phone: "Phone number is required",
            address_line1: "Address is required",
            city: "City is required",
          },
        },
      },
    },
    handler: handler.addAddress,
  });
  fastify.put("/:id", {
    ...auth,
    schema: {
      tags: ["Addresses"],
      summary: "Update address",
      params: {
        type: "object",
        properties: {
          id: { type: "integer" },
        },
      },
      body: {
        type: "object",
        properties: {
          name: {
            type: "string",
            minLength: 3,
            errorMessage: {
              minLength: "Name must be at least 3 characters",
            },
          },
          phone: {
            type: "string",
            pattern: "^[0-9]{10}$",
            errorMessage: {
              pattern: "Phone must be a valid 10-digit number",
            },
          },
          address_line1: {
            type: "string",
            minLength: 5,
            errorMessage: {
              minLength: "Address must be at least 5 characters",
            },
          },
          address_line2: { type: "string" },
          city: {
            type: "string",
            minLength: 2,
            errorMessage: {
              minLength: "City must be at least 2 characters",
            },
          },
          postal_code: {
            type: "string",
            pattern: "^([0-9]{5})?$",
            errorMessage: {
              pattern: "Postal code must be 5 digits",
            },
          },
          province: { type: "string" },
          is_default: { type: "boolean" },
        },
      },
    },
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
}
