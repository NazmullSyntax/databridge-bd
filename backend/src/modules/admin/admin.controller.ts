import { Response } from "express";
import { prisma } from "../../lib/prisma";
import { AuthRequest } from "../../middlewares/auth.middleware";

export class AdminController {
  static async getTeamMembers(req: AuthRequest, res: Response) {
    try {
      const teamMembers = await prisma.user.findMany({
        where: {
          isActive: true,
          role: { is: { name: "TEAM" } },
        },
        select: {
          id: true,
          fullName: true,
          email: true,
        },
        orderBy: { fullName: "asc" },
      });

      return res.status(200).json({ success: true, data: teamMembers });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getAllRequests(req: AuthRequest, res: Response) {
    try {
      const requests = await prisma.dataRequest.findMany({
        include: {
          customer: {
            select: { fullName: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({ success: true, data: requests });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getRequestById(req: AuthRequest, res: Response) {
    try {
      const request = await prisma.dataRequest.findUnique({
        where: { id: String(req.params.id) }, // এখানে String() যোগ করা হয়েছে
        include: {
          customer: {
            select: { fullName: true, email: true, phone: true },
          },
          quotations: true,
        },
      });

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

  static async createQuotation(req: AuthRequest, res: Response) {
    try {
      const { amount, description, validUntil } = req.body;
      const requestId = String(req.params.id); // এখানে String() যোগ করা হয়েছে

      if (!amount || !description || !validUntil) {
        return res
          .status(400)
          .json({ success: false, message: "All fields are required" });
      }

      const request = await prisma.dataRequest.findUnique({
        where: { id: requestId }, // এখানে String() ব্যবহার হয়েছে
      });

      if (!request) {
        return res
          .status(404)
          .json({ success: false, message: "Request not found" });
      }

      const count = await prisma.quotation.count();
      const quoteNumber = `QUO-2026-${String(count + 1).padStart(4, "0")}`;

      const quotation = await prisma.quotation.create({
        data: {
          quoteNumber,
          requestId: requestId, // এখানে String() ব্যবহার হয়েছে
          amount,
          description,
          validUntil: new Date(validUntil),
          status: "SENT",
        },
      });

      await prisma.dataRequest.update({
        where: { id: requestId }, // এখানে String() ব্যবহার হয়েছে
        data: { status: "QUOTATION_SENT" },
      });

      return res.status(201).json({
        success: true,
        message: "Quotation sent successfully",
        data: quotation,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
