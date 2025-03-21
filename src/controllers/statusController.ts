import { Request, Response } from "express";
import { ApiEnviroment } from "../enums/Api/ApiEnviroment";
import { config } from "dotenv";
import packageJson from "../../package.json";
import { ApiStatusResponse } from "../types/Responses/ApiStatusResponse";
import { SuccessResponse } from "../types/Responses/SuccessResponse";

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

    res.status(200).json(SuccessResponse(response, "API está online"));
  }
}

export default StatusController;
