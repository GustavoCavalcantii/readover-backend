import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../@types/Responses/ErrorResponse";

export default function JsonRequiredMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {

   if (req.headers["content-type"] !== "application/json") {
     res
       .status(415)
       .json(ErrorResponse("A requisição deve ser no formato JSON", 415));
     return;
   }

  next();
}
