import { IUser } from "../interfaces/IUser";
import User from "../models/User";
import { MongoServerError, ObjectId } from "mongodb";

import dotenv from "dotenv";
import Logger from "../config/Logger";
import { UserDTO } from "../dtos/UserDTO";
import bcrypt from "bcryptjs";
import { ISecureUser } from "../interfaces/ISecureUser";
import { Roles } from "../enums/User/UserRole";

dotenv.config();

class UserService {
  async createUser(createUser: UserDTO): Promise<IUser> {
    const user = new User({
      username: createUser.username,
      email: createUser.email,
      password: await bcrypt.hash(createUser.password, 10),
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

  async updateAccessLevel(id: string, isAdmin: boolean): Promise<IUser | null> {
    const user = await User.findById(id);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const newAccessLevel = isAdmin ? Roles.ADMIN : Roles.USER;

    if (user.accessLevel === newAccessLevel) {
      return user; 
    }

    user.accessLevel = newAccessLevel;
    await user.save();

    return user;
  }

  async updatePassword(id: string, password: string): Promise<IUser | null> {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { password: password },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("Usuário não encontrado");
    }

    return updatedUser;
  }

  async updateEmail(id: string, email: string): Promise<IUser | null> {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { email: email },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("Usuário não encontrado");
    }

    return updatedUser;
  }

  async updateUser(id: string, userData: UserDTO): Promise<IUser | null> {
    try {
      const objectId = new ObjectId(id);
      const existingUser = await this.getUserById(objectId);

      if (!existingUser) throw new Error("Usuário não encontrado");

      if (userData.email)
        throw new Error("A alteração de e-mail requer verificação.");

      if (userData.password)
        throw new Error("A alteração de senha requer verificação.");

      const allowedFields = ["username", "grade"];

      const filteredUserData = Object.fromEntries(
        Object.entries(userData).filter(
          ([key, value]) => allowedFields.includes(key) && value !== undefined
        )
      ) as Partial<UserDTO>;

      if (Object.keys(filteredUserData).length === 0) {
        throw new Error("Nenhuma alteração válida detectada.");
      }

      const isDataEqual = Object.keys(filteredUserData).every(
        (key) =>
          filteredUserData[key as keyof UserDTO] ===
          existingUser[key as keyof IUser]
      );

      if (isDataEqual)
        throw new Error("Nenhuma alteração detectada. Os dados são iguais.");

      const updatedUser = await User.findByIdAndUpdate(id, filteredUserData, {
        new: true,
      }).exec();

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async getAllUsersExcept(id: string): Promise<ISecureUser[] | null> {
    const users = await User.find({ _id: { $ne: id } });

    if (users.length > 0) {
      const secureUsers: ISecureUser[] = users.map((user) => {
        const { username, email, grade, activeloans } = user.toObject();

        return {
          username,
          email,
          grade,
          activeloans,
        };
      });

      return secureUsers;
    }

    return null;
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    return await User.findOne({ username });
  }

  async deleteUser(id: string): Promise<Boolean> {
    if (!ObjectId.isValid(id)) {
      throw new Error("ID inválido.");
    }

    const user = await User.findOne({ _id: id });

    if (!user) {
      throw new Error("O usuário não existe.");
    }

    const result = await user.updateOne({ deleted: true });

    return result.nModified > 0;
  }

  async getUserById(id: ObjectId): Promise<IUser | null> {
    return await User.findById(id);
  }
}

export const userService = new UserService();
