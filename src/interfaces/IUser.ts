import { Document, ObjectId } from "mongoose";
import { Roles } from "../enums/User/UserRole";

export interface IUser extends Document {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  accessLevel: Roles;
  grade?: string;
  passwordResetToken?: string;
  deleted?: boolean;
  activeloans: ObjectId[];
  comparePassword(senha: string): Promise<boolean>;
}
