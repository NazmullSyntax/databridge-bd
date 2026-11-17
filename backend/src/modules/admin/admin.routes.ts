import { Router } from "express";
import { AdminController } from "./admin.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";

const router = Router();

// সব রুটে আগে লগইন চেক হবে, তারপর রোল চেক হবে
router.use(authenticate);
router.use(authorize("ADMIN")); // শুধুমাত্র ADMIN রোল ঢুকতে পারবে

router.get("/users/team", AdminController.getTeamMembers);
router.get("/requests", AdminController.getAllRequests);
router.get("/requests/:id", AdminController.getRequestById);
router.post("/requests/:id/quotation", AdminController.createQuotation);

export default router;
