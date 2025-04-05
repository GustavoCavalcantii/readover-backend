import { IsEmail, IsOptional, IsString, Length } from "class-validator";

export class UserDTO {
  @IsOptional({ groups: ["update"] })
  @IsString({
    groups: ["create"],
    message: "O nome de usuário deve ser uma string",
  })
  @Length(3, 20, {
    message: "O nome de usuário deve ter entre 3 e 20 caracteres.",
    groups: ["create", "update"],
  })
  username: string;

  @IsOptional({ groups: ["update"] })
  @IsString({
    groups: ["create"],
    message: "A série deve ser uma string",
  })
  @Length(3, 27, {
    message: "A série deve ter entre 3 e 27 caracteres.",
    groups: ["create", "update"],
  })
  grade: string;

  @IsOptional({ groups: ["update"] })
  @IsString({
    groups: ["create", "login", "requestReset", "resetEmail"],
    message: "O email deve ser uma string",
  })
  @IsEmail(
    {},
    {
      message: "Por favor, forneça um email válido.",
      groups: ["create", "login", "update", "requestReset", "resetEmail"],
    }
  )
  email: string;
  
  @IsString({
    groups: ["create", "login", "resetPass"],
    message: "A senha deve ser uma string",
  })
  @Length(6, 20, {
    message: "A senha deve ter entre 6 e 20 caracteres.",
    groups: ["create", "resetPass"],
  })
  password: string;

  @IsString({
    groups: ["resetPass", "resetEmail"],
    message: "A senha deve ser uma string",
  })
  resetToken: string;
}
