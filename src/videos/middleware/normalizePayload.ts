import { NextFunction, Request, Response } from "express";

class NormalizePayload {
  public normalizeRequest = (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const names = Array.isArray(body.name) ? body.name : [body.name];
    const categories = Array.isArray(body.category) ? body.category : [body.category];
    const folders = Array.isArray(body.folderName) ? body.folderName : [body.folderName];

    req.body = { name: names, categoy: categories, folderName: folders };
    next();
  };
}

export const normalizePayload = new NormalizePayload();
