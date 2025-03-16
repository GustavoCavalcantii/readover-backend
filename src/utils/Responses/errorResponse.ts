import { ApiResponse } from "./response";

export const errorResponse = (
  message: string,
  statusCode: number = 400,
  error?: string
): ApiResponse<null> => {
  return {
    success: false,
    message,
    error,
    statusCode,
  };
};