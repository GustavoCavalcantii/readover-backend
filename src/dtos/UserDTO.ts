import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class UserDTO {
  @IsString({
    groups: ["create"],
    message: "O nome de usuário deve ser uma string",
  })
  @IsNotEmpty({
    message: "O nome de usuário não pode estar vazio.",
    groups: ["create"],
  })
  @Length(3, 20, {
    message: "O nome de usuário deve ter entre 3 e 20 caracteres.",
    groups: ["create"],
  })
  username: string;

  @IsString({
    groups: ["create"],
    message: "A série deve ser uma string"
  })
  @Length(3, 27, {
    message: "A série deve ter entre 3 e 27 caracteres.",
    groups: ["create"],
  })
  grade: string;

  @IsString({
    groups: ["create", "update"],
    message: "O email deve ser uma string"
  })
  @IsEmail(
    {},
    {
      message: "Por favor, forneça um email válido.",
      groups: ["create", "update"],
    }
  )
  email: string;

  @IsString({
    groups: ["create", "update"],
    message: "A senha deve ser uma string"
  })
  @IsNotEmpty({
    message: "A senha não pode estar vazia.",
    groups: ["create", "update"],
  })
  @Length(6, 20, {
    message: "A senha deve ter entre 6 e 20 caracteres.",
    groups: ["create"],
  })
  password: string;
}
