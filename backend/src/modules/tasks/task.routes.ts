import { Router } from "express";
import { TaskController } from "./task.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";

const router = Router();
router.use(authenticate);

router.post("/create", authorize("ADMIN"), TaskController.createTask);
router.get("/my", TaskController.getMyTasks);
router.post("/", authorize("ADMIN", "TEAM"), TaskController.create);
router.get("/project/:projectId", TaskController.getTasksByProject);
router.patch(
  "/:id/status",
  authorize("ADMIN", "TEAM"),
  TaskController.updateTaskStatus,
);
router.post(
  "/:id/response",
  authorize("ADMIN", "TEAM"),
  TaskController.addResponse,
);

export default router;
