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
}
