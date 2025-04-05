import { Types } from "mongoose";
import { ILoan } from "../interfaces/ILoan";
import Loan from "../models/Loan";
import { BookStatus } from "../enums/Book/BookStatus";
import BookService from "./BookService";
class LoanService {
  public async createLoan(
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

  public async getLoanByUser(userId: string): Promise<ILoan | null> {
    const loan = await Loan.findOne({ userId });
    return loan;
  }

  public async getLoansByUser(userId: string): Promise<ILoan[] | null> {
    const loans = await Loan.find({ userId });
    return loans;
  }

  public async getLoansNameByUser(userId: string): Promise<string[] | null> {
    const activeLoans = await this.getLoansByUser(userId);
    let loansName = [];

    if (activeLoans && activeLoans.length > 0) {
      for (const element of activeLoans) {
        const book = await BookService.getBookById(element.bookId.toString());
        if (book) loansName.push(book.title);
      }
    }

    return loansName;
  }

  public async setExpired(): Promise<ILoan[]> {
    const now = new Date();

    const expiredLoans = await Loan.find({
      expectedReturnDate: { $lt: now },
    });

    expiredLoans.forEach((element) => {
      element.status = BookStatus.LATE;
      element.save();
    });

    return expiredLoans;
  }

  public async getLoanByBook(bookId: string): Promise<ILoan | null> {
    const loan = await Loan.findOne({ bookId });
    return loan;
  }
}

export default new LoanService();
