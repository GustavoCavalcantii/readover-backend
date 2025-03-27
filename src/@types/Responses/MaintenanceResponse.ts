import { ApiResponse } from "./ApiResponse";

export const MaintenanceResponse = (): ApiResponse<null> => {
  return {
    success: false,
    message:
      "O sistema está em manutenção. Por favor, tente novamente mais tarde.",
    statusCode: 503,
  };
};
