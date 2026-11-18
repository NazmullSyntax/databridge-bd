import { Router } from "express";
import { InvoiceController } from "./invoice.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";

const router = Router();
router.use(authenticate);

router.post("/", authorize("ADMIN"), InvoiceController.create);
router.get("/", authorize("ADMIN"), InvoiceController.getAll);
router.get("/my", authorize("CUSTOMER"), InvoiceController.getMy);
router.post(
  "/:id/payment",
  authorize("ADMIN"),
  InvoiceController.recordPayment,
);

export default router;
