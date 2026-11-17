import { Response } from "express";
import { ReviewService } from "./review.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export class ReviewController {
  static async create(req: AuthRequest, res: Response) {
    try {
      const { projectId, rating, comment } = req.body;
      if (!projectId || !rating) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields" });
      }

      const review = await ReviewService.createReview(
        projectId,
        req.user!.userId,
        rating,
        comment,
      );
      return res.status(201).json({ success: true, data: review });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}
