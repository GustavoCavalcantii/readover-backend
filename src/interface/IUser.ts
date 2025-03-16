import { Document } from "mongoose";

export interface IUser extends Document {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
