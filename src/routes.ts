import express from "express";
import cors from "cors";
import morgan from "morgan";
import MaintenanceMiddleware from "./middlewares/Maintenance";
import "express-async-errors";
import cookieParser from "cookie-parser";

import UserRouter from "./routes/User";
import AuthRouter from "./routes/Auth";
import AdminRouter from "./routes/Admin";
import BookRouter from "./routes/Book";
import LoanRouter from "./routes/Loan";
import EmailRouter from "./routes/Email";
import { ErrorMiddleware } from "./middlewares/Error";
import { ValidateRoles } from "./middlewares/Roles";
import { Roles } from "./enums/User/UserRole";
import VerifyToken from "./middlewares/Auth";
import { limiter } from "./middlewares/Spam";
import { NotFoundMiddleware } from "./middlewares/NotFound";

const app = express();

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

/*
  MIDDLEWARES
*/
app.use(limiter);
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(morgan("dev"));

app.use(MaintenanceMiddleware);

/*
  ROTAS
*/
app.use(UserRouter);
app.use("/livro", VerifyToken, BookRouter);
app.use(AuthRouter);
app.use(EmailRouter);
app.use("/emprestimo", VerifyToken, LoanRouter);
app.use("/admin", VerifyToken, ValidateRoles(Roles.ADMIN), AdminRouter);

app.use(ErrorMiddleware);
app.use(NotFoundMiddleware); //SEMPRE O ÚLTIMO
export default app;
