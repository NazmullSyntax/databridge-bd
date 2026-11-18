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

  // অ্যাডমিন টাস্ক তৈরি করবে
  static async createTask(data: {
    projectId: string;
    title: string;
    description: string;
    assignedTo: string;
    dueDate: string;
    priority: string;
  }) {
    return prisma.fieldTask.create({
      data: {
        projectId: data.projectId,
        title: data.title,
        description: data.description,
        assignedTo: data.assignedTo,
        dueDate: new Date(data.dueDate),
        status: "ASSIGNED",
      },
    });
  }

  // টিম মেম্বারের নিজের সব টাস্ক দেখা
  static async getMyTasks(userId: string) {
    return prisma.fieldTask.findMany({
      where: { assignedTo: userId },
      include: {
        project: {
          select: {
            title: true,
            projectCode: true,
            order: {
              select: {
                quotation: {
                  select: {
                    request: { select: { title: true } },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // টিম মেম্বার স্ট্যাটাস আপডেট
  static async updateTaskStatus(taskId: string, status: string) {
    return prisma.fieldTask.update({
      where: { id: taskId },
      data: { status },
    });
  }

  // অ্যাডমিনের জন্য প্রজেক্টের সব টাস্ক
  static async getTasksByProject(projectId: string) {
    return prisma.fieldTask.findMany({
      where: { projectId },
      include: {
        project: { select: { title: true } },
        surveyResponses: true,
      },
      orderBy: { createdAt: "desc" },
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
