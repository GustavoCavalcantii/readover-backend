import { IsEmail, IsEmpty, IsString } from "class-validator";

export class UpdateUserDTO {
  @IsString({
    message: "O email deve ser uma string",
  })
  @IsEmail(
    {},
    {
      message: "Por favor, forneça um email válido.",
    }
  )
  email: string;

  @IsEmpty({message: "Por favor, forneça um valor válido"})
  isAdmin: boolean
}
