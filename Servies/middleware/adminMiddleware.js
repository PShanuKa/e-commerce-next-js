"use strict";

import { Unauthorized, Forbidden } from "../utils/errors.js";

/**
 * Admin authentication middleware
 * Verifies JWT and checks role === 'admin'
 */
const authenticateAdmin = async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    throw Unauthorized("Invalid or expired token.");
  }

  if (request.user.role !== "admin") {
    throw Forbidden("Admin access required.");
  }
};

export { authenticateAdmin };
