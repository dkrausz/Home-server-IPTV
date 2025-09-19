import multer from "multer";
import path from "path";
import { AppError } from "../../@shared/appError";
import { NextFunction, Request, Response } from "express";
import fs from "fs";

class ValidadeVideoMiddleware {
  private tempDir = path.join(process.cwd(), "uploads", "temp");

  constructor() {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }
  public validateVideo = (fieldName: string) => {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => cb(null, this.tempDir),
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext);

        cb(null, `tempVideo${ext}`);
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
      fileSize: 5 * 1024 * 1024 * 1024,
    };

    const upload = multer({ storage, fileFilter, limits });

    return upload.single(fieldName);
  };
}

export const validateVideoMiddleware = new ValidadeVideoMiddleware();
