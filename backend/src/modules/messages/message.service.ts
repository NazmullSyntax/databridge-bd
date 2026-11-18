import { prisma } from "../../lib/prisma";

export class MessageService {
  // মেসেজ পাঠানো
  static async sendMessage(
    projectId: string,
    senderId: string,
    body: string,
    attachmentUrl?: string,
  ) {
    // চেক করুন ইউজার এই প্রজেক্টে অ্যাক্সেস আছে কিনা
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { order: { customerId: senderId } },
          { assignments: { some: { userId: senderId } } },
          {
            order: {
              customer: {
                role: { name: "ADMIN" }, // Admin সব প্রজেক্টে অ্যাক্সেস পাবে
              },
            },
          },
        ],
      },
    });

    // অ্যাডমিন চেক
    const user = await prisma.user.findUnique({
      where: { id: senderId },
      include: { role: true },
    });

    if (!project && user?.role.name !== "ADMIN") {
      throw new Error("Unauthorized: You do not have access to this project");
    }

    return prisma.message.create({
      data: {
        projectId,
        senderId,
        body,
        attachmentUrl,
      },
      include: {
        sender: { select: { fullName: true, email: true } },
      },
    });
  }

  // প্রজেক্টের সব মেসেজ দেখা
  static async getProjectMessages(projectId: string, userId: string) {
    // চেক করুন ইউজার এই প্রজেক্টে অ্যাক্সেস আছে কিনা
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (user?.role.name !== "ADMIN") {
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          OR: [
            { order: { customerId: userId } },
            { assignments: { some: { userId } } },
          ],
        },
      });
      if (!project) throw new Error("Unauthorized");
    }

    return prisma.message.findMany({
      where: { projectId },
      include: {
        sender: {
          select: {
            fullName: true,
            email: true,
            role: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  // মেসেজ পড়া হয়েছে মার্ক করা
  static async markAsRead(messageId: string) {
    return prisma.message.update({
      where: { id: messageId },
      data: { readAt: new Date() },
    });
  }

  // প্রজেক্টের আনরিড মেসেজ কাউন্ট
  static async getUnreadCount(projectId: string, userId: string) {
    return prisma.message.count({
      where: {
        projectId,
        senderId: { not: userId },
        readAt: null,
      },
    });
  }
}
