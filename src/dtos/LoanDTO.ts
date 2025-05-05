import { IsEnum, IsDate, IsOptional, IsDateString, IsIn, IsInt } from "class-validator";
import { BookStatus } from "../enums/Book/BookStatus";

export class LoanDTO {
  id: string;
  bookId: string;

  @IsOptional({ groups: ["create"] })
  @IsEnum(BookStatus, {
    message: "Status inválido. Valores aceitos: ativo, devolvido, atrasado, pendente, rejeitado.",
    groups: ["update"],
  })
  status?: BookStatus;

  @IsOptional({ groups: ["create", "update"] })
  @IsDate({
    message: "A data do empréstimo deve ser uma data válida.",
    groups: ["update"],
  })
  loanDate?: Date;

  @IsOptional({ groups: ["update"] })
  @IsDateString({}, {
    message: "A data de devolução esperada deve estar no formato YYYY-MM-DD.",
    groups: ["update"],
  })
  expectedReturnDate?: string;

  @IsOptional({ groups: ["update"] })
  @IsDateString({}, {
    message: "A data de devolução deve estar no formato YYYY-MM-DD.",
    groups: ["create", "update"],
  })
  actualReturnDate?: Date;

  @IsIn([7, 15, 30], {
    message: "Número de dias de empréstimo deve ser 7, 15 ou 30.",
    groups: ["create"]
  })
  returnInDays: number;
}