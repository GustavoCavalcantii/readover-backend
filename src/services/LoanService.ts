import mongoose, { Types } from "mongoose";
import { ILoan } from "../interfaces/ILoan";
import Loan from "../models/Loan";
import Book from "../models/Book";
import User from "../models/User";
import { BookStatus } from "../enums/Book/BookStatus";
import { LoanDTO } from "../dtos/LoanDTO";
import BookService from "./BookService";

export class LoanService {
  async requestLoan(requestLoan: LoanDTO): Promise<ILoan | null> {
    const { bookId, userId } = requestLoan;

   if (!mongoose.Types.ObjectId.isValid(bookId)) {
     return null;
   }
    
    const book = await Book.findById(bookId);
    if (!book) {
      throw new Error("Livro não encontrado.");
    }

    const existingLoan = await Loan.findOne({
      bookId,
      status: { $in: [BookStatus.ACTIVE, BookStatus.PENDING] },
    });

    if (existingLoan) {
      throw new Error(
        "Este livro já está emprestado ou com solicitação pendente."
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    const loan = new Loan({
      userId,
      bookId,
      status: BookStatus.PENDING,
      loanDate: new Date(),
      expectedReturnDate: new Date(
        `${requestLoan.expectedReturnDate}T00:00:00`
      ), // 30 dias
      actualReturnDate: undefined,
    });

    await loan.save();

    // TODO: enviar e-mail e notificação 0_0

    return loan;
  }

  async approveLoan(loanId: string): Promise<ILoan | null> {
    if (!mongoose.Types.ObjectId.isValid(loanId)) {
      return null;
    }

    const loan = await Loan.findById(loanId)
      .populate("userId")
      .populate("bookId");
    if (!loan) throw new Error("Empréstimo não encontrado.");

    loan.status = BookStatus.ACTIVE;
    loan.loanDate = new Date();
    loan.expectedReturnDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 dias
    loan.actualReturnDate = undefined;

    await loan.save();

    // TODO: enviar e-mail e notificação 0_0
    return loan;
  }

  async rejectLoan(loanId: string): Promise<ILoan | null> {
    if (!mongoose.Types.ObjectId.isValid(loanId)) {
      return null;
    }

    const loan = await Loan.findById(loanId)
      .populate("userId")
      .populate("bookId");
    if (!loan) throw new Error("Empréstimo não encontrado.");

    loan.status = BookStatus.REJECTED;
    await loan.save();

    // TODO: enviar e-mail e notificação 0_0
    return loan;
  }

  async getPendingLoans(): Promise<ILoan[]> {
    return await Loan.find({ status: BookStatus.PENDING })
      .populate("userId")
      .populate("bookId");
  }

  async getLoanByUser(userId: string): Promise<ILoan | null> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return null;
    }

    return await Loan.findOne({ userId });
  }

  async getLoansByUser(userId: string): Promise<ILoan[] | null> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return null;
    }

    return await Loan.find({ userId });
  }

  async getLoanByBook(bookId: string): Promise<ILoan | null> {
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return null;
    }

    return await Loan.findOne({ bookId });
  }

  async getLoansNameByUser(userId: string): Promise<string[]> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return [];
    }

    const allLoans = await this.getLoansByUser(userId);
    if (!allLoans) return [];

    const activeLoans = allLoans.filter(
      (loan) => loan.status !== BookStatus.RETURNED
    );

    const bookTitles = await Promise.all(
      activeLoans.map(async (loan) => {
        const book = await BookService.getBookById(loan.bookId.toString());
        return book ? book.title : null;
      })
    );

    return bookTitles.filter((title): title is string => title !== null);
  }

  async returnBook(loanId: string): Promise<ILoan | null> {
    if (!mongoose.Types.ObjectId.isValid(loanId)) {
      return null;
    }

    const loan = await Loan.findById(loanId)
      .populate("userId")
      .populate("bookId");
    if (!loan) throw new Error("Empréstimo não encontrado.");

    const now = new Date();
    loan.actualReturnDate = now;

    loan.status =
      loan.expectedReturnDate && now > loan.expectedReturnDate
        ? BookStatus.LATE
        : BookStatus.RETURNED;

    await loan.save();

    // TODO: enviar e-mail e notificação 0_0
    return loan;
  }
}

export default new LoanService();
