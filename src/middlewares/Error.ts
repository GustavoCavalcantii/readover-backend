import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../@types/Responses/ErrorResponse";
import logger from "../config/Logger";

export function ErrorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(err);

  const responseBody = ErrorResponse("Erro interno do servidor", 500);

  res.status(500).json(responseBody);
}
