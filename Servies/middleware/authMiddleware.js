"use strict";

import { Unauthorized } from "../utils/errors.js";

/**
 * Customer JWT authentication middleware
 * Usage: { preHandler: [request.server.authenticate] }
 */
const authenticate = async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    throw Unauthorized("Invalid or expired token. Please login again.");
  }
};

export { authenticate };
