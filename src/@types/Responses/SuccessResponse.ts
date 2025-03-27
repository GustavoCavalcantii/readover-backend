import { ApiResponse } from "./ApiResponse";

export const SuccessResponse = <T>(
  data?: T | null,
  message: string = "Requisição bem-sucedida",
  statusCode: number = 200
): ApiResponse<T> => {
  
  let response: any = {
    success: true,
    message,
    statusCode,
  };

  if (data !== null && data !== undefined) {
    response.data = data;
  }

  return response;
};