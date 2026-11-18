import { Response } from "express";
import { NotificationService } from "./notification.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export class NotificationController {
  static async getMy(req: AuthRequest, res: Response) {
    try {
      const notifications = await NotificationService.getMyNotifications(
        req.user!.userId,
      );
      const unreadCount = await NotificationService.getUnreadCount(
        req.user!.userId,
      );
      return res
        .status(200)
        .json({ success: true, data: notifications, unreadCount });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async markRead(req: AuthRequest, res: Response) {
    try {
      await NotificationService.markAsRead(
        String(req.params.id),
        req.user!.userId,
      );
      return res.status(200).json({ success: true });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async markAllRead(req: AuthRequest, res: Response) {
    try {
      await NotificationService.markAllAsRead(req.user!.userId);
      return res.status(200).json({ success: true });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
