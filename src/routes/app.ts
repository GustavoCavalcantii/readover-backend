import express from "express";
import cors from "cors";
import morgan from "morgan";
import maintenanceMiddleware from "../middlewares/Maintenance";

import UserRouter from "../routes/User";

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
app.use(UserRouter);

export default app;
