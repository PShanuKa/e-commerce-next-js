"use strict";

import prisma from "../../config/prisma.js";
import { NotFound, BadRequest } from "../../utils/errors.js";

const getCart = async (request, reply) => {
  const items = await prisma.cartItem.findMany({
    where: { userId: request.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          originalPrice: true,
          stockQty: true,
          images: {
            orderBy: { sortOrder: "asc" },
            take: 1,
            select: { url: true },
          },
        },
      },
    },
  });

  const formatted = items.map((i) => ({
    id: i.id,
    quantity: i.quantity,
    variant: i.variant,
    product_id: i.product.id,
    name: i.product.name,
    price: i.product.price,
    original_price: i.product.originalPrice,
    stock_qty: i.product.stockQty,
    image: i.product.images[0]?.url ?? null,
  }));

  const total = formatted.reduce((s, i) => s + Number(i.price) * i.quantity, 0);
  return {
    success: true,
    items: formatted,
    total: total.toFixed(2),
    count: formatted.length,
  };
};

const addToCart = async (request, reply) => {
  const { product_id, quantity = 1, variant } = request.body;

  const product = await prisma.product.findFirst({
    where: { id: Number(product_id), isActive: true },
    select: { stockQty: true },
  });
  if (!product) throw NotFound("Product");
  if (product.stockQty < quantity)
    throw BadRequest("Not enough stock available.");

  await prisma.cartItem.upsert({
    where: {
      userId_productId: {
        userId: request.user.id,
        productId: Number(product_id),
      },
    },
    create: {
      userId: request.user.id,
      productId: Number(product_id),
      quantity: Number(quantity),
      variant: variant || null,
    },
    update: { quantity: { increment: Number(quantity) } },
  });

  return { success: true, message: "Added to cart" };
};

const updateCartItem = async (request, reply) => {
  const { productId } = request.params;
  const { quantity } = request.body;
  if (quantity < 1) throw BadRequest("Quantity must be at least 1.");

  const item = await prisma.cartItem.findUnique({
    where: {
      userId_productId: {
        userId: request.user.id,
        productId: Number(productId),
      },
    },
  });
  if (!item) throw NotFound("Cart item");

  await prisma.cartItem.update({
    where: {
      userId_productId: {
        userId: request.user.id,
        productId: Number(productId),
      },
    },
    data: { quantity: Number(quantity) },
  });

  return { success: true, message: "Cart updated" };
};

const removeFromCart = async (request, reply) => {
  const { productId } = request.params;
  await prisma.cartItem.deleteMany({
    where: { userId: request.user.id, productId: Number(productId) },
  });
  return { success: true, message: "Item removed" };
};

const clearCart = async (request, reply) => {
  await prisma.cartItem.deleteMany({ where: { userId: request.user.id } });
  return { success: true, message: "Cart cleared" };
};

export { getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart, };
