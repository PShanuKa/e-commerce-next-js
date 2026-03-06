"use strict";

import prisma from "../../config/prisma.js";
import { NotFound, BadRequest } from "../../utils/errors.js";
import crypto from "crypto";

const initPayment = async (request, reply) => {
  const { order_id } = request.body;
  const userId = request.user.id;

  const order = await prisma.order.findFirst({
    where: { id: Number(order_id), userId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
      address: true,
    },
  });

  if (!order) throw NotFound("Order");
  if (order.status !== "pending") {
    throw BadRequest("Only pending orders can be initialized for payment.");
  }

  const merchant_id = process.env.PAYHERE_MERCHANT_ID;
  const merchant_secret = process.env.PAYHERE_SECRET;
  const amount = Number(order.total).toFixed(2);
  const currency = "LKR";

  // Generate Hash
  // MD5(Merchant ID + Order ID + Amount + Currency + MD5(Merchant Secret))
  const hashedSecret = crypto
    .createHash("md5")
    .update(merchant_secret)
    .digest("hex")
    .toUpperCase();
  const mainHash = crypto
    .createHash("md5")
    .update(merchant_id + order.id + amount + currency + hashedSecret)
    .digest("hex")
    .toUpperCase();

  const paymentParams = {
    sandbox: process.env.NODE_ENV !== "production",
    merchant_id,
    return_url: `${request.headers.origin}/order-success?id=${order.id}`,
    cancel_url: `${request.headers.origin}/checkout`,
    notify_url: `${request.headers.origin}/api/payhere/notify`, // For server-side update (WebHook)
    order_id: order.id.toString(),
    items: `Order #${order.id}`,
    amount: amount,
    currency: currency,
    hash: mainHash,
    first_name: order.user?.name || "Guest",
    last_name: "",
    email: order.user?.email || "",
    phone: order.user?.phone || order.address?.phone || "",
    address: order.address?.addressLine1 || "",
    city: order.address?.city || "",
    country: "Sri Lanka",
  };

  return { success: true, paymentParams };
};

const notifyPayment = async (request, reply) => {
  const {
    merchant_id,
    order_id,
    payhere_amount,
    payhere_currency,
    status_code,
    md5sig,
    custom_1,
    custom_2,
    payhere_payment_id,
    method,
    status_message,
  } = request.body;

  const merchant_secret = process.env.PAYHERE_SECRET;

  // Verify Hash
  // MD5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + MD5(merchant_secret).toUpperCase())
  const hashedSecret = crypto
    .createHash("md5")
    .update(merchant_secret)
    .digest("hex")
    .toUpperCase();
  const expectedHash = crypto
    .createHash("md5")
    .update(
      merchant_id +
        order_id +
        payhere_amount +
        payhere_currency +
        status_code +
        hashedSecret,
    )
    .digest("hex")
    .toUpperCase();

  if (md5sig.toUpperCase() !== expectedHash) {
    request.log.warn("PayHere notification hash mismatch");
    return reply.status(400).send("Invalid hash");
  }

  const orderIdNum = Number(order_id);
  const statusCodeInt = Number(status_code);

  await prisma.$transaction(async (tx) => {
    // 1. Create Payment record
    await tx.payment.create({
      data: {
        orderId: orderIdNum,
        paymentMethod: method || "PayHere",
        transactionId: payhere_payment_id,
        amount: payhere_amount,
        currency: payhere_currency,
        status:
          statusCodeInt === 2
            ? "success"
            : statusCodeInt === -2
              ? "failed"
              : "pending",
        payhereStatus: statusCodeInt,
        payhereMessage: status_message,
        payhereReference: payhere_payment_id,
      },
    });

    // 2. Update Order status
    if (statusCodeInt === 2) {
      await tx.order.update({
        where: { id: orderIdNum },
        data: { status: "processing" },
      });
    } else if (statusCodeInt === -2) {
      // Logic for failed payment - optional: update order status to 'failed' or keep 'pending'
      // For now, let's just record it in payments and maybe let it stay pending
    }
  });

  return reply.status(200).send("OK");
};

export { initPayment, notifyPayment };
