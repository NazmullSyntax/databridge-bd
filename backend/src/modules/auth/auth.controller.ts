import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { AuthService } from "./auth.service";
import { registerSchema, loginSchema } from "./auth.schema";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: parsed.error.issues,
        });
      }
      const result = await AuthService.register(parsed.data);
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Registration failed",
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: parsed.error.issues,
        });
      }
      const result = await AuthService.login(parsed.data);
      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message || "Login failed",
      });
    }
  }

  static async getMe(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "No token provided" });
      }

      const token = authHeader.split(" ")[1];
      const secret = process.env.JWT_SECRET || "default-secret-change-me";
      const decoded = jwt.verify(token, secret) as { userId: string };

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { role: true },
      });

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      return res.status(200).json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role.name,
        },
      });
    } catch (error) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
  }
}
