"use strict";

import { initPayment, notifyPayment } from "./handler.js";

export default async function (fastify, opts) {
  fastify.post("/notify", notifyPayment);

  // All other routes requires JWT authentication
  fastify.register(async (instance) => {
    instance.addHook("preHandler", instance.authenticate);
    instance.post("/init", initPayment);
  });
}
