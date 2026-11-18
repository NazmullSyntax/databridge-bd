import { Response } from "express";
import { MessageService } from "./message.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export class MessageController {
  static async send(req: AuthRequest, res: Response) {
    try {
      const { projectId, body, attachmentUrl } = req.body;
      if (!projectId || !body) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields" });
      }
      const message = await MessageService.sendMessage(
        projectId,
        req.user!.userId,
        body,
        attachmentUrl,
      );
      return res.status(201).json({ success: true, data: message });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getByProject(req: AuthRequest, res: Response) {
    try {
      const messages = await MessageService.getProjectMessages(
        String(req.params.projectId),
        req.user!.userId,
      );
      return res.status(200).json({ success: true, data: messages });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}
