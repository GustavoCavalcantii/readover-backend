import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/Responses";

const SECRET_KEY = process.env.JWT_SECRET as string;

export default function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorizationHeader = req.headers.authorization;
  let token;

  if (authorizationHeader && authorizationHeader.startsWith("Bearer "))
    token = authorizationHeader.split(" ")[1];

  if (!token) {
    res.status(401).json(errorResponse("Token não fornecido", 401));
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    (req as any).user = decoded;

    next();
  } catch (error) {
    res.status(401).json(errorResponse("Token inválido", 401));
  }
}
