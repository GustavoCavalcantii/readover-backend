import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../@types/Responses/ErrorResponse";

export function NotFoundMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const responseBody = ErrorResponse("Rota não encontrada", 404);
  res.status(404).json(responseBody);
}
