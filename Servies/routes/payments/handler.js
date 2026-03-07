"use strict";

import prisma from "../../config/prisma.js";
import { NotFound } from "../../utils/errors.js";

const listAllPayments = async (request, reply) => {
  const { page = 1, limit = 20, status } = request.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where = {};
  if (status) where.status = status;

  const [payments, totalCount] = await Promise.all([
    prisma.payment.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
      include: {
        order: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    }),
    prisma.payment.count({ where }),
  ]);

  return {
    success: true,
    payments,
    meta: {
      total: totalCount,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(totalCount / Number(limit)),
    },
  };
};

const getPaymentById = async (request, reply) => {
  const { id } = request.params;

  const payment = await prisma.payment.findUnique({
    where: { id: Number(id) },
    include: {
      order: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          orderItems: true,
          address: true,
        },
      },
    },
  });

  if (!payment) throw NotFound("Payment");

  return { success: true, payment };
};

export { listAllPayments, getPaymentById };
