import { Document, ObjectId } from "mongoose";
import { BookStatus } from "../enums/Book/BookStatus";

export interface ILoan extends Document {
  _id: ObjectId;
  userId: ObjectId;
  bookId: ObjectId;
  status: BookStatus;
  loanDate: Date;
  expectedReturnDate: Date;
  actualReturnDate?: Date;
}
