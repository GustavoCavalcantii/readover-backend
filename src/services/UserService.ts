import { IUser } from "../interfaces/IUser";
import User from "../models/User";
import { MongoServerError, ObjectId } from "mongodb";

import dotenv from "dotenv";
import Logger from "../config/Logger";
import { UserDTO } from "../dtos/UserDTO";
import bcrypt from "bcryptjs";

dotenv.config();

class UserService {
  async createUser(createUser: UserDTO): Promise<IUser> {
    const user = new User({
      username: createUser.username,
      email: createUser.email,
      password: await bcrypt.hash(createUser.password, 10),
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

  async updateUser(id: string, userData: UserDTO): Promise<IUser | null> {
    try {
      const existingUser = await User.findById(id).exec();

      if (!existingUser) throw new Error("Usuário não encontrado");

      if (userData.email) {
        if (userData.email !== existingUser.email) {
          const emailExists = await User.findOne({
            email: userData.email,
          }).exec();

          if (emailExists)
            throw new Error("Este e-mail já está em uso. Tente outro.");
        }

        //TODO: ENVIAR EMAIL PARA TROCAR O EMAIL
      }

      if (userData.password) {
        //TODO: ENVIAR EMAIL PARA TROCAR A SENHA
      }

      const filteredUserData = Object.fromEntries(
        Object.entries(userData).filter(([_, value]) => value !== undefined)
      ) as Partial<UserDTO>;

      const isDataEqual = (
        Object.keys(filteredUserData) as (keyof UserDTO)[]
      ).every((key) => filteredUserData[key] === existingUser[key]);

      if (isDataEqual)
        throw new Error("Nenhuma alteração detectada. Os dados são iguais.");

      const updatedUser = await User.findByIdAndUpdate(id, filteredUserData, {
        new: true,
      }).exec();

      return updatedUser;
    } catch (error) {
      Logger.error("Erro ao atualizar o usuário", error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    return await User.findOne({ username });
  }

  async getUserById(id: ObjectId): Promise<IUser | null> {
    return await User.findById(id);
  }
}

export const userService = new UserService();
