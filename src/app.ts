import express, { json, NextFunction, Request, Response } from "express";
import { videoService } from "./videos/services/videoService";
import path from "path";
import multer from "multer";
import { validateVideoMiddleware } from "./videos/middleware/validateVideo";
import { videoRouter } from "./videos/routes/routes";

export const app = express();

app.use(json());
app.use("/videos", videoRouter);
