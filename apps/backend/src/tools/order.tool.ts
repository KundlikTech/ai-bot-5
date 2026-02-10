import { prisma } from "../db/client";

export const getOrderDetails = async ({ orderId }) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    return { error: "Order not found" };
  }

  return {
    orderId: order.id,
    status: order.status,
    eta: order.eta ?? undefined,
    amount: order.amount,
    currency: order.currency,
  };
};

export const createOrder = async ({
  amount,
  currency,
  userId,
  eta,
}: {
  amount: number;
  currency?: string;
  userId?: string | null;
  eta?: string | null;
}) => {
  const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

  const order = await prisma.order.create({
    data: {
      id: orderId,
      status: "Processing",
      eta: eta ?? "Today",
      amount,
      currency: currency ?? "INR",
      userId: userId ?? null,
    },
  });

  return {
    orderId: order.id,
    status: order.status,
    eta: order.eta ?? undefined,
    amount: order.amount,
    currency: order.currency,
  };
};
