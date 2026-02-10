import { prisma } from "../db/client";

export const getInvoiceDetails = async ({ invoiceId }) => {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
  });

  if (!invoice) {
    return { error: "Invoice not found" };
  }

  return {
    invoiceId: invoice.id,
    amount: invoice.amount,
    status: invoice.status,
    paidAt: invoice.paidAt ?? undefined,
  };
};

export const checkRefundStatus = async ({ refundId }) => {
  const refund = await prisma.refund.findUnique({
    where: { id: refundId },
  });

  if (!refund) {
    return { error: "Refund not found" };
  }

  return {
    refundId: refund.id,
    status: refund.status,
    expectedBy: refund.expectedBy ?? undefined,
  };
};
