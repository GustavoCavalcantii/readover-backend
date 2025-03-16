import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { ApiStatus } from "../enum/Api/ApiStatus";
import { ApiEnviroment } from "../enum/Api/ApiEnviroment";
import ApiStatusResponse from "../models/Response/ApiStatusResponse";

import { config } from "dotenv";
config();

const API_NAME: string = process.env.APP_NAME as string;
const API_VERSION: string = process.env.API_VERSION as string;
const MAINTENANCE: boolean = process.env.MAINTENANCE === "true";

const app = express();

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  const response: ApiStatusResponse = {
    success: true,
    appName: API_NAME,
    status: ApiStatus.ONLINE,
    version: API_VERSION,
    environment: ApiEnviroment.DEV,
    maintenance: MAINTENANCE,
  };
  res.status(200).send(response);
});

export default app;
