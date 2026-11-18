import { Router } from "express";
import { AuditController } from "./audit.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";

const router = Router();
router.use(authenticate);
router.use(authorize("ADMIN"));
router.get("/", AuditController.getAll);

export default router;
