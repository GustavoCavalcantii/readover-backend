import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ErrorResponse } from "../@types/Responses/Index";
import { userService } from "../services/UserService";

const SECRET_KEY = process.env.JWT_SECRET as string;

export default async function VerifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json(ErrorResponse("Token não fornecido", 401));
    return;
  }

  let decoded;
  try {
    decoded = jwt.verify(token, SECRET_KEY);
  } catch (e) {
    res.status(401).json(ErrorResponse("Não autorizado", 401));
    return;
  }

  if (!decoded) {
    res.status(401).json(ErrorResponse("Não autorizado", 401));
    return;
  }

  const { id } = decoded as JwtPayload;

  const user = await userService.getUserById(id);

  if (!user || user.deleted) {
    res.status(401).json(ErrorResponse("Não autorizado", 401));
    return;
  }

  req.user = user;

  next();
}
