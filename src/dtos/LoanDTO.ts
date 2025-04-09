import { IsEnum, IsDate, IsOptional, IsDateString } from "class-validator";
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
    groups: ["create", "update"],
  })
  expectedReturnDate: string;

  @IsOptional({ groups: ["update"] })
  @IsDateString({}, {
    message: "A data de devolução esperada deve estar no formato YYYY-MM-DD.",
    groups: ["create", "update"],
  })
  actualReturnDate?: Date;
}