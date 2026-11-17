import { Response } from "express";
import { DeliverableService } from "./deliverable.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export class DeliverableController {
  static async upload(req: AuthRequest, res: Response) {
    try {
      const {
        projectId,
        title,
        description,
        fileUrl,
        fileType,
        fileSize,
        isFinal,
      } = req.body;

      if (!projectId || !title || !fileUrl) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields" });
      }

      const deliverable = await DeliverableService.upload(projectId, {
        title,
        description,
        fileUrl,
        fileType,
        fileSize,
        isFinal,
      });

      return res.status(201).json({ success: true, data: deliverable });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getByProject(req: AuthRequest, res: Response) {
    try {
      const deliverables = await DeliverableService.getByProject(
        String(req.params.projectId),
      );
      return res.status(200).json({ success: true, data: deliverables });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async delete(req: AuthRequest, res: Response) {
    try {
      await DeliverableService.delete(String(req.params.id), req.user!.userId);
      return res.status(200).json({ success: true, message: "Deleted" });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}
