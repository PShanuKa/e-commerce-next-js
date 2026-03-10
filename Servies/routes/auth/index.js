import * as handler from "./handler.js";

export default async function authRoutes(fastify) {
  // POST /api/auth/register
  fastify.post("/register", {
    schema: {
      tags: ["Auth"],
      summary: "Customer registration",
      body: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", minLength: 2, maxLength: 120 },
          email: { type: "string", format: "email" },
          phone: { type: "string" },
          password: { type: "string", minLength: 6 },
        },
      },
    },
    handler: handler.register,
  });

  // POST /api/auth/login
  fastify.post("/login", {
    schema: {
      tags: ["Auth"],
      summary: "Customer login",
      body: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string" },
        },
      },
    },
    handler: handler.login,
  });

  // POST /api/auth/logout
  fastify.post("/logout", {
    schema: { tags: ["Auth"], summary: "Logout" },
    preHandler: [fastify.authenticate],
    handler: handler.logout,
  });

  // GET /api/auth/me
  fastify.get("/me", {
    schema: { tags: ["Auth"], summary: "Get current user" },
    preHandler: [fastify.authenticate],
    handler: handler.getMe,
  });

  // PUT /api/auth/me
  fastify.put("/me", {
    schema: {
      tags: ["Auth"],
      summary: "Update profile",
      body: {
        type: "object",
        required: ["name", "phone"],
        properties: {
          name: {
            type: "string",
            minLength: 2,
            errorMessage: {
              minLength: "Name must be at least 2 characters",
            },
          },
          phone: {
            type: "string",
            pattern: "^[0-9]{10}$",
            errorMessage: {
              pattern: "Phone must be a valid 10-digit number",
            },
          },
          avatar_url: { type: "string" },
        },
        errorMessage: {
          required: {
            name: "Name is required",
            phone: "Phone is required",
          },
        },
      },
    },
    preHandler: [fastify.authenticate],
    handler: handler.updateMe,
  });

  // PUT /api/auth/me/password
  fastify.put("/me/password", {
    schema: {
      tags: ["Auth"],
      summary: "Change password",
      body: {
        type: "object",
        required: ["currentPassword", "newPassword"],
        properties: {
          currentPassword: { type: "string" },
          newPassword: { type: "string", minLength: 8 },
        },
      },
    },
    preHandler: [fastify.authenticate],
    handler: handler.changePassword,
  });

  // POST /api/auth/forgot-password
  fastify.post("/forgot-password", {
    schema: {
      tags: ["Auth"],
      summary: "Request password reset email",
      body: {
        type: "object",
        required: ["email"],
        properties: {
          email: { type: "string", format: "email" },
        },
      },
    },
    handler: handler.forgotPassword,
  });

  // POST /api/auth/reset-password
  fastify.post("/reset-password", {
    schema: {
      tags: ["Auth"],
      summary: "Reset password using token",
      body: {
        type: "object",
        required: ["token", "password"],
        properties: {
          token: { type: "string" },
          password: { type: "string", minLength: 8 },
        },
      },
    },
    handler: handler.resetPassword,
  });
}
