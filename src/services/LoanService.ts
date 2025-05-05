import { ILoan } from "../interfaces/ILoan";
import Loan from "../models/Loan";
import Book from "../models/Book";
import User from "../models/User";
import { BookStatus } from "../enums/Book/BookStatus";
import { LoanDTO } from "../dtos/LoanDTO";
import NotificationService from "./NotificationService";
import BookService from "./BookService";

export class LoanService {
  async requestLoan(requestLoan: LoanDTO, userId: string): Promise<ILoan> {
    const { bookId } = requestLoan;

    const book = await Book.findById(bookId);
    if (!book) {
      throw new Error("Livro não encontrado.");
    }

    const activeLoans = await Loan.countDocuments({
      bookId,
      status: { $in: [BookStatus.ACTIVE, BookStatus.PENDING] },
    });

    if (activeLoans >= book.quantityAvailable) {
      throw new Error(
        "Todas as cópias deste livro estão emprestadas ou com solicitação pendente."
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
      ),
      actualReturnDate: undefined,
    });

    await loan.save();

    const populatedLoan = await Loan.findById(loan._id)
      .populate("userId", "username email profileImage")
      .populate("bookId", "title author isbn quantityAvailable category");

    // Notificar solicitação de empréstimo
    await NotificationService.notifyLoanRequested(
      user,
      book,
      loan.expectedReturnDate
    );

    return populatedLoan as ILoan;
  }

  async getLoanById(loanId: string): Promise<ILoan | null> {
    return await Loan.findById(loanId)
      .populate("userId", "username email profileImage")
      .populate("bookId", "title author isbn quantityAvailable category");
  }
  

  async approveLoan(loanId: string): Promise<ILoan> {
    const loan = await Loan.findById(loanId)
      .populate("userId", "username email profileImage")
      .populate("bookId", "title author isbn quantityAvailable category");
  
    if (!loan) throw new Error("Empréstimo não encontrado.");
  
    loan.status = BookStatus.ACTIVE;
    loan.loanDate = new Date();
    loan.expectedReturnDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    loan.actualReturnDate = undefined;
  
    const book = loan.bookId as any;
    book.quantityLoaned = (book.quantityLoaned || 0) + 1;
    await book.save();
    await loan.save();
  
    const user = loan.userId as any;
  
    // Notificar aprovação
    await NotificationService.notifyLoanApproved(
      user,
      book,
      loan.expectedReturnDate
    );
  
    return loan;
  }
  
  async rejectLoan(loanId: string): Promise<ILoan> {
    const loan = await Loan.findById(loanId)
      .populate("userId", "username email profileImage")
      .populate("bookId", "title author isbn quantityAvailable category");

    if (!loan) throw new Error("Empréstimo não encontrado.");

    loan.status = BookStatus.REJECTED;

    await loan.save();

    const user = loan.userId as any;
    const book = loan.bookId as any;

    // Notificar rejeição
    await NotificationService.notifyLoanRejected(user, book);

    return loan;
  }

  async getLoansNameByUser(userId: string): Promise<string[]> {
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

  async getPendingLoans(): Promise<ILoan[]> {
    return await Loan.find({ status: BookStatus.PENDING })
      .populate("userId", "username email profileImage")
      .populate("bookId", "title author quantityAvailable isbn");
  }

  async getLoansByUser(userId: string): Promise<ILoan[] | null> {
    return await Loan.find({ userId, status: BookStatus.PENDING })
      .populate("userId", "username email profileImage")
      .populate("bookId", "title author isbn quantityAvailable category");
  }

  async getLoanByUser(userId: string): Promise<ILoan | null> {
    return await Loan.findOne({ userId })
      .populate("userId", "username email profileImage")
      .populate("bookId", "title author isbn quantityAvailable category");
  }

  async getLoanByBook(bookId: string): Promise<ILoan | null> {
    return await Loan.findOne({ bookId })
      .populate("userId", "username email profileImage")
      .populate("bookId", "title author isbn quantityAvailable category");
  }

  async getAllLoans(): Promise<ILoan[]> {
    return await Loan.find()
      .populate("userId", "username email profileImage")
      .populate("bookId", "title author isbn quantityAvailable category");
  }


  async returnBook(loanId: string): Promise<ILoan> {
    const loan = await Loan.findById(loanId)
      .populate("userId", "username email profileImage")
      .populate("bookId", "title author isbn quantityAvailable category");

    if (!loan) throw new Error("Empréstimo não encontrado.");

    const now = new Date();
    loan.actualReturnDate = now;

    loan.status =
      loan.expectedReturnDate && now > loan.expectedReturnDate
        ? BookStatus.LATE
        : BookStatus.RETURNED;

    await loan.save();

    // Atualizar quantidade disponível
    if (loan.bookId instanceof Book) {
      loan.bookId.quantityLoaned = Math.max(loan.bookId.quantityLoaned - 1, 0);
      await loan.bookId.save();
    } else {
      const book = await Book.findById(loan.bookId);
      if (book) {
        book.quantityLoaned = Math.max(book.quantityLoaned - 1, 0);
        await book.save();
      }
    }

    const user = loan.userId as any;
    const book = loan.bookId as any;

    // Notificar devolução
    await NotificationService.notifyBookReturned(user, book, now);

    return loan;
  }
}

export default new LoanService();