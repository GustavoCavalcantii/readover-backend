import { IErrorDetail } from "../../interfaces/IErrorDetail";

export interface ApiResponse<T> {
  success: boolean; // Indica se a operação foi bem-sucedida ou não
  message: string; // Mensagem descritiva, que pode ser informativa ou explicativa
  data?: T | null; // Dados da resposta, só será usado em respostas de sucesso
  errors?: IErrorDetail[]; // Detalhes de erro, será usado em respostas de erro
  statusCode: number; // Código de status HTTP
}