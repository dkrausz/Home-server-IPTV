import path from "path";
import fs from "fs/promises";
import { NextFunction, Request, Response } from "express";

class TesteVideo {
  private tempDir = path.join(process.cwd(), "uploads", "temp");

  public teste = async (req: Request, res: Response, next: NextFunction) => {
    console.log(this.tempDir);
    const files = await fs.readdir(this.tempDir);
    console.log("files", files);
    for (let file of files) {
      console.log(file);
    }
    next();
  };
}

export const testeVideo = new TesteVideo();
