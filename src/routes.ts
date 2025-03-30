import express from "express";
import cors from "cors";
import morgan from "morgan";
import MaintenanceMiddleware from "./middlewares/Maintenance";
import "express-async-errors";
import cookieParser from "cookie-parser";

import UserRouter from "./routes/User";
import { ErrorMiddleware } from "./middlewares/Error";
import JsonRequiredMiddleware from "./middlewares/JsonRequired";

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


app.use(ErrorMiddleware); //SEMPRE O ÚLTIMO
export default app;
