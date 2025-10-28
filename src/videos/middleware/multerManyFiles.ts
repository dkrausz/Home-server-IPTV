import fs from "fs";
import multer from "multer";
import path from "path";
import { AppError } from "../../@shared/appError";

class saveManyFilesMiddleware {
  private tempDir = path.join(process.cwd(), "uploads", "temp");

  constructor() {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  private sanitizeFilename(name: string) {
    return name.replace(/[:<>"/\\|?*]/g, "-");
  }

  public UploadVideos = () => {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.tempDir);
      },
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext);
        cb(null, `${req.body.name}@@${Date.now()}.mp4`);
      },
    });

    const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
      if (file.mimetype.startsWith("video/")) {
        cb(null, true);
      } else {
        cb(new AppError(403, "Tipo de arquivo não permitido") as any, false);
      }
    };

    const limits: multer.Options["limits"] = {
      fileSize: 10 * 1024 * 1024 * 1024,
    };

    const upload = multer({ storage, limits, fileFilter });

    return upload.array("video");
  };
}

export const multerManyfiles = new saveManyFilesMiddleware();
