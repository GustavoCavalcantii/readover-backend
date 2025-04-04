import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../@types/Responses/ErrorResponse";

export function ValidateFileSender(req: Request, res: Response, next: NextFunction) {
  if (!req.file) {
    res.status(400).json(ErrorResponse("Nenhum arquivo enviado.", 400));
    return;
  }

  next();
}
