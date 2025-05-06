import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../@types/Responses/ErrorResponse";
import logger from "../config/Logger";

export function ErrorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof Error) {
    logger.error(`Erro: ${err.message}\nStack Trace: ${err.stack}`);
  }

  if (!(err instanceof Error)) {
    logger.error("Erro desconhecido: ", err);
  }
  const responseBody = ErrorResponse("Erro interno do servidor", 500);

  res.status(500).json(responseBody);
}
