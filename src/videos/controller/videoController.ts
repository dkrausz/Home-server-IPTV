import { Request, Response } from "express";
import { videoService } from "../services/videoService";

class VideoController {
  constructor() {}

  public uploadNewVideo = async (req: Request, res: Response): Promise<Response> => {
    const newVideo = await videoService.uploadNewVideo(req.body);
    return res.status(201).json(newVideo);
  };

  // public updateDataBase = async (req: Request, res: Response): Promise<Response> => {
  //   const dataBase = await videoService.createPlaylist();
  //   return res.status(200).json(dataBase);
  // };
}

export const videoController = new VideoController();
