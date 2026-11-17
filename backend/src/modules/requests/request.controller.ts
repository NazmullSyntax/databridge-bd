import { Response } from "express";
import { RequestService } from "./request.service";
import { createRequestSchema } from "./request.schema";
import { AuthRequest } from "../../middlewares/auth.middleware";

export class RequestController {
  static async create(req: AuthRequest, res: Response) {
    try {
      const parsed = createRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: parsed.error.issues,
        });
      }

      const request = await RequestService.create(
        req.user!.userId,
        parsed.data,
      );
      return res.status(201).json({
        success: true,
        message: "Request submitted successfully",
        data: request,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getMyRequests(req: AuthRequest, res: Response) {
    try {
      const requests = await RequestService.getMyRequests(req.user!.userId);
      return res.status(200).json({ success: true, data: requests });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getMyRequestDetail(req: AuthRequest, res: Response) {
    try {
      const request = await RequestService.getRequestWithQuotations(
        String(req.params.id),
        req.user!.userId,
      );
      if (!request) {
        return res
          .status(404)
          .json({ success: false, message: "Request not found" });
      }
      return res.status(200).json({ success: true, data: request });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async acceptQuotation(req: AuthRequest, res: Response) {
    try {
      const order = await RequestService.acceptQuotation(
        String(req.params.quotationId),
        req.user!.userId,
      );
      return res.status(200).json({
        success: true,
        message: "Quotation accepted. Order created.",
        data: order,
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async rejectQuotation(req: AuthRequest, res: Response) {
    try {
      await RequestService.rejectQuotation(
        String(req.params.quotationId),
        req.user!.userId,
      );
      return res.status(200).json({
        success: true,
        message: "Quotation rejected.",
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}
