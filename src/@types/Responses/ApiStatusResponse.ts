import { ApiEnviroment } from "../../enums/Api/ApiEnviroment";

export interface ApiStatusResponse {
  appName: string;
  latestVersion: string;
  environment: ApiEnviroment;
}