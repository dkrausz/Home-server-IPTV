import express, { json, NextFunction, Request, Response } from "express";
import { createVideos, videosPath } from "./video";

export const app = express();

app.use(json());
app.use(
  "/videos",
  (req: Request, res: Response, next: NextFunction) => {
    console.log("está tentando acessar");
    next();
  },
  express.static(videosPath)
);

app.get("/refresh", (req: Request, res: Response) => {
  createVideos();
  res.status(200).json("playlist atualizada");
});
