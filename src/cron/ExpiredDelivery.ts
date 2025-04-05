import cron from "node-cron";
import NotificationService from "../services/NotificationService";
import LoanService from "../services/LoanService";
import { userService } from "../services/UserService";
import Logger from "../config/Logger";
import BookService from "../services/BookService";

cron.schedule("*/5 * * * *", async () => {
  console.log("[CRON] Checking for expired deliveries...");

  const expiredDeliveries = await LoanService.setExpired();

  for (const delivery of expiredDeliveries) {
    const userId = delivery.userId;
    const bookId = delivery.bookId;

    const user = await userService.getUserById(userId.toString());
    const book = await BookService.getBookById(bookId.toString());

    if (!user || !book) {
      Logger.error(
        "Erro ao consultar usuário ou livro para enviar a notificação"
      );
      return;
    }

    await NotificationService.notifyLateBookReturn(
      user,
      book.title,
      delivery.expectedReturnDate
    );

    Logger.info(`Empréstimo ${delivery.id} marcado como expirado`);
  }
});
