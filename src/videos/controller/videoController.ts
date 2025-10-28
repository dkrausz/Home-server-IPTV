import { Request, Response } from "express";
import { videoService } from "../services/videoService";

class VideoController {
  constructor() {}

  public uploadNewListVideo = async (req: Request, res: Response): Promise<Response> => {
    console.log("controller", req.body);
    const newVideo = await videoService.uploadNewVideoList(req.body);
    return res.status(201).json(newVideo);
  };

  public getMaster = async (req: Request, res: Response): Promise<Response> => {
    const urlMaster = await videoService.getMasterAddress();
    return res.status(200).json(urlMaster);
  };
}

export const videoController = new VideoController();
