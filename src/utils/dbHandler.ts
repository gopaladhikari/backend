import { Response, Request, NextFunction, RequestHandler } from "express";
import { RequestWithUser } from "../models/model.js";

export function dbHandler(requestHandler: RequestHandler) {
  return (req: RequestWithUser | Request, res: Response, next: NextFunction) =>
    Promise.resolve(requestHandler(req, res, next)).catch((error) =>
      next(error)
    );
}
