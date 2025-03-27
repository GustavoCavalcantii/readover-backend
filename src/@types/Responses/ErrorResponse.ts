import { IErrorDetail } from "../../interfaces/IErrorDetail";
import { ApiResponse } from "./ApiResponse";

export const ErrorResponse = (
  message: string,
  statusCode: number = 400,
  errors?: IErrorDetail[]
): ApiResponse<null> => {
  return {
    success: false,
    message,
    errors,
    statusCode,
  };
};