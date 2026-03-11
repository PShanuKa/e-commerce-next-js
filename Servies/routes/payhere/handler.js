"use strict";

import prisma from "../../config/prisma.js";
import { NotFound, BadRequest } from "../../utils/errors.js";
import crypto from "crypto";
import md5 from "crypto-js/md5.js";

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
  const amount = parseFloat(order.total)
    .toLocaleString("en-us", { minimumFractionDigits: 2 })
    .replaceAll(",", "");
  const currency = "LKR";

  // Generate Hash
  // MD5(Merchant ID + Order ID + Amount + Currency + MD5(Merchant Secret))
  const hashedSecret = md5(merchant_secret).toString().toUpperCase();
  const mainHash = md5(
    merchant_id + order.id.toString() + amount + currency + hashedSecret,
  )
    .toString()
    .toUpperCase();

  // ── Payment record "pending" විදිහට init ගේදීම create කරනවා ─────────────
  const payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      paymentMethod: "PayHere",
      amount: amount,
      currency: currency,
      status: "pending",
    },
  });

  const paymentParams = {
    sandbox: process.env.NODE_ENV !== "production",
    merchant_id,
    return_url: `${request.headers.origin}/order-success?id=${order.id}`,
    cancel_url: `${request.headers.origin}/checkout`,
    notify_url: `${process.env.PAYHERE_NOTIFY_URL || request.headers.origin}/api/payhere/notify`,
    order_id: order.id.toString(),
    items: `Order #${order.id}`,
    amount: amount,
    currency: currency,
    first_name: order.user?.name?.split(" ")[0] || "Guest",
    last_name: order.user?.name?.split(" ").slice(1).join(" ") || "LastName",
    email: order.user?.email || "",
    phone: order.user?.phone || order.address?.phone || "",
    address:
      `${order.address?.addressLine1 || ""}${order.address?.addressLine2 ? ", " + order.address.addressLine2 : ""}`.trim(),
    city: order.address?.city || "",
    country: "Sri Lanka",
    hash: mainHash,
    custom_1: payment.id.toString(), // ← Payment DB id — notify ලා update කරන්ඩ return වෙනවා
  };

  return { success: true, paymentParams };
};

const notifyPayment = async (request, reply) => {
  console.log("PayHere notify body:", request.body);

  const {
    merchant_id,
    order_id,
    payhere_amount,
    payhere_currency,
    status_code,
    md5sig,
    custom_1,           // ← Payment DB id (init handler ගෙ pass කළේ)
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
  const paymentIdNum = Number(custom_1); // init handler ගෙ Payment.id

  // PayHere status_code → අපේ status string
  // 2 = Success | -2 = Failed | 0 = Pending | -1 = Canceled | -3 = Chargedback
  let paymentStatus = "pending";
  if (statusCodeInt === 2) paymentStatus = "success";
  else if (statusCodeInt < 0) paymentStatus = "failed";

  await prisma.$transaction(async (tx) => {
    // 1. Init ගෙදී create කළ Payment record update කරනවා (create නෙවෙයි)
    if (paymentIdNum) {
      await tx.payment.update({
        where: { id: paymentIdNum },
        data: {
          status: paymentStatus,
          paymentMethod: method || "PayHere",
          transactionId: payhere_payment_id,
          payhereStatus: statusCodeInt,
          payhereMessage: status_message,
          payhereReference: payhere_payment_id,
        },
      });
    }

    // 2. Payment success → Order "processing" update
    if (statusCodeInt === 2) {
      await tx.order.update({
        where: { id: orderIdNum },
        data: { status: "processing" },
      });
    }
  });

  return reply.status(200).send("OK");
};

export { initPayment, notifyPayment };
