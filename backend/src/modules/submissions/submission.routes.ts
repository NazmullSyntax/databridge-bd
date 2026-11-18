import { Router } from "express";
import { SubmissionController } from "./submission.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";

const router = Router();
router.use(authenticate);

router.post("/", authorize("TEAM", "ADMIN"), SubmissionController.create);
router.get(
  "/project/:projectId",
  authorize("ADMIN"),
  SubmissionController.getByProject,
);
router.patch("/:id/review", authorize("ADMIN"), SubmissionController.review);
router.patch(
  "/:id/customer-review",
  authorize("CUSTOMER"),
  SubmissionController.customerReview,
);
router.get(
  "/customer/project/:projectId",
  authorize("CUSTOMER"),
  SubmissionController.getForCustomer,
);

export default router;
