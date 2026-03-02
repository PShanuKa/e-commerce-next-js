"use strict";

import prisma from "../../config/prisma.js";
import { NotFound } from "../../utils/errors.js";

const getWishlist = async (request, reply) => {
  const items = await prisma.wishlist.findMany({
    where: { userId: request.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          originalPrice: true,
          badge: true,
          images: {
            orderBy: { sortOrder: "asc" },
            take: 1,
            select: { url: true },
          },
        },
      },
    },
  });

  const formatted = items.map((w) => ({
    id: w.id,
    created_at: w.createdAt,
    product_id: w.product.id,
    name: w.product.name,
    price: w.product.price,
    original_price: w.product.originalPrice,
    badge: w.product.badge,
    image: w.product.images[0]?.url ?? null,
  }));

  return { success: true, wishlist: formatted };
};

const addToWishlist = async (request, reply) => {
  const { productId } = request.params;
  await prisma.wishlist.upsert({
    where: {
      userId_productId: {
        userId: request.user.id,
        productId: Number(productId),
      },
    },
    create: { userId: request.user.id, productId: Number(productId) },
    update: {},
  });
  return { success: true, message: "Added to wishlist" };
};

const removeFromWishlist = async (request, reply) => {
  const { productId } = request.params;
  await prisma.wishlist.deleteMany({
    where: { userId: request.user.id, productId: Number(productId) },
  });
  return { success: true, message: "Removed from wishlist" };
};

export { getWishlist, addToWishlist, removeFromWishlist };
