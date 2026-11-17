import { prisma } from "../../lib/prisma";

export class ProjectService {
  // অর্ডার থেকে প্রজেক্ট তৈরি
  static async createFromOrder(
    orderId: string,
    title: string,
    dueDate: string,
  ) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { quotation: { include: { request: true } } },
    });

    if (!order) throw new Error("Order not found");

    const projectCount = await prisma.project.count();
    const projectCode = `PRJ-2026-${String(projectCount + 1).padStart(4, "0")}`;

    const project = await prisma.project.create({
      data: {
        projectCode,
        orderId,
        title,
        status: "RESEARCH_PLANNING",
        dueDate: new Date(dueDate),
        startDate: new Date(),
      },
    });

    // Order status update
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "IN_PROGRESS" },
    });

    return project;
  }

  // সব প্রজেক্ট দেখা (অ্যাডমিন)
  static async getAllProjects() {
    return prisma.project.findMany({
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
        assignments: {
          include: { user: { select: { fullName: true, email: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // টিম মেম্বার অ্যাসাইন করা
  static async assignTeamMember(
    projectId: string,
    userId: string,
    role: string,
  ) {
    const existing = await prisma.projectAssignment.findFirst({
      where: { projectId, userId },
    });

    if (existing) throw new Error("User already assigned to this project");

    return prisma.projectAssignment.create({
      data: {
        projectId,
        userId,
        role: role || "RESEARCHER",
      },
    });
  }

  // টিম মেম্বারের নিজের প্রজেক্ট দেখা
  static async getMyProjects(userId: string) {
    return prisma.project.findMany({
      where: {
        assignments: { some: { userId } },
      },
      include: {
        order: {
          include: {
            quotation: {
              include: {
                request: {
                  include: { customer: { select: { fullName: true } } },
                },
              },
            },
          },
        },
        assignments: {
          include: { user: { select: { fullName: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // প্রজেক্টের স্ট্যাটাস আপডেট
  static async updateProjectStatus(
    projectId: string,
    status: string,
    progress?: number,
  ) {
    return prisma.project.update({
      where: { id: projectId },
      data: {
        status,
        ...(progress !== undefined && { progress }),
      },
    });
  }
}
