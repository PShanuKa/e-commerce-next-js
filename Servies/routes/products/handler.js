"use strict";

import prisma from "../../config/prisma.js";
import { NotFound } from "../../utils/errors.js";

const VALID_AVAILABILITY = ["in_stock", "ships_2_3_days", "pre_order"];

// ── List products (filter + search + paginate + availability) ────────────────
const listProducts = async (request, reply) => {
  const {
    page = 1,
    limit = 16,
    category,
    search,
    sort = "created_at",
    minPrice,
    maxPrice,
    availability,
  } = request.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where = {
    isActive: true,
    ...(category && { category: { slug: category } }),
    ...(availability &&
      VALID_AVAILABILITY.includes(availability) && { availability }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...(minPrice && { price: { gte: Number(minPrice) } }),
    ...(maxPrice && {
      price: {
        ...(minPrice && { gte: Number(minPrice) }),
        lte: Number(maxPrice),
      },
    }),
  };

  const orderBy =
    sort === "price_asc"
      ? { price: "asc" }
      : sort === "price_desc"
        ? { price: "desc" }
        : { createdAt: "desc" };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy,
      include: {
        category: { select: { name: true, slug: true } },
        images: {
          orderBy: { sortOrder: "asc" },
          take: 1,
          select: { url: true },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  const formatted = products.map((p) => ({
    ...p,
    price: Number(p.price),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
    category_name: p.category?.name ?? null,
    category_slug: p.category?.slug ?? null,
    image: p.images[0]?.url ?? null,
    category: undefined,
    images: undefined,
  }));

  return {
    success: true,
    products: formatted,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
  };
};

// ── List ALL products for admin (incl inactive) ──────────────────────────────
const listAdminProducts = async (request, reply) => {
  const { page = 1, limit = 20, search, category } = request.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where = {
    ...(category && { category: { slug: category } }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { name: true, slug: true } },
        images: {
          orderBy: { sortOrder: "asc" },
          take: 1,
          select: { url: true },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  const formatted = products.map((p) => ({
    ...p,
    price: Number(p.price),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
    category_name: p.category?.name ?? null,
    category_slug: p.category?.slug ?? null,
    image: p.images[0]?.url ?? null,
    category: undefined,
    images: undefined,
  }));

  return {
    success: true,
    products: formatted,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
  };
};

// ── Get single product ────────────────────────────────────────────────────────
const getProduct = async (request, reply) => {
  const { id } = request.params;

  const product = await prisma.product.findFirst({
    where: { id: Number(id), isActive: true },
    include: {
      category: { select: { name: true, slug: true } },
      images: { orderBy: { sortOrder: "asc" }, select: { url: true } },
    },
  });

  if (!product) throw NotFound("Product");

  return {
    success: true,
    product: {
      ...product,
      price: Number(product.price),
      originalPrice: product.originalPrice
        ? Number(product.originalPrice)
        : null,
      category_name: product.category?.name,
      category_slug: product.category?.slug,
      images: product.images.map((i) => i.url),
      category: undefined,
    },
  };
};

// ── Create product (admin) ────────────────────────────────────────────────────
const createProduct = async (request, reply) => {
  const {
    name,
    description,
    price,
    original_price,
    stock_qty,
    category_id,
    brand,
    badge,
    images = [],
    availability = "in_stock",
  } = request.body;

  const slug =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    "-" +
    Date.now();

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price: Number(price),
      originalPrice: original_price ? Number(original_price) : null,
      stockQty: Number(stock_qty) || 0,
      categoryId: category_id || null,
      brand: brand || null,
      badge: badge || null,
      availability: VALID_AVAILABILITY.includes(availability)
        ? availability
        : "in_stock",
      images: { create: images.map((url, i) => ({ url, sortOrder: i })) },
    },
    include: { images: true, category: { select: { name: true, slug: true } } },
  });

  return reply.status(201).send({ success: true, product });
};

// ── Update product (admin) ────────────────────────────────────────────────────
const updateProduct = async (request, reply) => {
  const { id } = request.params;
  const {
    name,
    description,
    price,
    original_price,
    stock_qty,
    category_id,
    brand,
    badge,
    is_active,
    images,
    availability,
  } = request.body;

  const product = await prisma.product
    .update({
      where: { id: Number(id) },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: Number(price) }),
        ...(original_price !== undefined && {
          originalPrice: Number(original_price),
        }),
        ...(stock_qty !== undefined && { stockQty: Number(stock_qty) }),
        ...(category_id !== undefined && { categoryId: category_id }),
        ...(brand !== undefined && { brand }),
        ...(badge !== undefined && { badge }),
        ...(is_active !== undefined && { isActive: is_active }),
        ...(availability &&
          VALID_AVAILABILITY.includes(availability) && { availability }),
        ...(images && {
          images: {
            deleteMany: {},
            create: images.map((url, i) => ({ url, sortOrder: i })),
          },
        }),
      },
      include: {
        images: true,
        category: { select: { name: true, slug: true } },
      },
    })
    .catch(() => {
      throw NotFound("Product");
    });

  return { success: true, product };
};

// ── Soft-delete product (admin) ───────────────────────────────────────────────
const deleteProduct = async (request, reply) => {
  const { id } = request.params;
  await prisma.product
    .update({ where: { id: Number(id) }, data: { isActive: false } })
    .catch(() => {
      throw NotFound("Product");
    });
  return { success: true, message: "Product deleted" };
};

export {
  listProducts,
  listAdminProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
