import { Response } from "express";
import { TaskService } from "./task.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export class TaskController {
  static async create(req: AuthRequest, res: Response) {
    try {
      const { projectId, title, description, location, assignedTo, dueDate } =
        req.body;
      if (!projectId || !title) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields" });
      }
      const task = await TaskService.create(projectId, {
        title,
        description,
        location,
        assignedTo,
        dueDate,
      });
      return res.status(201).json({ success: true, data: task });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async createTask(req: AuthRequest, res: Response) {
    try {
      const { projectId, title, description, assignedTo, dueDate, priority } =
        req.body;
      if (!projectId || !title || !assignedTo || !dueDate) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields" });
      }
      const task = await TaskService.createTask({
        projectId,
        title,
        description: description || "",
        assignedTo,
        dueDate,
        priority: priority || "MEDIUM",
      });
      return res.status(201).json({ success: true, data: task });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getByProject(req: AuthRequest, res: Response) {
    try {
      const tasks = await TaskService.getByProject(
        String(req.params.projectId),
      );
      return res.status(200).json({ success: true, data: tasks });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getMyTasks(req: AuthRequest, res: Response) {
    try {
      const tasks = await TaskService.getMyTasks(req.user!.userId);
      return res.status(200).json({ success: true, data: tasks });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateTaskStatus(req: AuthRequest, res: Response) {
    try {
      const { status } = req.body;
      const task = await TaskService.updateTaskStatus(
        String(req.params.id),
        status,
      );
      return res.status(200).json({ success: true, data: task });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getTasksByProject(req: AuthRequest, res: Response) {
    try {
      const tasks = await TaskService.getTasksByProject(
        String(req.params.projectId),
      );
      return res.status(200).json({ success: true, data: tasks });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateStatus(req: AuthRequest, res: Response) {
    try {
      const { status } = req.body;
      const task = await TaskService.updateStatus(
        String(req.params.id),
        status,
      );
      return res.status(200).json({ success: true, data: task });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async addResponse(req: AuthRequest, res: Response) {
    try {
      const { responseData } = req.body;
      const response = await TaskService.addSurveyResponse(
        String(req.params.id),
        responseData,
        req.user!.userId,
      );
      return res.status(201).json({ success: true, data: response });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}
