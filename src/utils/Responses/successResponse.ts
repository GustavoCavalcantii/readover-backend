import { ApiResponse } from "./response";

export const successResponse = <T>(
  data?: T | null,
  message: string = "Requisição bem-sucedida"
): ApiResponse<T> => {
  let statusCode: number = 200;

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
