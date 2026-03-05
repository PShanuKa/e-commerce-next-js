"use strict";

import fastify from "fastify";

import corsPlugin from "./plugins/cors.js";
import jwtPlugin from "./plugins/jwt.js";
import cookiePlugin from "./plugins/cookie.js";
import swaggerPlugin from "./plugins/swagger.js";

import authRoutes from "./routes/auth/index.js";
import productsRoutes from "./routes/products/index.js";
import categoriesRoutes from "./routes/categories/index.js";
import cartRoutes from "./routes/cart/index.js";
import ordersRoutes from "./routes/orders/index.js";
import wishlistRoutes from "./routes/wishlist/index.js";
import addressesRoutes from "./routes/addresses/index.js";
import reviewsRoutes from "./routes/reviews/index.js";
import adminRoutes from "./routes/admin/index.js";

async function buildApp() {
  const app = fastify({
    logger: process.env.NODE_ENV !== "production",
  });

  // ── Plugins ───────────────────────────────────────
  await app.register(corsPlugin);
  await app.register(jwtPlugin);
  await app.register(cookiePlugin);
  await app.register(swaggerPlugin);

  // ── Health ────────────────────────────────────────
  app.get("/api/health", async () => ({
    status: "ok",
    service: "ShopLK API",
    timestamp: new Date().toISOString(),
  }));

  // ── Routes ────────────────────────────────────────
  await app.register(authRoutes, { prefix: "/api/auth" });
  await app.register(productsRoutes, { prefix: "/api/products" });
  await app.register(categoriesRoutes, { prefix: "/api/categories" });
  await app.register(cartRoutes, { prefix: "/api/cart" });
  await app.register(ordersRoutes, { prefix: "/api/orders" });
  await app.register(wishlistRoutes, { prefix: "/api/wishlist" });
  await app.register(addressesRoutes, { prefix: "/api/addresses" });
  await app.register(reviewsRoutes, { prefix: "/api/reviews" });
  await app.register(adminRoutes,{ prefix: "/api/admin" });

  // ── Global Error Handler ──────────────────────────
  app.setErrorHandler((error, request, reply) => {
    if (error.validation) {
      return reply.status(400).send({
        success: false,
        error: "Validation Error",
        message: error.message,
        details: error.validation,
      });
    }
    const statusCode = error.statusCode || 500;
    const message = statusCode < 500 ? error.message : "Internal Server Error";
    app.log.error(error);
    return reply.status(statusCode).send({ success: false, error: message });
  });

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
