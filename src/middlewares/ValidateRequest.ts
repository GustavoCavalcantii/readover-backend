import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { ErrorResponse } from "../@types/Responses/ErrorResponse";
import { IErrorDetail } from "../interfaces/IErrorDetail";

export function ValidateRequest<T extends object>(
  dtoClass: new () => T,
  groups?: string[]
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(dtoClass, req.body);

    const errors = await validate(dtoInstance, { groups });

    if (errors.length > 0) {
      const errorDetails: IErrorDetail[] = errors.flatMap((error) =>
        Object.entries(error.constraints || {}).map(
          ([constraintKey, message]) => ({
            field: error.property,
            message: message,
          })
        )
      );

      res
        .status(400)
        .json(ErrorResponse("Credenciais inválidas", 400, errorDetails));
      return;
    }

    const isAnyFieldFilled = Object.values(dtoInstance).some(
      (value) => value != null && value !== ""
    );

    if (!isAnyFieldFilled) {
      res
        .status(400)
        .json(
          ErrorResponse("Requisição inválida. Nenhum campo fornecido.", 400)
        );
      return;
    }

    next();
  };
}
