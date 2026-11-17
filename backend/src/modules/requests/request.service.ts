import { prisma } from "../../lib/prisma";

export class RequestService {
  static async create(customerId: string, data: any) {
    // Generate request number like REQ-2026-0001
    const count = await prisma.dataRequest.count();
    const requestNumber = `REQ-2026-${String(count + 1).padStart(4, "0")}`;

    const request = await prisma.dataRequest.create({
      data: {
        requestNumber,
        customerId,
        title: data.title,
        objective: data.objective,
        dataCategory: data.dataCategory,
        requiredFields: data.requiredFields,
        targetLocation: data.targetLocation,
        targetAudience: data.targetAudience,
        targetVolume: data.targetVolume,
        methodPref: data.methodPref,
        dataFormat: data.dataFormat,
        deadline: data.deadline ? new Date(data.deadline) : null,
        budgetMin: data.budgetMin,
        budgetMax: data.budgetMax,
        additionalNotes: data.additionalNotes,
        status: "SUBMITTED",
      },
    });

    return request;
  }

  static async getMyRequests(customerId: string) {
    return prisma.dataRequest.findMany({
      where: { customerId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getById(id: string, customerId: string) {
    return prisma.dataRequest.findFirst({
      where: { id, customerId },
    });
  }

  static async getRequestWithQuotations(id: string, customerId: string) {
    return prisma.dataRequest.findFirst({
      where: { id, customerId },
      include: {
        quotations: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  static async acceptQuotation(quotationId: string, customerId: string) {
    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      include: { request: true },
    });

    if (!quotation || quotation.request.customerId !== customerId) {
      throw new Error("Quotation not found or unauthorized");
    }

    if (quotation.status !== "SENT") {
      throw new Error("Quotation is no longer available");
    }

    const orderCount = await prisma.order.count();
    const orderNumber = `ORD-2026-${String(orderCount + 1).padStart(4, "0")}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        quotationId: quotation.id,
        customerId,
        totalAmount: quotation.amount,
        currency: quotation.currency,
        status: "CONFIRMED",
      },
    });

    await prisma.quotation.update({
      where: { id: quotationId },
      data: { status: "ACCEPTED" },
    });

    await prisma.dataRequest.update({
      where: { id: quotation.requestId },
      data: { status: "ORDER_CONFIRMED" },
    });

    return order;
  }

  static async rejectQuotation(quotationId: string, customerId: string) {
    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      include: { request: true },
    });

    if (!quotation || quotation.request.customerId !== customerId) {
      throw new Error("Quotation not found or unauthorized");
    }

    await prisma.quotation.update({
      where: { id: quotationId },
      data: { status: "REJECTED" },
    });

    await prisma.dataRequest.update({
      where: { id: quotation.requestId },
      data: { status: "QUOTATION_REJECTED" },
    });

    return { success: true };
  }
}
