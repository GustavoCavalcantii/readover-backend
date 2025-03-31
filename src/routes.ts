import express from "express";
import cors from "cors";
import morgan from "morgan";
import MaintenanceMiddleware from "./middlewares/Maintenance";
import "express-async-errors";
import cookieParser from "cookie-parser";

import UserRouter from "./routes/User";
import AuthRouter from "./routes/Auth";
import AdminRouter from "./routes/Admin";
import { ErrorMiddleware } from "./middlewares/Error";

const app = express();

/*
  MIDDLEWARES
*/
app.use(cookieParser()); 
app.use(express.json()); 
app.use(cors())
app.use(morgan("dev")); 

app.use(MaintenanceMiddleware);  

/*
  ROTAS
*/
app.use(UserRouter);
app.use(AuthRouter);
app.use("/admin", AdminRouter);


app.use(ErrorMiddleware); //SEMPRE O ÚLTIMO
export default app;
