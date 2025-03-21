import { ApiResponse } from "./ApiResponse";

export const SuccessResponse = <T>(
  data?: T | null,
  message: string = "Requisição bem-sucedida",
  statusCode: number = 200
): ApiResponse<T> => {

  if (data === undefined) {
    statusCode = 204;
  }

  return {
    success: true,
    message,
    data,
    statusCode,
  };
};
