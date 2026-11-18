import { Router } from "express";
import { MessageController } from "./message.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();
router.use(authenticate);

router.post("/", MessageController.send);
router.get("/project/:projectId", MessageController.getByProject);

export default router;
