import { Router } from "express";
import { DeliverableController } from "./deliverable.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

router.post("/", authorize("ADMIN", "TEAM"), DeliverableController.upload);
router.get("/project/:projectId", DeliverableController.getByProject);
router.delete("/:id", authorize("ADMIN", "TEAM"), DeliverableController.delete);

export default router;
