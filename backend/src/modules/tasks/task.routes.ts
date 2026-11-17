import { Router } from "express";
import { TaskController } from "./task.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";

const router = Router();
router.use(authenticate);

router.post("/", authorize("ADMIN", "TEAM"), TaskController.create);
router.get("/project/:projectId", TaskController.getByProject);
router.patch(
  "/:id/status",
  authorize("ADMIN", "TEAM"),
  TaskController.updateStatus,
);
router.post(
  "/:id/response",
  authorize("ADMIN", "TEAM"),
  TaskController.addResponse,
);

export default router;
