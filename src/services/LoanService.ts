import { Types } from "mongoose";
import { ILoan } from "../interfaces/ILoan";
import Loan from "../models/Loan";
import { BookStatus } from "../enums/Book/BookStatus";

export class LoanService {
  async createLoan(
    userId: Types.ObjectId,
    bookId: Types.ObjectId,
    status: BookStatus,
    expectedReturnDate: Date,
    actualReturnDate: Date
  ): Promise<ILoan> {
    const loan = new Loan({
      userId,
      bookId,
      status,
      expectedReturnDate,
      actualReturnDate,
    });

    try {
      await loan.save();
      return loan;
    } catch (error) {
      throw new Error("Ocorreu um erro desconhecido.");
    }
  }

  async getLoanByUser(userId: Types.ObjectId): Promise<ILoan | null> {
    const loan = await Loan.findOne({ userId });
    return loan;
  }

  async getLoanByBook(bookId: Types.ObjectId): Promise<ILoan | null> {
    const loan = await Loan.findOne({ bookId });
    return loan;
  }
}
