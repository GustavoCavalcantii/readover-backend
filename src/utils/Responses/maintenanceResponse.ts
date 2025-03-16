import { ApiResponse } from "./response";

export const maintenanceResponse = (): ApiResponse<null> => {
  return {
    success: false,
    message:
      "O sistema está em manutenção. Por favor, tente novamente mais tarde.",
    statusCode: 503,
  };
};
