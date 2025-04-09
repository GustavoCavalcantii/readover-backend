import { INotification } from "../interfaces/INotification";
import { IUser } from "../interfaces/IUser";
import Notification from "../models/Notification";
import { EmailService } from "./EmailService";

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

    await EmailService.sendLateLoanEmail(user.email, user.username, bookName, expectedReturnDate?.toString() || "");

    return notification;
  }

  public async getAllNotification(
    userId: string
  ): Promise<INotification[] | null> {
    const notifications = await Notification.find({ userId });
    return notifications;
  }
}

export default new NotificationService();
