"use strict";

/**
 * Custom error helpers for consistent API responses
 */

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}

const createError = (message, statusCode) => {
  const err = new AppError(message, statusCode);
  return err;
};

const NotFound = (resource = "Resource") =>
  createError(`${resource} not found`, 404);

const Unauthorized = (msg = "Unauthorized") => createError(msg, 401);
const Forbidden = (msg = "Access denied") => createError(msg, 403);
const BadRequest = (msg) => createError(msg, 400);
const Conflict = (msg) => createError(msg, 409);

export { AppError,
  createError,
  NotFound,
  Unauthorized,
  Forbidden,
  BadRequest,
  Conflict, };
