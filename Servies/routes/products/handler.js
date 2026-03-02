"use strict";

import prisma from "../../config/prisma.js";
import { NotFound } from "../../utils/errors.js";

// ── List products (filter + search + paginate) ─────
const listProducts = async (request, reply) => {
  const {
    page = 1,
    limit = 16,
    category,
    search,
    sort = "created_at",
    minPrice,
    maxPrice,
  } = request.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where = {
    isActive: true,
    ...(category && { category: { slug: category } }),
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
        reviews: { select: { rating: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  const formatted = products.map((p) => ({
    ...p,
    category_name: p.category?.name ?? null,
    category_slug: p.category?.slug ?? null,
    image: p.images[0]?.url ?? null,
    rating: p.reviews.length
      ? +(
          p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
        ).toFixed(1)
      : 0,
    review_count: p.reviews.length,
    category: undefined,
    images: undefined,
    reviews: undefined,
  }));

  return {
    success: true,
    products: formatted,
    meta: { total, page: Number(page), limit: Number(limit) },
  };
};

// ── Get single product ────────────────────────────
const getProduct = async (request, reply) => {
  const { id } = request.params;

  const product = await prisma.product.findFirst({
    where: { id: Number(id), isActive: true },
    include: {
      category: { select: { name: true, slug: true } },
      images: { orderBy: { sortOrder: "asc" }, select: { url: true } },
      reviews: { select: { rating: true } },
    },
  });

  if (!product) throw NotFound("Product");

  return {
    success: true,
    product: {
      ...product,
      category_name: product.category?.name,
      category_slug: product.category?.slug,
      images: product.images.map((i) => i.url),
      rating: product.reviews.length
        ? +(
            product.reviews.reduce((s, r) => s + r.rating, 0) /
            product.reviews.length
          ).toFixed(1)
        : 0,
      review_count: product.reviews.length,
      category: undefined,
      reviews: undefined,
    },
  };
};

// ── Create product (admin) ────────────────────────
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
      images: {
        create: images.map((url, i) => ({ url, sortOrder: i })),
      },
    },
    include: { images: true },
  });

  return reply.status(201).send({ success: true, product });
};

// ── Update product (admin) ────────────────────────
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
        ...(images && {
          images: {
            deleteMany: {},
            create: images.map((url, i) => ({ url, sortOrder: i })),
          },
        }),
      },
      include: { images: true },
    })
    .catch(() => {
      throw NotFound("Product");
    });

  return { success: true, product };
};

// ── Delete product (admin) ────────────────────────
const deleteProduct = async (request, reply) => {
  const { id } = request.params;
  await prisma.product
    .update({ where: { id: Number(id) }, data: { isActive: false } })
    .catch(() => {
      throw NotFound("Product");
    });
  return { success: true, message: "Product deleted" };
};

export { listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct, };
