import { Router } from "express";
import { RequestController } from "./request.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.use(authenticate); // সব রিকোয়েস্টে টোকেন চেক হবে

router.post("/", RequestController.create);
router.get("/my", RequestController.getMyRequests);
router.get("/:id", RequestController.getMyRequestDetail);
router.post("/:quotationId/accept", RequestController.acceptQuotation);
router.post("/:quotationId/reject", RequestController.rejectQuotation);

export default router;
