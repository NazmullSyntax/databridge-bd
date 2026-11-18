import { Response } from "express";
import { AuditService } from "./audit.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export class AuditController {
  static async getAll(req: AuthRequest, res: Response) {
    try {
      const logs = await AuditService.getAllLogs();
      return res.status(200).json({ success: true, data: logs });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
