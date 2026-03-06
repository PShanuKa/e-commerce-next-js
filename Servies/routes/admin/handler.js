"use strict";

import prisma from "../../config/prisma.js";
import bcryptJs from "bcryptjs";

const getDashboardStats = async (request, reply) => {
  const [orders, users, products, revenue] = await Promise.all([
    prisma.order.aggregate({ _count: { id: true } }),
    prisma.user.count({ where: { role: "customer" } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.aggregate({
      where: { status: { not: "cancelled" } },
      _sum: { total: true },
    }),
  ]);

  const [pendingOrders, deliveredOrders] = await Promise.all([
    prisma.order.count({ where: { status: "pending" } }),
    prisma.order.count({ where: { status: "delivered" } }),
  ]);

  return {
    success: true,
    stats: {
      total_orders: orders._count.id,
      pending_orders: pendingOrders,
      delivered_orders: deliveredOrders,
      total_customers: users,
      total_products: products,
      total_revenue: Number(revenue._sum.total ?? 0),
    },
  };
};

const listAllOrders = async (request, reply) => {
  const { status, page = 1, limit = 20 } = request.query;
  const skip = (Number(page) - 1) * Number(limit);

  const orders = await prisma.order.findMany({
    where: status ? { status } : {},
    skip,
    take: Number(limit),
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { orderItems: true } },
    },
  });

  const formatted = orders.map((o) => ({
    ...o,
    customer_name: o.user.name,
    customer_email: o.user.email,
    item_count: o._count.orderItems,
    user: undefined,
    _count: undefined,
  }));

  return { success: true, orders: formatted };
};

const updateOrderStatus = async (request, reply) => {
  const { id } = request.params;
  const { status } = request.body;

  const allowed = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];
  if (!allowed.includes(status))
    return reply
      .status(400)
      .send({ success: false, error: "Invalid status value." });

  const order = await prisma.order
    .update({
      where: { id: Number(id) },
      data: { status },
    })
    .catch(() => null);

  if (!order)
    return reply
      .status(404)
      .send({ success: false, error: "Order not found." });
  return { success: true, order };
};

const getOrderDetails = async (request, reply) => {
  const { id } = request.params;

  const order = await prisma.order.findUnique({
    where: { id: Number(id) },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      address: true,
      orderItems: {
        include: {
          product: { select: { name: true, slug: true } },
        },
      },
    },
  });

  if (!order)
    return reply
      .status(404)
      .send({ success: false, error: "Order not found." });

  return { success: true, order };
};

const listAllUsers = async (request, reply) => {
  const { page = 1, limit = 20 } = request.query;
  const skip = (Number(page) - 1) * Number(limit);

  const users = await prisma.user.findMany({
    skip,
    take: Number(limit),
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
  });

  const formatted = users.map((u) => ({
    ...u,
    order_count: u._count.orders,
    _count: undefined,
  }));
  return { success: true, users: formatted };
};

const createCustomer = async (request, reply) => {
  const { name, email, phone, password } = request.body;

  if (!name || !email || !password) {
    return reply
      .status(400)
      .send({ success: false, error: "Missing required fields." });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return reply
      .status(400)
      .send({ success: false, error: "Email already in use." });
  }

  const salt = await bcryptJs.genSalt(10);
  const passwordHash = await bcryptJs.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      passwordHash,
      role: "customer",
    },
  });

  return {
    success: true,
    user: { id: user.id, name: user.name, email: user.email },
  };
};

const updateCustomer = async (request, reply) => {
  const { id } = request.params;
  const { name, email, phone, role, isActive } = request.body;

  const data = {};
  if (name !== undefined) data.name = name;
  if (email !== undefined) data.email = email;
  if (phone !== undefined) data.phone = phone;
  if (role !== undefined) data.role = role;
  if (isActive !== undefined) data.isActive = isActive;

  const user = await prisma.user
    .update({
      where: { id: Number(id) },
      data,
    })
    .catch(() => null);

  if (!user)
    return reply.status(404).send({ success: false, error: "User not found." });

  return {
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    },
  };
};

export {
  getDashboardStats,
  listAllOrders,
  updateOrderStatus,
  listAllUsers,
  createCustomer,
  updateCustomer,
  getOrderDetails,
};
