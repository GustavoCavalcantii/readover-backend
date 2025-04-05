import { Request, Response, NextFunction } from "express";
import { MaintenanceResponse } from "../@types/Responses/MaintenanceResponse";

export default function MaintenanceMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const isMaintenance = process.env.MAINTENANCE === "true";

  if (isMaintenance) {
    res.status(503).json(MaintenanceResponse());
    return; 
  }

  next();
}
