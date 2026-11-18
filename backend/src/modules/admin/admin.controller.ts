import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { Response } from "express";
import { prisma } from "../../lib/prisma";
import { AuthRequest } from "../../middlewares/auth.middleware";

export class AdminController {
  static async createMember(req: AuthRequest, res: Response) {
    try {
      const email =
        typeof req.body.email === "string"
          ? req.body.email.trim().toLowerCase()
          : "";
      const fullName =
        typeof req.body.fullName === "string" ? req.body.fullName.trim() : "";
      const phone =
        typeof req.body.phone === "string" ? req.body.phone.trim() : undefined;
      const designation =
        typeof req.body.designation === "string"
          ? req.body.designation.trim()
          : undefined;
      const department =
        typeof req.body.department === "string"
          ? req.body.department.trim()
          : undefined;

      if (!email || !fullName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
          success: false,
          message: "A valid email and full name are required",
        });
      }

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return res
          .status(400)
          .json({ success: false, message: "Email already registered" });
      }

      const teamRole = await prisma.role.findUnique({
        where: { name: "TEAM" },
      });
      if (!teamRole) throw new Error("TEAM role not found");

      const temporaryPassword = randomBytes(18).toString("base64url");
      const passwordHash = await bcrypt.hash(temporaryPassword, 12);

      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          fullName,
          phone,
          roleId: teamRole.id,
          emailVerified: true,
          isActive: true,
          profile: {
            create: {
              companyName: department || null,
              bio: designation || null,
            },
          },
        },
        select: { id: true, email: true, fullName: true },
      });

      return res.status(201).json({
        success: true,
        message: "Member created. Share the temporary password securely.",
        data: { ...user, temporaryPassword },
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getAllTeamMembers(req: AuthRequest, res: Response) {
    try {
      const members = await prisma.user.findMany({
        where: { role: { is: { name: "TEAM" } } },
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          isActive: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json({ success: true, data: members });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async toggleMemberStatus(req: AuthRequest, res: Response) {
    try {
      const id = String(req.params.id);
      const user = await prisma.user.findFirst({
        where: { id, role: { is: { name: "TEAM" } } },
        select: { id: true, isActive: true },
      });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Team member not found" });
      }

      const updated = await prisma.user.update({
        where: { id },
        data: { isActive: !user.isActive },
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          isActive: true,
          createdAt: true,
        },
      });

      return res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

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
