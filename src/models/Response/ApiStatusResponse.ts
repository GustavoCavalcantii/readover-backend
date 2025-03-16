import { ApiEnviroment } from "../../enum/Api/ApiEnviroment";
import { ApiStatus } from "../../enum/Api/ApiStatus";

export default interface ApiStatusResponse {
  appName: string; // Nome da aplicação
  success: boolean; // Indica se a operação foi bem-sucedida
  status: ApiStatus; // Status atual da API (usando o enum ApiStatus)
  version: string; // Versão da API
  environment: ApiEnviroment; // Ambiente de execução (ex: 'production', 'development')
  maintenance: boolean; // Caso a API esteja em manutenção
}