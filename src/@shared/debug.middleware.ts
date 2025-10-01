import { NextFunction, Request, Response } from "express";
import { videoService } from "../videos/services/videoService";
import path from "path";

class DebugMiddleware {
  public printRequest = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.file);
    // console.log(path.resolve(videoService.getVideoPath()));
    next();
  };
}

export const debugMiddleware = new DebugMiddleware();
