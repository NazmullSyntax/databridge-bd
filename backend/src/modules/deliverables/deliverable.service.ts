import { prisma } from "../../lib/prisma";

export class DeliverableService {
  // ডেলিভারেবল আপলোড করা
  static async upload(
    projectId: string,
    data: {
      title: string;
      description?: string;
      fileUrl: string;
      fileType: string;
      fileSize: number;
      isFinal?: boolean;
    },
  ) {
    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) throw new Error("Project not found");

    const deliverable = await prisma.deliverable.create({
      data: {
        projectId,
        title: data.title,
        description: data.description,
        fileUrl: data.fileUrl,
        fileType: data.fileType,
        fileSize: data.fileSize,
        isFinal: data.isFinal || false,
      },
    });

    return deliverable;
  }

  // প্রজেক্টের সব ডেলিভারেবল দেখা
  static async getByProject(projectId: string) {
    return prisma.deliverable.findMany({
      where: { projectId },
      orderBy: { uploadedAt: "desc" },
    });
  }

  // ডেলিভারেবল ডিলিট করা
  static async delete(id: string, userId: string) {
    const deliverable = await prisma.deliverable.findUnique({
      where: { id },
      include: { project: { include: { assignments: true } } },
    });

    if (!deliverable) throw new Error("Deliverable not found");

    // Check authorization: only assigned team member or admin
    const isAssigned = deliverable.project.assignments.some(
      (a) => a.userId === userId,
    );
    if (!isAssigned) throw new Error("Unauthorized");

    await prisma.deliverable.delete({ where: { id } });
    return { success: true };
  }
}
