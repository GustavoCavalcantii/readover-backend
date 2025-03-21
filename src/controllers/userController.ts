import { Request, Response } from "express";
import { SuccessResponse } from "../types/Responses/SuccessResponse";
import { ErrorResponse } from "../types/Responses/ErrorResponse";
import { userService } from "../services/UserService";
import { UserDTO } from "../dtos/UserDTO";
import logger from "../config/Logger";
import { IErrorDetail } from "../interfaces/IErrorDetail";
import { plainToClass } from "class-transformer";
import User from "../models/User";
import bcrypt from "bcryptjs";

export default class UserController {

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

    const response = {
      username: user.username,
      email: user.email,
      token: userService.generateAuthToken(user),
    };

    res
      .status(200)
      .json(SuccessResponse(response, "Usuário logado com sucesso", 200));
  }

  static async register(req: Request, res: Response) {
    const createUserDto = plainToClass(UserDTO, req.body);

    try {
      const user = await userService.createUser(createUserDto);

      const response = {
        username: user.username,
        email: user.email,
        token: userService.generateAuthToken(user),
      };

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
}
