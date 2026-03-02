"use strict";

import prisma from "../../config/prisma.js";
import { NotFound } from "../../utils/errors.js";

const listCategories = async (request, reply) => {
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

const createCategory = async (request, reply) => {
  const { name, image_url, parent_id } = request.body;
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

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

const deleteCategory = async (request, reply) => {
  const { id } = request.params;
  await prisma.category.delete({ where: { id: Number(id) } }).catch(() => {
    throw NotFound("Category");
  });
  return { success: true, message: "Category deleted" };
};

export { listCategories,
  createCategory,
  updateCategory,
  deleteCategory, };
