"use strict";

import prisma from "../../config/prisma.js";
import { NotFound, BadRequest } from "../../utils/errors.js";

const getReviews = async (request, reply) => {
  const { productId, page = 1, limit = 10 } = request.query;
  if (!productId) throw BadRequest("productId query parameter is required.");

  const skip = (Number(page) - 1) * Number(limit);

  const [reviews, aggr] = await Promise.all([
    prisma.review.findMany({
      where: { productId: Number(productId) },
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, avatarUrl: true } } },
    }),
    prisma.review.aggregate({
      where: { productId: Number(productId) },
      _avg: { rating: true },
      _count: { rating: true },
    }),
  ]);

  // Rating breakdown
  const breakdown = await prisma.review.groupBy({
    by: ["rating"],
    where: { productId: Number(productId) },
    _count: { rating: true },
  });

  const byRating = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  breakdown.forEach((b) => {
    byRating[b.rating] = b._count.rating;
  });

  const formatted = reviews.map((r) => ({
    ...r,
    user_name: r.user.name,
    avatar_url: r.user.avatarUrl,
    user: undefined,
  }));

  return {
    success: true,
    reviews: formatted,
    stats: {
      avg_rating: aggr._avg.rating ? +aggr._avg.rating.toFixed(1) : 0,
      total: aggr._count.rating,
      five: byRating[5],
      four: byRating[4],
      three: byRating[3],
      two: byRating[2],
      one: byRating[1],
    },
  };
};

const addReview = async (request, reply) => {
  const { product_id, rating, comment } = request.body;

  const product = await prisma.product.findUnique({
    where: { id: Number(product_id) },
  });
  if (!product) throw NotFound("Product");

  const review = await prisma.review.upsert({
    where: {
      userId_productId: {
        userId: request.user.id,
        productId: Number(product_id),
      },
    },
    create: {
      userId: request.user.id,
      productId: Number(product_id),
      rating: Number(rating),
      comment: comment || null,
    },
    update: { rating: Number(rating), comment: comment || null },
  });

  return reply.status(201).send({ success: true, review });
};

const deleteReview = async (request, reply) => {
  const { id } = request.params;
  const existing = await prisma.review.findFirst({
    where: { id: Number(id), userId: request.user.id },
  });
  if (!existing) throw NotFound("Review");

  await prisma.review.delete({ where: { id: Number(id) } });
  return { success: true, message: "Review deleted" };
};

export { getReviews, addReview, deleteReview };
