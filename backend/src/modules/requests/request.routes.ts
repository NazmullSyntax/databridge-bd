import { Router } from "express";
import { RequestController } from "./request.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.use(authenticate); // সব রিকোয়েস্টে টোকেন চেক হবে

router.post("/", RequestController.create);
router.get("/my", RequestController.getMyRequests);

export default router;
