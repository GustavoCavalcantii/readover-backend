import { ObjectId } from "mongoose";

export interface ISecureUser {
  username: string;
  email: string;
  grade?: string;
 activeloans: ObjectId[];
}