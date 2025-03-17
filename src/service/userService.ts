import { IUser } from "../interface/IUser";
import User from "../models/User";
import { MongoServerError } from "mongodb";

import jwt from "jsonwebtoken";

export class UserService {
  async createUser(
    username: string,
    email: string,
    password: string,
    accessLevel: number = 0,
    grade?: string
  ): Promise<IUser> {
    const user = new User({
      username,
      email,
      password,
      accessLevel,
      grade
    });

    try {
      await user.save();
      return user;
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        throw new Error("Este email já está em uso. Tente outro.");
      }

      throw new Error("Ocorreu um erro desconhecido.");
    }
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    const user = await User.findOne({ email });
    return user;
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    const user = await User.findOne({ username });
    return user;
  }

  async getUserById(id: string): Promise<IUser | null> {
    const user = await User.findById(id);
    return user;
  }

  generateAuthToken(user: IUser): string {
    const token = jwt.sign(
      { id: user.id, username: user.username },
      "secretKey",
      {
        expiresIn: "12h",
      }
    );

    return token;
  }
}
