"use strict";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import prisma from "../../config/prisma.js";
import emailService from "../../utils/email.js";
import {
  BadRequest,
  Unauthorized,
  Conflict,
  NotFound,
} from "../../utils/errors.js";

// ── Register ──────────────────────────────────────
const register = async (request, reply) => {
  const { name, email, phone, password } = request.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw Conflict("Email already registered.");

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, phone: phone || null, passwordHash, role: "customer" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });

  const token = await reply.jwtSign({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  reply
    .setCookie("token", token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })
    .status(201)
    .send({ success: true, message: "Registration successful", token, user });
};

// ── Login ─────────────────────────────────────────
const login = async (request, reply) => {
  const { email, password } = request.body;

  const user = await prisma.user.findFirst({
    where: { email, isActive: true },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      passwordHash: true,
      avatarUrl: true,
    },
  });

  if (!user) throw Unauthorized("Invalid email or password.");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw Unauthorized("Invalid email or password.");

  const token = await reply.jwtSign({
    id: user.id,
    email: user.email,
    role: user.role,
  });
  const { passwordHash, ...safeUser } = user;

  reply
    // .setCookie("token", token, {
    //   path: "/",
    //   httpOnly: true,
    //   sameSite: "lax",
    //   maxAge: 60 * 60 * 24 * 7,
    // })
    .send({
      success: true,
      message: "Login successful",
      token,
      user: safeUser,
    });
};

// ── Logout ────────────────────────────────────────
const logout = async (request, reply) => {
  reply.clearCookie("token", { path: "/" });
  return { success: true, message: "Logged out successfully" };
};

// ── Get current user ──────────────────────────────
const getMe = async (request, reply) => {
  const user = await prisma.user.findUnique({
    where: { id: request.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      avatarUrl: true,
      createdAt: true,
    },
  });
  if (!user) throw NotFound("User");
  return { success: true, user };
};

// ── Update profile ────────────────────────────────
const updateMe = async (request, reply) => {
  const { name, phone, avatar_url } = request.body;
  const user = await prisma.user.update({
    where: { id: request.user.id },
    data: {
      ...(name && { name }),
      ...(phone !== undefined && { phone }),
      ...(avatar_url !== undefined && { avatarUrl: avatar_url }),
    },
    select: { id: true, name: true, email: true, phone: true, avatarUrl: true },
  });
  return { success: true, user };
};

// ── Change password ───────────────────────────────
const changePassword = async (request, reply) => {
  const { currentPassword, newPassword } = request.body;

  const user = await prisma.user.findUnique({
    where: { id: request.user.id },
    select: { passwordHash: true },
  });
  if (!user) throw NotFound("User");

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) throw BadRequest("Current password is incorrect.");
  if (newPassword.length < 8)
    throw BadRequest("New password must be at least 8 characters.");

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: request.user.id },
    data: { passwordHash },
  });

  return { success: true, message: "Password changed successfully" };
};

// ── Forgot Password ───────────────────────────────
const forgotPassword = async (request, reply) => {
  const { email } = request.body;

  // Always respond with success to prevent email enumeration
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true },
  });

  if (user) {
    // Invalidate any existing unused tokens for this user
    await prisma.passwordResetToken.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    });

    // Generate a secure random token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: rawToken,
        expiresAt,
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${rawToken}`;

    try {
      await emailService.sendPasswordResetEmail(
        user.email,
        user.name,
        resetUrl,
      );
    } catch (emailErr) {
      request.log.error(
        { err: emailErr },
        "Failed to send password reset email",
      );
    }
  }

  // Always return success (security best practice)
  return {
    success: true,
    message:
      "If that email is registered, you will receive a reset link shortly.",
  };
};

// ── Reset Password ────────────────────────────────
const resetPassword = async (request, reply) => {
  const { token, password } = request.body;

  if (!token) throw BadRequest("Reset token is required.");
  if (!password || password.length < 8)
    throw BadRequest("Password must be at least 8 characters.");

  const resetRecord = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: { select: { id: true } } },
  });

  if (!resetRecord) throw BadRequest("Invalid or expired reset link.");
  if (resetRecord.used)
    throw BadRequest("This reset link has already been used.");
  if (new Date() > resetRecord.expiresAt)
    throw BadRequest("This reset link has expired. Please request a new one.");

  const passwordHash = await bcrypt.hash(password, 10);

  // Update password and mark token as used in a transaction
  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetRecord.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetRecord.id },
      data: { used: true },
    }),
  ]);

  return { success: true, message: "Password has been reset successfully." };
};

export {
  register,
  login,
  logout,
  getMe,
  updateMe,
  changePassword,
  forgotPassword,
  resetPassword,
};
