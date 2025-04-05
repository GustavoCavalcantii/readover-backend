import { Request, Response } from "express";
import { ErrorResponse, SuccessResponse } from "../@types/Responses/Index";
import { userService } from "../services/UserService";
import { plainToInstance } from "class-transformer";
import { UpdateUserDTO } from "../dtos/UpdateUserDTO";
import { ISecureUser } from "../interfaces/ISecureUser";
import LoanService from "../services/LoanService";

export default class AdminController {
  static async getUsers(req: Request, res: Response) {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      res.status(401).json(ErrorResponse("Usuário não autenticado.", 401));
      return;
    }

    try {
      const users = await userService.getAllUsersExcept(loggedInUser.id);

      if (!users) {
        res.status(204).end();
        return;
      }

      let allUsers: ISecureUser[] = [];

      users.forEach(async (user) => {
        const loansName = await LoanService.getLoansNameByUser(user.id);

        const payload: ISecureUser = {
          username: user.username,
          email: user.email,
          grade: user.grade,
          profileImage: user.profileImage,
          activeLoans: loansName,
        };

        allUsers.push(payload);
      });

      if (allUsers && allUsers.length <= 0) {
        res.status(204).end();
        return;
      }

      res
        .status(200)
        .json(
          SuccessResponse(allUsers, "Usuários localizados com sucesso", 200)
        );
    } catch (error) {
      res.status(500).json(ErrorResponse("Ocorreu um erro desconhecido", 500));
    }
  }

  static async changeUserAccess(req: Request, res: Response) {
    try {
      const userDto = plainToInstance(UpdateUserDTO, req.body);
      const loggedInUser = req.user;

      if (!loggedInUser) {
        res.status(401).json(ErrorResponse("Usuário não autenticado.", 401));
        return;
      }

      const user = await userService.getUserByEmail(userDto.email);

      if (!user) {
        res.status(400).json(ErrorResponse("Usuário não encontrado.", 400));
        return;
      }

      if (user.id === loggedInUser.id) {
        res
          .status(400)
          .json(ErrorResponse("Você não pode alterar seu próprio cargo.", 400));
        return;
      }

      userService.updateAccessLevel(user.id, userDto.isAdmin);

      res
        .status(200)
        .json(
          SuccessResponse(null, "Nível de acesso alterado com sucesso", 200)
        );
    } catch (error) {
      res.status(500).json(ErrorResponse("Ocorreu um erro desconhecido", 500));
    }
  }
}
