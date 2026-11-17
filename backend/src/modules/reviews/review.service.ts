import { prisma } from "../../lib/prisma";

export class ReviewService {
  static async createReview(
    projectId: string,
    customerId: string,
    rating: number,
    comment?: string,
  ) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, order: { customerId } },
    });

    if (!project) throw new Error("Project not found or unauthorized");

    return prisma.review.create({
      data: {
        projectId,
        customerId,
        rating,
        comment,
      },
    });
  }

  static async getProjectReview(projectId: string) {
    return prisma.review.findUnique({
      where: { projectId },
    });
  }
}
