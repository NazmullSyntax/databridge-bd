import { Response } from "express";
import { InvoiceService } from "./invoice.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export class InvoiceController {
  static async create(req: AuthRequest, res: Response) {
    try {
      const { orderId } = req.body;
      const invoice = await InvoiceService.createFromOrder(orderId);
      return res.status(201).json({ success: true, data: invoice });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getAll(req: AuthRequest, res: Response) {
    try {
      const invoices = await InvoiceService.getAllInvoices();
      return res.status(200).json({ success: true, data: invoices });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getMy(req: AuthRequest, res: Response) {
    try {
      const invoices = await InvoiceService.getMyInvoices(req.user!.userId);
      return res.status(200).json({ success: true, data: invoices });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async recordPayment(req: AuthRequest, res: Response) {
    try {
      const { amount, method, transactionId } = req.body;
      const result = await InvoiceService.recordPayment(String(req.params.id), {
        amount: parseFloat(amount),
        method,
        transactionId,
      });
      return res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}
