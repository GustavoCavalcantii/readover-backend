import {IsEmpty } from "class-validator";

export class ConsultProfile {
  @IsEmpty({ message: "Por favor, forneça um valor válido" })
  imageId: string;
}
