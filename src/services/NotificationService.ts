import { INotification } from "../interfaces/INotification";
import { IUser } from "../interfaces/IUser";
import Notification from "../models/Notification";
import { EmailService } from "./EmailService";
import { IBook } from "../interfaces/IBook";

class NotificationService {
  public async createNotification(
    userId: string,
    message: string,
    expectedReturnDate?: Date
  ): Promise<INotification> {
    const notification = new Notification({
      userId,
      message,
      expectedReturnDate,
    });

    await notification.save();
    return notification;
  }

  public async notifyLateBookReturn(
    user: IUser,
    bookName: string,
    expectedReturnDate?: Date
  ): Promise<INotification> {
    const message = `A data de devolução do livro ${bookName} expirou!`;

    const notification = await this.createNotification(
      user.id,
      message,
      expectedReturnDate
    );

    await EmailService.sendLateLoanEmail(
      user.email,
      user.username,
      bookName,
      expectedReturnDate?.toString() || ""
    );

    return notification;
  }

  public async notifyLoanRequested(
    user: IUser,
    book: IBook,
    expectedReturnDate: Date
  ): Promise<INotification> {
    const message = `Você solicitou o empréstimo do livro "${book.title}". Aguarde aprovação.`;
    return this.createNotification(user.id, message, expectedReturnDate);
  }

  public async notifyLoanApproved(
    user: IUser,
    book: IBook,
    expectedReturnDate: Date
  ): Promise<INotification> {
    const message = `Seu empréstimo do livro "${book.title}" foi aprovado!`;
    return this.createNotification(user.id, message, expectedReturnDate);
  }

  public async notifyLoanRejected(
    user: IUser,
    book: IBook
  ): Promise<INotification> {
    const message = `Seu empréstimo do livro "${book.title}" foi recusado.`;
    return this.createNotification(user.id, message);
  }

  public async notifyBookReturned(
    user: IUser,
    book: IBook,
    actualReturnDate: Date
  ): Promise<INotification> {
    const message = `O livro "${book.title}" foi devolvido com sucesso.`;
    return this.createNotification(user.id, message, actualReturnDate);
  }

  public async getAllNotification(
    userId: string
  ): Promise<INotification[] | null> {
    const notifications = await Notification.find({ userId });
    return notifications;
  }
}

export default new NotificationService();