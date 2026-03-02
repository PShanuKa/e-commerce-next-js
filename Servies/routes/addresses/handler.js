"use strict";

import prisma from "../../config/prisma.js";
import { NotFound } from "../../utils/errors.js";

const listAddresses = async (request, reply) => {
  const addresses = await prisma.address.findMany({
    where: { userId: request.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
  return { success: true, addresses };
};

const addAddress = async (request, reply) => {
  const {
    name,
    phone,
    address_line1,
    address_line2,
    city,
    postal_code,
    province,
    is_default,
  } = request.body;

  if (is_default) {
    await prisma.address.updateMany({
      where: { userId: request.user.id },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.create({
    data: {
      userId: request.user.id,
      name,
      phone,
      addressLine1: address_line1,
      addressLine2: address_line2 || null,
      city,
      postalCode: postal_code || null,
      province: province || null,
      isDefault: is_default || false,
    },
  });

  return reply.status(201).send({ success: true, address });
};

const updateAddress = async (request, reply) => {
  const { id } = request.params;

  const existing = await prisma.address.findFirst({
    where: { id: Number(id), userId: request.user.id },
  });
  if (!existing) throw NotFound("Address");

  const {
    name,
    phone,
    address_line1,
    address_line2,
    city,
    postal_code,
    province,
    is_default,
  } = request.body;

  if (is_default) {
    await prisma.address.updateMany({
      where: { userId: request.user.id },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.update({
    where: { id: Number(id) },
    data: {
      ...(name && { name }),
      ...(phone && { phone }),
      ...(address_line1 && { addressLine1: address_line1 }),
      ...(address_line2 !== undefined && { addressLine2: address_line2 }),
      ...(city && { city }),
      ...(postal_code !== undefined && { postalCode: postal_code }),
      ...(province !== undefined && { province }),
      ...(is_default !== undefined && { isDefault: is_default }),
    },
  });

  return { success: true, address };
};

const deleteAddress = async (request, reply) => {
  const { id } = request.params;
  const existing = await prisma.address.findFirst({
    where: { id: Number(id), userId: request.user.id },
  });
  if (!existing) throw NotFound("Address");

  await prisma.address.delete({ where: { id: Number(id) } });
  return { success: true, message: "Address deleted" };
};

const setDefault = async (request, reply) => {
  const { id } = request.params;
  const existing = await prisma.address.findFirst({
    where: { id: Number(id), userId: request.user.id },
  });
  if (!existing) throw NotFound("Address");

  await prisma.address.updateMany({
    where: { userId: request.user.id },
    data: { isDefault: false },
  });
  const address = await prisma.address.update({
    where: { id: Number(id) },
    data: { isDefault: true },
  });

  return { success: true, address };
};

export { listAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefault, };
