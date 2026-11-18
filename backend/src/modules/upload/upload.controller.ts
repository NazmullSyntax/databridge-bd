import { Response } from "express";
import cloudinary from "../../lib/cloudinary";
import { AuthRequest } from "../../middlewares/auth.middleware";

export class UploadController {
  static async uploadFile(req: AuthRequest, res: Response) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });
      }

      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "databridge-bd", resource_type: "auto" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        uploadStream.end(req.file!.buffer);
      });

      return res.status(200).json({
        success: true,
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          size: result.bytes,
        },
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
