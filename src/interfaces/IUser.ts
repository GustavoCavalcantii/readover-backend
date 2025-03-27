import { Document, ObjectId } from "mongoose";

export interface IUser extends Document {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  accessLevel: number;
  grade?: string;
  passwordResetToken?: string;
  emprestimosAtivos: ObjectId[];
}
