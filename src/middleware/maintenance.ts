import { Request, Response, NextFunction } from "express";
import { maintenanceResponse } from "../utils/Responses";

export default function maintenanceMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const isMaintenance = process.env.MAINTENANCE === "true";

  if (isMaintenance) {
    res.status(503).json(maintenanceResponse());
    return; 
  }

  next();
}
