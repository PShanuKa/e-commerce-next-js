"use strict";

import prisma from "../../config/prisma.js";
import { NotFound, Conflict } from "../../utils/errors.js";

// ── List active categories (public) ─────────────────────────────────────────
const listCategories = async (request, reply) => {
  const categories = await prisma.category.findMany({
    where: { isDeleted: false },
    orderBy: { name: "asc" },
    include: {
      _count: { select: { products: { where: { isActive: true } } } },
    },
  });

  const formatted = categories.map((c) => ({
    ...c,
    product_count: c._count.products,
    _count: undefined,
  }));

  return { success: true, categories: formatted };
};

// ── List ALL categories including soft-deleted (admin) ───────────────────────
const listAllCategories = async (request, reply) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { products: { where: { isActive: true } } } },
    },
  });

  const formatted = categories.map((c) => ({
    ...c,
    product_count: c._count.products,
    _count: undefined,
  }));

  return { success: true, categories: formatted };
};

// ── Get single category by slug (public) ─────────────────────────────────────
const getCategory = async (request, reply) => {
  const { slug } = request.params;
  const category = await prisma.category.findFirst({
    where: { slug, isDeleted: false },
    include: {
      _count: { select: { products: { where: { isActive: true } } } },
    },
  });
  if (!category) throw NotFound("Category");
  return { success: true, category };
};

// ── Create category (admin) ──────────────────────────────────────────────────
const createCategory = async (request, reply) => {
  const { name, image_url, parent_id } = request.body;
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Check for duplicate slug
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) throw Conflict("Category with this name already exists.");

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      imageUrl: image_url || null,
      parentId: parent_id || null,
    },
  });

  return reply.status(201).send({ success: true, category });
};

// ── Update category (admin) ──────────────────────────────────────────────────
const updateCategory = async (request, reply) => {
  const { id } = request.params;
  const { name, image_url, parent_id } = request.body;
  const slug = name
    ? name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    : undefined;

  const category = await prisma.category
    .update({
      where: { id: Number(id) },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(image_url !== undefined && { imageUrl: image_url }),
        ...(parent_id !== undefined && { parentId: parent_id }),
      },
    })
    .catch(() => {
      throw NotFound("Category");
    });

  return { success: true, category };
};

// ── Soft delete category (admin) isDeleted: true ─────────────────────────────
const deleteCategory = async (request, reply) => {
  const { id } = request.params;
  await prisma.category
    .update({ where: { id: Number(id) }, data: { isDeleted: true } })
    .catch(() => {
      throw NotFound("Category");
    });
  return { success: true, message: "Category deleted" };
};

// ── Restore soft-deleted category (admin) ────────────────────────────────────
const restoreCategory = async (request, reply) => {
  const { id } = request.params;
  const category = await prisma.category
    .update({ where: { id: Number(id) }, data: { isDeleted: false } })
    .catch(() => {
      throw NotFound("Category");
    });
  return { success: true, category };
};

export {
  listCategories,
  listAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  restoreCategory,
};
