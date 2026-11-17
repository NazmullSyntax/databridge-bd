import { Router } from "express";
import { ReviewController } from "./review.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";

const router = Router();
router.use(authenticate);

router.post("/", authorize("CUSTOMER"), ReviewController.create);

export default router;
