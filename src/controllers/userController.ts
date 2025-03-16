import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { errorResponse, successResponse } from "../utils/Responses";
import { LoginResponse } from "../utils/Responses/userResponse";

import { UserService } from "../service/userService";
import logger from "../config/logger";
import User from "../models/User";
import { validateEmail } from "../utils/validEmail";

const userService = new UserService();

class UserController {
  static async login(req: Request, res: Response) {
    const { password, email } = req.body;
    const isValid = validateEmail(email);

    if (!isValid) {
      res.status(400).json(errorResponse("Credenciais inválidas", 400));
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json(errorResponse("Credenciais inválidas", 400));
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(400).json(errorResponse("Credenciais inválidas", 400));
      return;
    }

    const token = userService.generateAuthToken(user);

    const response: LoginResponse = {
      username: user.username,
      email: user.email,
      token: token,
    };

    res
      .status(200)
      .json(successResponse(response, "Usuário logado com sucesso!"));
  }

  static async register(req: Request, res: Response) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res
        .status(400)
        .json(errorResponse("Nome, e-mail e senha são obrigatórios!", 400));

      return;
    }

    const isValid = validateEmail(email);

    if (!isValid) {
      res.status(400).json(errorResponse("E-mail inválido", 400));
      return;
    }

    try {
      const newUser = await userService.createUser(username, email, password);

      const token = userService.generateAuthToken(newUser);

      const response: LoginResponse = {
        username: newUser.username,
        email: newUser.email,
        token: token,
      };
      
      logger.info(`Usuário ${newUser.username} criado`);
      res
        .status(201)
        .json(successResponse(response, "Usuário criado com sucesso!", 201));
    } catch (error) {
      logger.error("Erro ao criar o usuário:", error);

      if (
        error instanceof Error &&
        error.message === "Este email já está em uso. Tente outro."
      ) {
        res
          .status(400)
          .json(errorResponse("Este email já está em uso. Tente outro.", 400));
        return;
      }

      res
        .status(500)
        .json(
          errorResponse(
            "Erro ao criar o usuário. Tente novamente mais tarde.",
            400
          )
        );
    }
  }
}

export default UserController;
