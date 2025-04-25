import rateLimit from "express-rate-limit";
import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../@types/Responses/ErrorResponse";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000,
  message: "Muitas requisições! Tente novamente mais tarde.",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request): string => {
    const ip = req.headers["x-forwarded-for"];
    if (typeof ip === "string") return ip;
    if (Array.isArray(ip)) return ip[0];
    return req.socket.remoteAddress || "unknown";
  },
  handler: (req: Request, res: Response, next: NextFunction) => {
    res
      .status(429)
      .json(
        ErrorResponse("Muitas requisições. Tente novamente mais tarde.", 429)
      );
  },
});
