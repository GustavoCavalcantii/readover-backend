import { Request, Response } from "express";
import { ErrorResponse, SuccessResponse } from "../@types/Responses/Index";
import { userService } from "../services/UserService";

export default class AdminController {
  static async getUsers(req: Request, res: Response) {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      res.status(401).json(ErrorResponse("Usuário não autenticado.", 401));
      return;
    }

    const users = await userService.getAllUsersExcept(loggedInUser.id);

    if (!users) {
      res.status(204).end();
      return;
    }

    res
      .status(200)
      .json(SuccessResponse(users, "Usuários localizados com sucesso", 200));
  }
}
