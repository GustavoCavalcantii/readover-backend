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
import { ErrorMiddleware } from "./middlewares/Error";
import { ValidateRoles } from "./middlewares/Roles";
import { Roles } from "./enums/User/UserRole";
import VerifyToken from "./middlewares/Auth";
import { limiter } from "./middlewares/Spam";

const app = express();

/*
  MIDDLEWARES
*/
app.use(limiter);
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use(MaintenanceMiddleware);

/*
  ROTAS
*/
app.use(UserRouter);
app.use(AuthRouter);
app.use(BookRouter);
app.use("/admin", VerifyToken, ValidateRoles(Roles.ADMIN), AdminRouter);

app.use(ErrorMiddleware); //SEMPRE O ÚLTIMO
export default app;
