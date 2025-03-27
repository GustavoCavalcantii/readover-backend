import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../@types/Responses/ErrorResponse"; // Verifique se ErrorResponse está implementado corretamente
import logger from "../config/Logger";

export function ErrorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(err);

  const errorMessage = err.message || "Erro interno do servidor";
  const statusCode: number = err.status || 500;

  const responseBody = ErrorResponse(errorMessage, statusCode);

  res.status(statusCode).json(responseBody);
}
