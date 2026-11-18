import { prisma } from "../../lib/prisma";

export class AuditService {
  static async log(
    userId: string,
    action: string,
    entity: string,
    entityId: string,
    metadata?: string,
    ip?: string,
  ) {
    return prisma.auditLog.create({
      data: { userId, action, entity, entityId, metadata, ipAddress: ip },
    });
  }

  static async getAllLogs() {
    return prisma.auditLog.findMany({
      include: { user: { select: { fullName: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }
}
