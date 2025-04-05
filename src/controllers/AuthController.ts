import { Request, Response } from "express";
import { SuccessResponse } from "../@types/Responses/SuccessResponse";
import { ErrorResponse } from "../@types/Responses/ErrorResponse";
import { userService } from "../services/UserService";
import AuthService from "../services/AuthService";
import { plainToClass } from "class-transformer";
import { UserDTO } from "../dtos/UserDTO";
import { RefreshToken } from "../models/RefreshToken.";
import logger from "../config/Logger";
import { EmailService } from "../services/EmailService";
import { ResetToken } from "../models/ResetToken";
import { ResetTypes } from "../enums/User/ResetTypes";

const SECRET_KEY = process.env.JWT_SECRET as string;

class AuthController {
  static async login(req: Request, res: Response) {
    const userDto = plainToClass(UserDTO, req.body);
    const user = await userService.getUserByEmail(userDto.email);

    if (
      !user ||
      !(await user.comparePassword(userDto.password)) ||
      user.deleted
    ) {
      res.status(401).json(ErrorResponse("Credenciais inválidas", 401));
      return;
    }

    const { refreshToken, accessToken } = await AuthService.createTokens(
      user.id,
      req.headers["user-agent"] || "unknown",
      req.ip || "0.0.0.0"
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const response = {
      username: user.username,
      email: user.email,
      token: accessToken,
    };

    res
      .status(200)
      .json(SuccessResponse(response, "Usuário logado com sucesso", 200));
  }

  static async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(401).json(ErrorResponse("Token não fornecido", 401));
      return;
    }

    try {
      const storedToken = await RefreshToken.findOne({ token: refreshToken });

      if (!storedToken || storedToken.expiresAt < new Date()) {
        res.status(401).json(ErrorResponse("Token inválido", 401));
        return;
      }

      const user = await userService.getUserById(storedToken.userId);
      if (!user) {
        res.status(401).json(ErrorResponse("Usuário não encontrado", 401));
        return;
      }

      const { refreshToken: newRefreshToken, accessToken } =
        await AuthService.createTokens(
          user.id,
          req.headers["user-agent"] || "unknown",
          req.ip || "0.0.0.0"
        );

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      const response = {
        username: user.username,
        email: user.email,
        token: accessToken,
      };

      AuthService.deleteRefreshToken(storedToken.token);

      res
        .status(200)
        .json(SuccessResponse(response, "Token atualizado com sucesso", 200));
    } catch (error) {
      logger.error("Erro ao atualizar token", error);
      res.status(401).json(ErrorResponse("Não autorizado", 401));
    }
  }

  static async logout(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    try {
      await AuthService.deleteRefreshToken(refreshToken);
      res.clearCookie("refreshToken");

      res
        .status(200)
        .json(SuccessResponse(null, "Usuário desconectado com sucesso", 200));
    } catch (error) {
      logger.error("Erro ao fazer logout", error);
      res.status(500).json(ErrorResponse("Erro ao tentar deslogar", 500));
    }
  }

  static async resetUserInfo(type: ResetTypes, req: Request, res: Response) {
    try {
      const userData = plainToClass(UserDTO, req.body);

      const storedToken = await ResetToken.findOne({
        token: userData.resetToken,
      });

      if (!storedToken || (storedToken && storedToken.type !== type)) {
        res.status(401).json(ErrorResponse("Token inválido", 401));
        return;
      }

      const user = await userService.getUserById(storedToken.userId);

      if (!user || user.deleted) {
        res.status(400).json(ErrorResponse("Usuário não encontrado", 400));
        return;
      }

      if (storedToken.type === ResetTypes.PASSWORD) {
        const equalPass = await user.comparePassword(userData.password);

        if (equalPass) {
          res
            .status(400)
            .json(ErrorResponse("Essa senha já está sendo utilizada", 400));
          return;
        }
      }

      if (storedToken.type === ResetTypes.EMAIL) {
        const equalMail = user.email == userData.email;
        const isAlredyUsed = await userService.getUserByEmail(userData.email);

        if (equalMail || isAlredyUsed) {
          res
            .status(400)
            .json(ErrorResponse("Esse email já está sendo utilizado", 400));
          return;
        }
      }

      await AuthService.deleteRefreshTokens(user.id);
      await AuthService.deleteToken(storedToken.token);

      let updateUser;

      if (storedToken.type === ResetTypes.PASSWORD) {
        updateUser = await userService.updatePassword(
          user.id,
          userData.password
        );
      }

      if (storedToken.type === ResetTypes.EMAIL) {
        updateUser = await userService.updateEmail(user.id, userData.email);
      }

      if (!updateUser) {
        res.status(400).json(ErrorResponse("Usuário não encontrado", 400));
        return;
      }

      const response = {
        username: updateUser.username,
        email: updateUser.email,
      };

      res
        .status(200)
        .json(SuccessResponse(response, "Senha atualizada com sucesso"));
    } catch (error) {
      const obError = error as Error;

      if (obError.message === "Usuário não encontrado") {
        res.status(400).json(ErrorResponse("Usuário não encontrado", 400));
        return;
      }

      logger.error("Erro ao atualizar a senha", error);
      res.status(500).json(ErrorResponse("Erro ao atualizar a senha", 500));
    }
  }

  static async requestResetInfo(type: ResetTypes, req: Request, res: Response) {
    try {
      const userDto = plainToClass(UserDTO, req.body);
      const user = await userService.getUserByEmail(userDto.email);

      if (!user || user.deleted) {
        res.status(400).json(ErrorResponse("Usuário não encontrado.", 400));
        return;
      }

      const token = await AuthService.createResetToken(
        user.id,
        req.headers["user-agent"] || "unknown",
        req.ip || "0.0.0.0",
        type
      );

      const link = `https://readover.techgonz.com.br/redefinir-senha?token=${token}`;

      // TODO: Implementar envio de e-mail com o link
      await EmailService.sendPasswordResetEmail(user.email, user.username, link);


      res
        .status(200)
        .json(SuccessResponse(null, "E-mail de redefinição enviado", 200));
    } catch (error) {
      logger.error("Erro ao criar o token de redefinição de senha", error);
      res
        .status(500)
        .json(
          ErrorResponse("Erro ao criar o token de redefinição de senha", 500)
        );
    }
  }
}

export default AuthController;
