"use strict";

import prisma from "../../config/prisma.js";
import { NotFound, BadRequest } from "../../utils/errors.js";

const placeOrder = async (request, reply) => {
  const {
    address_id,
    payment_method = "cod",
    coupon_discount = 0,
    notes,
  } = request.body;
  const userId = request.user.id;

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          stockQty: true,
          images: { take: 1, select: { url: true } },
        },
      },
    },
  });

  if (cartItems.length === 0) throw BadRequest("Cart is empty.");

  const subtotal = cartItems.reduce(
    (s, i) => s + Number(i.product.price) * i.quantity,
    0,
  );
  const deliveryFee = subtotal >= 5000 ? 0 : 350;
  const total = subtotal + deliveryFee - Number(coupon_discount);

  // Create order + items in a transaction
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        addressId: address_id || null,
        status: "pending",
        total,
        deliveryFee,
        couponDiscount: Number(coupon_discount),
        paymentMethod: payment_method,
        notes: notes || null,
        orderItems: {
          create: cartItems.map((i) => ({
            productId: i.product.id,
            name: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
            imageUrl: i.product.images[0]?.url ?? null,
            variant: i.variant,
          })),
        },
      },
      include: { orderItems: true },
    });

    // Reduce stock
    for (const item of cartItems) {
      await tx.product.update({
        where: { id: item.product.id },
        data: { stockQty: { decrement: item.quantity } },
      });
    }

    // Clear cart
    await tx.cartItem.deleteMany({ where: { userId } });

    return newOrder;
  });

  return reply
    .status(201)
    .send({ success: true, message: "Order placed successfully", order });
};

const listMyOrders = async (request, reply) => {
  const orders = await prisma.order.findMany({
    where: { userId: request.user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orderItems: true } } },
  });

  const formatted = orders.map((o) => ({
    ...o,
    item_count: o._count.orderItems,
    _count: undefined,
  }));
  return { success: true, orders: formatted };
};

const getOrder = async (request, reply) => {
  const { id } = request.params;

  const order = await prisma.order.findFirst({
    where: { id: Number(id), userId: request.user.id },
    include: { orderItems: true, address: true },
  });

  if (!order) throw NotFound("Order");
  return { success: true, order };
};

const cancelOrder = async (request, reply) => {
  const { id } = request.params;

  const order = await prisma.order.findFirst({
    where: { id: Number(id), userId: request.user.id },
    select: { status: true },
  });

  if (!order) throw NotFound("Order");
  if (!["pending", "processing"].includes(order.status)) {
    throw BadRequest("Order cannot be cancelled at this stage.");
  }

  await prisma.order.update({
    where: { id: Number(id) },
    data: { status: "cancelled" },
  });
  return { success: true, message: "Order cancelled" };
};

export { placeOrder, listMyOrders, getOrder, cancelOrder };
