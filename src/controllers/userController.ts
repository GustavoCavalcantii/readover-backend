import { Request, Response } from "express";
import { SuccessResponse } from "../@types/Responses/SuccessResponse";
import { ErrorResponse } from "../@types/Responses/ErrorResponse";
import { userService } from "../services/UserService";
import { UserDTO } from "../dtos/UserDTO";
import logger from "../config/Logger";
import { plainToClass } from "class-transformer";
import { IUser } from "../interfaces/IUser";
import AuthService from "../services/AuthService";
import { ConsultProfile } from "../dtos/ConsultProfile";
import ImageService from "../services/ImageService";
import { ImageTypes } from "../enums/Image/ImageTypes";
import { ISecureUser } from "../interfaces/ISecureUser";

class UserController {
  static async register(req: Request, res: Response) {
    try {
      const createUserDto = plainToClass(UserDTO, req.body);

      const existingUser = await userService.getUserByEmail(
        createUserDto.email
      );

      if (existingUser) {
        if (!existingUser.deleted) {
          res.status(400).json(ErrorResponse("E-mail já em uso.", 400));
          return;
        }

        const updateResult = await existingUser.updateOne({
          deleted: false,
        });

        if (updateResult.nModified === 0) {
          res
            .status(500)
            .json(ErrorResponse("Erro ao reativar o usuário", 500));

          return;
        }

        const response = {
          username: existingUser.username,
          email: existingUser.email,
        };

        res
          .status(200)
          .json(
            SuccessResponse(response, "Usuário reativado com sucesso!", 200)
          );
        return;
      }

      const user = await userService.createUser(createUserDto);
      logger.info(`Usuário ${user.username} criado.`);

      const response = {
        username: user.username,
        email: user.email,
      };

      res
        .status(201)
        .json(SuccessResponse(response, "Usuário criado com sucesso!", 201));
    } catch (error) {
      logger.error("Erro ao registrar usuário", error);
      res.status(500).json(ErrorResponse("Erro interno do servidor.", 500));
    }
  }

  static async edit(req: Request, res: Response) {
    try {
      const loggedInUser = req.user as IUser;
      if (!loggedInUser) {
        res.status(401).json(ErrorResponse("Usuário não autenticado.", 401));
        return;
      }

      const userData = plainToClass(UserDTO, req.body);

      const updatedUser = await userService.updateUser(
        loggedInUser.id,
        userData
      );

      if (!updatedUser) {
        res.status(401).json(ErrorResponse("Usuário não encontrado", 401));
        return;
      }

      const response = {
        username: updatedUser.username,
        email: updatedUser.email,
      };

      res
        .status(200)
        .json(
          SuccessResponse(response, "Usuário atualizado com sucesso!", 200)
        );
    } catch (error) {
      let obError = error as Error;

      const commonErrors = [
        "Este e-mail já está em uso. Tente outro.",
        "Nenhuma alteração válida detectada.",
        "Usuário não encontrado",
        "A alteração de e-mail requer verificação.",
        "A alteração de senha requer verificação.",
      ];

      if (commonErrors.includes(obError.message)) {
        res.status(400).json(ErrorResponse(obError.message, 400));
        return;
      }

      logger.error("Erro ao atualizar usuário", error);
      res.status(500).json(ErrorResponse("Erro ao atualizar usuário.", 500));
    }
  }

  static async getProfileImage(req: Request, res: Response) {
    try {
      const consultUserDto = plainToClass(ConsultProfile, req.params);

      const route = await ImageService.getImage(
        consultUserDto.imageId,
        ImageTypes.PROFILE
      );

      res.status(200).sendFile(route);
    } catch (error) {
      logger.error("Erro ao consultar a imagem de perfil do usuário", error);
      res
        .status(500)
        .json(
          ErrorResponse("Erro ao consultar a imagem de perfil usuário", 500)
        );
    }
  }

  static async setProfileImage(req: Request, res: Response) {
    try {
      const loggedInUser = req.user as IUser;
      if (!loggedInUser) {
        res.status(401).json(ErrorResponse("Usuário não autenticado.", 401));
        return;
      }

      if (!req.file || !req.newFilename) {
        res.status(400).json(ErrorResponse("Nenhum arquivo enviado.", 400));
        return;
      }

      const imageName = req.newFilename;

      userService.setUserProfileImage(loggedInUser.id, imageName);

      res
        .status(200)
        .json(
          SuccessResponse(null, "Imagem de perfil atualizado com sucesso", 200)
        );
    } catch (error) {
      logger.error("Erro ao atualizar a imagem de perfil do usuário", error);
      res
        .status(500)
        .json(
          ErrorResponse("Erro ao atualizar a imagem de perfil usuário", 500)
        );
    }
  }

  static async getInfo(req: Request, res: Response) {
    try {
      const loggedInUser = req.user as IUser;
      if (!loggedInUser) {
        res.status(401).json(ErrorResponse("Usuário não autenticado.", 401));
        return;
      }

      const user = await userService.getUserById(loggedInUser.id);

      if (!user) {
        return;
      }

      const activeLoans = await userService.getActiveLoansName(user.id);

      const payload: ISecureUser = {
        username: user.username,
        email: user.email,
        grade: user.grade,
        profileImage: user.profileImage,
        activeLoans: activeLoans,
      };

      res
        .status(200)
        .json(
          SuccessResponse(
            payload,
            "Informações do usuário recebidas com sucesso",
            200
          )
        );
    } catch (error) {
      logger.error("Erro ao deletar usuário", error);
      res.status(500).json(ErrorResponse("Erro ao deletar usuário", 500));
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const loggedInUser = req.user as IUser;
      if (!loggedInUser) {
        res.status(401).json(ErrorResponse("Usuário não autenticado.", 401));
        return;
      }

      await userService.deleteUser(loggedInUser.id);
      await AuthService.deleteRefreshTokens(loggedInUser.id);
      res.clearCookie("refreshToken");

      res
        .status(200)
        .json(SuccessResponse(null, "Usuário deletado com sucesso", 200));
    } catch (error) {
      logger.error("Erro ao deletar usuário", error);
      res.status(500).json(ErrorResponse("Erro ao deletar usuário", 500));
    }
  }
}

export default UserController;
