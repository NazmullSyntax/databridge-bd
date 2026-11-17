import { prisma } from "../../lib/prisma";

export class TaskService {
  static async create(
    projectId: string,
    data: {
      title: string;
      description?: string;
      location?: string;
      assignedTo?: string;
      dueDate?: string;
    },
  ) {
    return prisma.fieldTask.create({
      data: {
        projectId,
        title: data.title,
        description: data.description,
        location: data.location,
        assignedTo: data.assignedTo,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
    });
  }

  static async getByProject(projectId: string) {
    return prisma.fieldTask.findMany({
      where: { projectId },
      include: { surveyResponses: true },
      orderBy: { createdAt: "desc" },
    });
  }

  static async updateStatus(taskId: string, status: string) {
    return prisma.fieldTask.update({
      where: { id: taskId },
      data: { status },
    });
  }

  static async addSurveyResponse(
    taskId: string,
    responseData: string,
    collectedBy?: string,
  ) {
    return prisma.surveyResponse.create({
      data: {
        fieldTaskId: taskId,
        responseData,
        collectedBy,
        verified: false,
      },
    });
  }
}
