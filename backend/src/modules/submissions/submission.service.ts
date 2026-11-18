import { prisma } from "../../lib/prisma";

export class SubmissionService {
  // টিম মেম্বার সাবমিশন তৈরি করবে
  static async createSubmission(
    projectId: string,
    submittedBy: string,
    data: {
      title: string;
      description?: string;
      fileUrl?: string;
      fileType?: string;
      fileSize?: number;
      taskId?: string;
    },
  ) {
    // Version count
    const count = await prisma.submission.count({
      where: { projectId, title: data.title },
    });

    return prisma.submission.create({
      data: {
        projectId,
        taskId: data.taskId,
        submittedBy,
        title: data.title,
        description: data.description,
        fileUrl: data.fileUrl,
        fileType: data.fileType,
        fileSize: data.fileSize,
        version: count + 1,
        status: "SUBMITTED",
      },
    });
  }

  // প্রজেক্টের সব সাবমিশন দেখা
  static async getSubmissionsByProject(projectId: string) {
    return prisma.submission.findMany({
      where: { projectId },
      include: {
        submitter: { select: { fullName: true, email: true } },
        reviewer: { select: { fullName: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // অ্যাডমিন রিভিউ করবে
  static async reviewSubmission(
    submissionId: string,
    reviewerId: string,
    status: string,
    notes?: string,
  ) {
    return prisma.submission.update({
      where: { id: submissionId },
      data: {
        status,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
        reviewNotes: notes,
      },
    });
  }

  // কাস্টমার অ্যাপ্রুভ/রিজেক্ট করবে
  static async customerReview(
    submissionId: string,
    approved: boolean,
    notes?: string,
  ) {
    return prisma.submission.update({
      where: { id: submissionId },
      data: {
        customerApproved: approved,
        customerNotes: notes,
      },
    });
  }

  // কাস্টমারের প্রজেক্টের সাবমিশন দেখা
  static async getSubmissionsForCustomer(
    projectId: string,
    customerId: string,
  ) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, order: { customerId } },
    });
    if (!project) throw new Error("Project not found or unauthorized");

    return prisma.submission.findMany({
      where: { projectId, status: "APPROVED" }, // কাস্টমার শুধু অ্যাপ্রুভড দেখবে
      orderBy: { createdAt: "desc" },
    });
  }
}
