import { Request, Response } from "express";
import { ApiEnviroment } from "../enum/Api/ApiEnviroment";
import { config } from "dotenv";
import { ApiStatusResponse, successResponse } from "../utils/Responses";
import packageJson from "../../package.json";

const API_NAME: string = packageJson.name;
const API_VERSION: string = "v" + (process.env.API_VERSION || "1");
const ENVIRONMENT: string = process.env.ENVIRONMENT || "dev";
const environment: ApiEnviroment =
  ENVIRONMENT === "prod" ? ApiEnviroment.PROD : ApiEnviroment.DEV;
    
config();

class StatusController {
  static getStatus(req: Request, res: Response) {
    const response: ApiStatusResponse = {
      appName: API_NAME,
      latestVersion: API_VERSION,
      environment: environment,
    };

    res.status(200).json(successResponse(response, "API está online"));
  }
}

export default StatusController;
