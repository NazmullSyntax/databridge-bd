import { Router } from "express";
import multer from "multer";
import { UploadController } from "./upload.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Invalid file type"));
  },
});

router.use(authenticate);
router.post("/", upload.single("file"), UploadController.uploadFile);

export default router;
