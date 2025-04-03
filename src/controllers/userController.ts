import { Request, response, Response } from "express";
import { SuccessResponse } from "../@types/Responses/SuccessResponse";
import { ErrorResponse } from "../@types/Responses/ErrorResponse";
import { userService } from "../services/UserService";
import { UserDTO } from "../dtos/UserDTO";
import logger from "../config/logger";
import { IErrorDetail } from "../interfaces/IErrorDetail";
import { plainToClass } from "class-transformer";
import User from "../models/User";
import bcrypt from "bcryptjs";
import AuthService from "../services/AuthService";
import { IUser } from "../interfaces/IUser";
import { RefreshToken } from "../models/RefreshToken.";

export default class UserController {
  private static async generateTokens(
    req: Request,
    user: IUser
  ): Promise<{ refreshToken: string; accessToken: string }> {
    const { refreshToken, accessToken } = await AuthService.createTokens(
      user.id,
      req.headers["user-agent"] || "unknown",
      req.ip || "0.0.0.0"
    );

    return { refreshToken, accessToken };
  }

  private static async generatePayload(
    req: Request,
    res: Response,
    user: IUser
  ) {
    const { refreshToken, accessToken } = await UserController.generateTokens(
      req,
      user
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      username: user.username,
      email: user.email,
      token: accessToken,
      refreshToken,
    };
  }

  static async login(req: Request, res: Response) {
    const userDto = plainToClass(UserDTO, req.body);

    const user = await User.findOne({ email: userDto.email });

    const invalidCredential: IErrorDetail[] = [
      {
        field: "email",
        message:
          "O email fornecido não corresponde a nenhum usuário registrado.",
      },
      {
        field: "password",
        message: "A senha fornecida está incorreta.",
      },
    ];

    if (!user) {
      res
        .status(401)
        .json(ErrorResponse("Usuário não encontrado", 401, invalidCredential));

      return;
    }

    const isPasswordValid = await bcrypt.compare(
      userDto.password,
      user.password
    );

    if (!isPasswordValid) {
      res
        .status(401)
        .json(ErrorResponse("Usuário não encontrado", 401, invalidCredential));

      return;
    }

    const response = await UserController.generatePayload(req, res, user);

    res
      .status(200)
      .json(SuccessResponse(response, "Usuário logado com sucesso", 200));
  }

  static async register(req: Request, res: Response) {
    const createUserDto = plainToClass(UserDTO, req.body);

    try {
      const user = await userService.createUser(createUserDto);

      const response = await UserController.generatePayload(req, res, user);

      res
        .status(201)
        .json(SuccessResponse(response, "Usuário criado com sucesso!", 201));

      logger.info(`Usuário ${user.username} criado`);
    } catch (error) {
      logger.error("Erro ao registrar usuário", error);

      if (!(error instanceof Error)) {
        res
          .status(500)
          .json(
            ErrorResponse("Erro desconhecido. Tente novamente mais tarde.", 500)
          );
      }

      let obError = error as Error;

      if (obError.message === "Este email já está em uso. Tente outro.") {
        const details: IErrorDetail[] = [
          {
            field: "email",
            message: "Este e-mail já está em uso. Tente outro.",
          },
        ];

        res
          .status(400)
          .json(ErrorResponse("Credenciais inválidas", 400, details));

        return;
      }

      res
        .status(500)
        .json(
          ErrorResponse(
            "Erro interno do servidor. Tente novamente mais tarde.",
            500
          )
        );
    }
  }

  static async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401).json(ErrorResponse("Token não fornecido", 401));
      return;
    }

    try {
      const storedRefreshToken = await RefreshToken.findOne({
        token: refreshToken,
      });

      if (!storedRefreshToken || storedRefreshToken.expiresAt < new Date()) {
        res.status(401).json(ErrorResponse("Não autorizado", 401));
        return;
      }

      const user = await userService.getUserById(storedRefreshToken.userId);

      if (!user) {
        res.status(401).json(ErrorResponse("Não autorizado", 401));
        return;
      }

      const response = await UserController.generatePayload(req, res, user);

      res
        .status(200)
        .json(SuccessResponse(response, "Token criado com sucesso", 200));
    } catch (error) {
      logger.error("Erro ao dar refresh no refreshToken", error);
      res.status(401).json(ErrorResponse("Não autorizado", 401));
    }
  }

  static async logout(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401).json(ErrorResponse("Token não fornecido", 401));
      return;
    }

    try {
      const storedRefreshToken = await RefreshToken.findOne({
        token: refreshToken,
      });

      if (!storedRefreshToken || storedRefreshToken.expiresAt < new Date()) {
        res.status(401).json(ErrorResponse("Refresh token inválido", 401));
        return;
      }

      const userAgent = req.headers["user-agent"] || "unknown";
      const ip = req.ip || "0.0.0.0";

      if (
        storedRefreshToken.userAgent !== userAgent ||
        storedRefreshToken.ip !== ip
      ) {
        res.status(401).json(ErrorResponse("Refresh token inválido", 401));
        return;
      }

      const user = await userService.getUserById(storedRefreshToken.userId);

      if (!user) {
        res.status(401).json(ErrorResponse("Não autorizado", 401));
        return;
      }

      await RefreshToken.deleteOne({ token: refreshToken });

      res.clearCookie("refreshToken");

      res
        .status(200)
        .json(SuccessResponse(null, "Usuário desconectado com sucesso", 200));
    } catch (error) {
      logger.error("Erro ao dar refresh no refreshToken", error);
      res.status(500).json(ErrorResponse("Erro ao tentar deslogar", 500));
    }
  }

  static async edit(req: Request, res: Response) {
    try {
      const loggedInUser = req.user;

      if (!loggedInUser) {
        res.status(401).json(ErrorResponse("Usuário não autenticado.", 401));
        return;
      }

      const userData = plainToClass(UserDTO, req.body);

      const updatedUser = await userService.updateUser(
        loggedInUser.id,
        userData
      );
      res.status(200).json({ updatedUser });
    } catch (error) {
      let obError = error as Error;

      const commonErrors = [
        "Este e-mail já está em uso. Tente outro.",
        "Nenhuma alteração detectada. Os dados são iguais.",
        "Usuário não encontrado",
      ];

      if (commonErrors.includes(obError.message)) {
        res.status(400).json(ErrorResponse(obError.message, 400));
        return;
      }

      logger.error("Erro ao atualizar o usuário.");
      res.status(500).json(ErrorResponse("Erro ao atualizar o usuário.", 500));
    }
  }
}
