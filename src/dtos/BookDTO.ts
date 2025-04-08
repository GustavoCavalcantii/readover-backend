import { IsEmail, IsNumber, IsOptional, IsString, Length } from "class-validator";

export class BookDTO {
    @IsOptional({ groups: ["update"] })
    @IsString({ 
        groups: ["create", "update"], 
        message: "O título deve ser uma string" })
    @Length(1, 60, {
        message: "O título deve ter entre 1 e 100 caracteres.",
        groups: ["create", "update"],
    })
    title: string;

    @IsOptional({ groups: ["update"] })
    @IsString({ 
        groups: ["create", "update"], 
        message: "O autor deve ser uma string" })
    @Length(1, 60, {
        message: "O autor deve ter entre 1 e 60 caracteres.",
        groups: ["create", "update"],
    })
    author: string;

    @IsOptional({ groups: ["update"] })
    @IsString({ 
        groups: ["create", "update"], 
        message: "O ISBN deve ser uma string" })
    @Length(10, 15, {
        message: "O ISBN deve ter entre 10 e 15 caracteres.",
        groups: ["create", "update"],
    })
    isbn: string;

    @IsOptional({ groups: ["update"] })
    @IsNumber({}, {
        message: "A quantidade deve ser um número.",
        groups: ["create", "update"],
      })
    quantityAvailable: number;

    @IsOptional({ groups: ["update"] })
    @IsString({ 
        groups: ["create", "update"], 
        message: "A descrição deve ser uma string" })
    @Length(1, 500, {
        message: "A descrição deve ter entre 1 e 500 caracteres.",
        groups: ["create", "update"],
    })
    description: string;

    @IsOptional({ groups: ["update"] })
    @IsString({ 
        groups: ["create", "update"], 
        message: "A categoria deve ser uma string" })
    @Length(1, 30, {
        message: "A categoria deve ter entre 1 e 30 caracteres.",
        groups: ["create", "update"],
    })
    category: string;

    @IsOptional({ groups: ["update"] })
    @IsString({ 
        groups: ["create", "update"], 
        message: "O link deve ser uma string" })
    @Length(10, 150, {
        message: "O link deve ter entre 10 e 150 caracteres.",
        groups: ["create", "update"],
    })
    linkPdf: string;
}