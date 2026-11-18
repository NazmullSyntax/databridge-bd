import { Response } from "express";
import { ProjectService } from "./project.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export class ProjectController {
  static async createProject(req: AuthRequest, res: Response) {
    try {
      const { orderId, title, dueDate } = req.body;
      if (!orderId || !title || !dueDate) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields" });
      }
      const project = await ProjectService.createFromOrder(
        orderId,
        title,
        dueDate,
      );
      return res.status(201).json({ success: true, data: project });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getAllProjects(req: AuthRequest, res: Response) {
    try {
      const projects = await ProjectService.getAllProjects();
      return res.status(200).json({ success: true, data: projects });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getAdminProjectDetail(req: AuthRequest, res: Response) {
    try {
      const project = await ProjectService.getProjectDetailForAdmin(
        String(req.params.id),
      );
      if (!project) {
        return res
          .status(404)
          .json({ success: false, message: "Project not found" });
      }
      return res.status(200).json({ success: true, data: project });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async adminUpdate(req: AuthRequest, res: Response) {
    try {
      const { status, progress, dueDate } = req.body;
      const project = await ProjectService.adminUpdateProject(
        String(req.params.id),
        { status, progress, dueDate },
      );
      return res.status(200).json({ success: true, data: project });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async assignTeam(req: AuthRequest, res: Response) {
    try {
      const { projectId, userId, role } = req.body;
      const assignment = await ProjectService.assignTeamMember(
        projectId,
        userId,
        role,
      );
      return res.status(201).json({ success: true, data: assignment });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getMyProjects(req: AuthRequest, res: Response) {
    try {
      const projects = await ProjectService.getMyProjects(req.user!.userId);
      return res.status(200).json({ success: true, data: projects });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getCustomerProjects(req: AuthRequest, res: Response) {
    try {
      const projects = await ProjectService.getCustomerProjects(
        req.user!.userId,
      );
      return res.status(200).json({ success: true, data: projects });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getCustomerProjectDetail(req: AuthRequest, res: Response) {
    try {
      const project = await ProjectService.getCustomerProjectById(
        String(req.params.id),
        req.user!.userId,
      );
      if (!project) {
        return res
          .status(404)
          .json({ success: false, message: "Project not found" });
      }
      return res.status(200).json({ success: true, data: project });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateStatus(req: AuthRequest, res: Response) {
    try {
      const { status, progress } = req.body;
      const project = await ProjectService.updateProjectStatus(
        String(req.params.id),
        status,
        progress,
      );
      return res.status(200).json({ success: true, data: project });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}
