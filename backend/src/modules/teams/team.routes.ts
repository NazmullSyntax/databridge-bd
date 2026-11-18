import { Router } from "express";
import { TeamController } from "./team.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";

const router = Router();
router.use(authenticate);

router.post("/", authorize("ADMIN"), TeamController.create);
router.get("/", TeamController.getAll);
router.get("/:id", TeamController.getById);
router.post("/add-member", authorize("ADMIN"), TeamController.addMember);
router.patch("/set-leader", authorize("ADMIN"), TeamController.setLeader);
router.delete(
  "/:teamId/members/:userId",
  authorize("ADMIN"),
  TeamController.removeMember,
);

export default router;
