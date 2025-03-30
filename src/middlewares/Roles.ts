import { Request, Response, NextFunction } from "express";
import { Roles } from "../enums/User/UserRole";
import { ErrorResponse } from "../@types/Responses/ErrorResponse";


export function ValidateRoles(neededRole: Roles) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = req.user;

    const rolesHierarchy = {
      [Roles.USER]: 0,
      [Roles.ADMIN]: 1,
    };

    if (!loggedInUser || rolesHierarchy[loggedInUser.accessLevel] < rolesHierarchy[neededRole]) {
      res.status(401).json(ErrorResponse("Não autorizado", 401));
      return;
    }

    next();
  };
}
