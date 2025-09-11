import express, { Router } from "express";
import { videoController } from "../controller/videoController";
import { videoService } from "../services/videoService";
import { validateVideoMiddleware } from "../middleware/validateVideo";
import { bodyValidator } from "../middleware/bodyValidator";
import { videoSchema } from "../schema/videoSchema";

export const videoRouter = Router();

videoRouter.post("/upload", validateVideoMiddleware.validateVideo("video"), bodyValidator.isValid(videoSchema), videoController.uploadNewVideo);
videoRouter.use("/", express.static(videoService.getVideoPath()));
// videoRouter.get("/refresh", videoController.updateDataBase);
