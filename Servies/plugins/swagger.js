"use strict";

import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

export default fp(async (fastify) => {;
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: "ShopLK E-Commerce API",
        description: "Fastify + PostgreSQL REST API for ShopLK",
        version: "1.0.0",
      },
      components: {
        securitySchemes: {
          bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: { docExpansion: "list", deepLinking: false },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });
});
