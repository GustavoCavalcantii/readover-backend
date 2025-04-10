import rateLimit from "express-rate-limit";
import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../@types/Responses/ErrorResponse";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000,
  message: "Muitas requisições! Tente novamente mais tarde.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response, next: NextFunction) => {
    res
      .status(429)
      .json(
        ErrorResponse("Muitas requisições. Tente novamente mais tarde.", 429)
      );
  },
});
