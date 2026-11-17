import { Router } from "express";
import { ProjectController } from "./project.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

// সবাই নিজের প্রজেক্ট দেখতে পারবে
router.get("/my", ProjectController.getMyProjects);

// শুধু ADMIN
router.post("/", authorize("ADMIN"), ProjectController.createProject);
router.get("/", authorize("ADMIN"), ProjectController.getAllProjects);
router.post("/assign", authorize("ADMIN"), ProjectController.assignTeam);

// ADMIN ও TEAM
router.patch(
  "/:id/status",
  authorize("ADMIN", "TEAM"),
  ProjectController.updateStatus,
);

export default router;
