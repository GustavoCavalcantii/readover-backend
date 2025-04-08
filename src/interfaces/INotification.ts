import { Document, ObjectId } from "mongoose";

export interface INotification extends Document {
  id: string;
  userId: ObjectId;
  message: string;
  expectedReturnDate?: Date;
}
