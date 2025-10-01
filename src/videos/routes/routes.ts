import express, { NextFunction, Request, Response, Router, ErrorRequestHandler } from "express";
import { videoController } from "../controller/videoController";
import { videoService } from "../services/videoService";
import { validateVideoMiddleware } from "../middleware/validateVideo";
import { bodyValidator } from "../middleware/bodyValidator";
import { videoSchema } from "../schema/videoSchema";
import { debugMiddleware } from "../../@shared/debug.middleware";
import { multerManyfiles } from "../middleware/multerManyFiles";
import { testeVideo } from "../middleware/teste";

export const videoRouter = Router();

// videoRouter.post("/upload", validateVideoMiddleware.validateVideo("video"), bodyValidator.isValid(videoSchema), videoController.uploadNewVideo);

videoRouter.post("/uploads", multerManyfiles.UploadVideos(), videoController.uploadNewListVideo);

videoRouter.use("/", express.static(videoService.getVideoPath()));
videoRouter.get("/master", videoController.getMaster);
// videoRouter.get("/refresh", videoController.updateDataBase);
