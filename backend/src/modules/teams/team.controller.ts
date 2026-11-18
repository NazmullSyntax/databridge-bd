import { Response } from "express";
import { TeamService } from "./team.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export class TeamController {
  static async create(req: AuthRequest, res: Response) {
    try {
      const { name, description, department, leaderId } = req.body;
      if (!name)
        return res
          .status(400)
          .json({ success: false, message: "Team name is required" });
      const team = await TeamService.createTeam({
        name,
        description,
        department,
        leaderId,
      });
      return res.status(201).json({ success: true, data: team });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getAll(req: AuthRequest, res: Response) {
    try {
      const teams = await TeamService.getAllTeams();
      return res.status(200).json({ success: true, data: teams });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async addMember(req: AuthRequest, res: Response) {
    try {
      const { teamId, userId, role } = req.body;
      const result = await TeamService.addMember(teamId, userId, role);
      return res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async removeMember(req: AuthRequest, res: Response) {
    try {
      const { teamId, userId } = req.params;
      await TeamService.removeMember(String(teamId), String(userId));
      return res.status(200).json({ success: true, message: "Member removed" });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getById(req: AuthRequest, res: Response) {
    try {
      const team = await TeamService.getTeamById(String(req.params.id));
      if (!team)
        return res
          .status(404)
          .json({ success: false, message: "Team not found" });
      return res.status(200).json({ success: true, data: team });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
