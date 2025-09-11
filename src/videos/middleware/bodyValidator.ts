import { NextFunction, Request, Response } from "express";
import { z } from "zod";

class BodyValidator {
  public isValid =
    <TSchema extends z.ZodTypeAny>(schema: TSchema) =>
    (req: Request, res: Response, next: NextFunction) => {
      req.body = schema.parse(req.body);
      return next();
    };
}

export const bodyValidator = new BodyValidator();
