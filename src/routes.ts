import express from "express";
import cors from "cors";
import morgan from "morgan";
import MaintenanceMiddleware from "./middlewares/Maintenance";
import "express-async-errors";
import cookieParser from "cookie-parser";

import UserRouter from "./routes/user";
import EmailRouter from "./routes/email";
import { ErrorMiddleware } from "./middlewares/Error";
import JsonRequiredMiddleware from "./middlewares/JsonRequired";

const app = express();

/*
  MIDDLEWARES
*/
app.use(JsonRequiredMiddleware);
app.use(cookieParser()); 
app.use(express.json()); 
app.use(cors())
app.use(morgan("dev")); 

app.use(MaintenanceMiddleware);  

/*
  ROTAS
*/
app.use(UserRouter);
app.use(EmailRouter);


app.use(ErrorMiddleware); //SEMPRE O ÚLTIMO
export default app;
