import { IUser } from "../interfaces/IUser";
import User from "../models/User";
import { MongoServerError } from "mongodb";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
import Logger from "../config/Logger";
import { UserDTO } from "../dtos/UserDTO";

dotenv.config();

class UserService {
  async createUser(createUser: UserDTO): Promise<IUser> {
    const user = new User({
      username: createUser.username,
      email: createUser.email,
      password: createUser.password,
      accessLevel: 0,
      grade: createUser.grade,
    });

    try {
      await user.save();
      return user;
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        throw new Error("Este email já está em uso. Tente outro.");
      }

      Logger.error("Erro ao criar usuário:", error);
      throw new Error("Ocorreu um erro ao criar o usuário.");
    }
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    return await User.findOne({ username });
  }

  async getUserById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  generateAuthToken(user: IUser): string {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET não está definido no .env");
    }

    if (!user.id) {
      throw new Error("Usuário sem ID válido");
    }

    return jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );
  }
}


export const userService = new UserService();