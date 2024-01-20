import { Response, Request, NextFunction, RequestHandler } from "express";

export function dbHandler(requestHandler: RequestHandler) {
  return (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(requestHandler(req, res, next)).catch((error) =>
      next(error)
    );
}
