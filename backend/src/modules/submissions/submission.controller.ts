import { Response } from "express";
import { SubmissionService } from "./submission.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export class SubmissionController {
  static async create(req: AuthRequest, res: Response) {
    try {
      const {
        projectId,
        title,
        description,
        fileUrl,
        fileType,
        fileSize,
        taskId,
      } = req.body;
      if (!projectId || !title) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields" });
      }
      const submission = await SubmissionService.createSubmission(
        projectId,
        req.user!.userId,
        { title, description, fileUrl, fileType, fileSize, taskId },
      );
      return res.status(201).json({ success: true, data: submission });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getByProject(req: AuthRequest, res: Response) {
    try {
      const submissions = await SubmissionService.getSubmissionsByProject(
        String(req.params.projectId),
      );
      return res.status(200).json({ success: true, data: submissions });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async review(req: AuthRequest, res: Response) {
    try {
      const { status, notes } = req.body;
      const submission = await SubmissionService.reviewSubmission(
        String(req.params.id),
        req.user!.userId,
        status,
        notes,
      );
      return res.status(200).json({ success: true, data: submission });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async customerReview(req: AuthRequest, res: Response) {
    try {
      const { approved, notes } = req.body;
      const submission = await SubmissionService.customerReview(
        String(req.params.id),
        approved,
        notes,
      );
      return res.status(200).json({ success: true, data: submission });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getForCustomer(req: AuthRequest, res: Response) {
    try {
      const submissions = await SubmissionService.getSubmissionsForCustomer(
        String(req.params.projectId),
        req.user!.userId,
      );
      return res.status(200).json({ success: true, data: submissions });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}
