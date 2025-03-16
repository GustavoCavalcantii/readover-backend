import express from "express";
import cors from "cors";
import morgan from "morgan";
import maintenanceMiddleware from "../middleware/maintenance";
import userRouter from "./user";

const app = express();

/*
  MIDDLEWARES
*/
app.use(maintenanceMiddleware);
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

/*
  ROTAS
*/
app.use(userRouter);


export default app;
