import { ApiEnviroment } from "../../enum/Api/ApiEnviroment";

export interface ApiStatusResponse {
  appName: string;
  latestVersion: string;
  environment: ApiEnviroment;
}