import { prisma } from "../../lib/prisma";

export class InvoiceService {
  // ইনভয়েস তৈরি (অর্ডার থেকে)
  static async createFromOrder(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { invoice: true },
    });

    if (!order) throw new Error("Order not found");
    if (order.invoice) throw new Error("Invoice already exists for this order");

    const count = await prisma.invoice.count();
    const invoiceNo = `INV-2026-${String(count + 1).padStart(4, "0")}`;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNo,
        orderId,
        amount: order.totalAmount,
        currency: order.currency,
        status: "UNPAID",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return invoice;
  }

  // সব ইনভয়েস দেখা (অ্যাডমিন)
  static async getAllInvoices() {
    return prisma.invoice.findMany({
      include: {
        order: {
          include: {
            quotation: {
              include: {
                request: {
                  include: {
                    customer: { select: { fullName: true, email: true } },
                  },
                },
              },
            },
          },
        },
        payments: true,
      },
      orderBy: { issuedAt: "desc" },
    });
  }

  // কাস্টমারের নিজের ইনভয়েস
  static async getMyInvoices(customerId: string) {
    return prisma.invoice.findMany({
      where: {
        order: {
          quotation: {
            request: { customerId },
          },
        },
      },
      include: {
        order: {
          include: {
            quotation: {
              include: {
                request: { select: { title: true, requestNumber: true } },
              },
            },
          },
        },
        payments: true,
      },
      orderBy: { issuedAt: "desc" },
    });
  }

  // পেমেন্ট রেকর্ড করা
  static async recordPayment(
    invoiceId: string,
    data: {
      amount: number;
      method: string;
      transactionId?: string;
    },
  ) {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    });
    if (!invoice) throw new Error("Invoice not found");

    const payment = await prisma.payment.create({
      data: {
        invoiceId,
        amount: data.amount,
        method: data.method,
        transactionId: data.transactionId,
        status: "COMPLETED",
        paidAt: new Date(),
      },
    });

    // Total paid check
    const totalPaid = await prisma.payment.aggregate({
      where: { invoiceId, status: "COMPLETED" },
      _sum: { amount: true },
    });

    const isPaid = Number(totalPaid._sum.amount || 0) >= Number(invoice.amount);
    if (isPaid) {
      await prisma.invoice.update({
        where: { id: invoiceId },
        data: { status: "PAID", paidAt: new Date() },
      });
    }

    return { payment, isPaid };
  }
}
