"use strict";

import bcrypt from "bcryptjs";
import prisma from "../../config/prisma.js";
import { BadRequest,
  Unauthorized,
  Conflict,
  NotFound, } from "../../utils/errors.js";

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
    .setCookie("token", token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })
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

export { register, login, logout, getMe, updateMe, changePassword };
