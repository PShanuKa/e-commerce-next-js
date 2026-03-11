"use strict";

import fastify from "fastify";
import ajvErrors from "ajv-errors";

import corsPlugin from "./plugins/cors.js";
import jwtPlugin from "./plugins/jwt.js";
import cookiePlugin from "./plugins/cookie.js";
import swaggerPlugin from "./plugins/swagger.js";
import formbody from "@fastify/formbody";

import authRoutes from "./routes/auth/index.js";
import productsRoutes from "./routes/products/index.js";
import categoriesRoutes from "./routes/categories/index.js";
import cartRoutes from "./routes/cart/index.js";
import ordersRoutes from "./routes/orders/index.js";
import wishlistRoutes from "./routes/wishlist/index.js";
import addressesRoutes from "./routes/addresses/index.js";
import reviewsRoutes from "./routes/reviews/index.js";
import adminRoutes from "./routes/admin/index.js";
import payhereRoutes from "./routes/payhere/index.js";
import paymentsRoutes from "./routes/payments/index.js";

async function buildApp() {
  const app = fastify({
    logger: process.env.NODE_ENV !== "production",
    ajv: {
      customOptions: {
        allErrors: true,
      },
      plugins: [ajvErrors],
    },
  });

  console.log('test')

  // ── Plugins ───────────────────────────────────────
  await app.register(formbody); // Parses application/x-www-form-urlencoded (PayHere webhook)
  await app.register(corsPlugin);
  await app.register(jwtPlugin);
  await app.register(cookiePlugin);
  await app.register(swaggerPlugin);

  // ── Health ────────────────────────────────────────
  app.get("/api/health", async () => (
    console.log('test'),
    
    {
    status: "ok",
    service: "Sellora API",
    timestamp: new Date().toISOString(),
  }));

  // ── Global Error Handler ──────────────────────────
  // IMPORTANT: Register before routes to ensure inheritance
  app.setErrorHandler((error, request, reply) => {
    // Validation Errors (Fastify / AJV)
    if (error.validation) {
      const errors = {};
      error.validation.forEach((err) => {
        // Find field name: prioritizes standard AJV sources
        let field =
          err.params?.missingProperty ||
          (err.instancePath ? err.instancePath.replace(/^\//, "") : null);

        // Fallback for ajv-errors: it sometimes aggregates errors or doesn't set instancePath
        // effectively on required errors. If field is still null/empty, check params.errors
        if (!field && err.params?.errors) {
          const innerErr = err.params.errors[0];
          field =
            innerErr.params?.missingProperty ||
            (innerErr.instancePath
              ? innerErr.instancePath.replace(/^\//, "")
              : null);
        }

        if (field) {
          errors[field] = err.message;
        }
      });

      return reply.status(400).send({
        success: false,
        error: "Validation Error",
        message: "Please check the highlighted fields",
        details: errors,
      });
    }

    // Other App Errors
    const statusCode = error.statusCode || 500;
    const message = statusCode < 500 ? error.message : "Internal Server Error";

    if (statusCode >= 500) {
      app.log.error(error);
    }

    return reply.status(statusCode).send({
      success: false,
      error: message,
    });
  });

  // ── Routes ────────────────────────────────────────
  await app.register(authRoutes, { prefix: "/api/auth" });
  await app.register(productsRoutes, { prefix: "/api/products" });
  await app.register(categoriesRoutes, { prefix: "/api/categories" });
  await app.register(cartRoutes, { prefix: "/api/cart" });
  await app.register(ordersRoutes, { prefix: "/api/orders" });
  await app.register(wishlistRoutes, { prefix: "/api/wishlist" });
  await app.register(addressesRoutes, { prefix: "/api/addresses" });
  await app.register(reviewsRoutes, { prefix: "/api/reviews" });
  await app.register(adminRoutes, { prefix: "/api/admin" });
  await app.register(payhereRoutes, { prefix: "/api/payhere" });
  await app.register(paymentsRoutes, { prefix: "/api/payments" });

  // ── 404 Handler ───────────────────────────────────
  app.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      success: false,
      error: "Not Found",
      message: `Route ${request.method} ${request.url} not found`,
    });
  });

  return app;
}

export default buildApp;
