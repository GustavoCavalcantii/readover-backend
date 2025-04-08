import { Request, Response } from "express";
import { ErrorResponse } from "../@types/Responses/ErrorResponse";
import { SuccessResponse } from "../@types/Responses/SuccessResponse";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { BookDTO } from "../dtos/BookDTO";
import BookService from "../services/BookService";
import logger from "../config/Logger";
import { link } from "fs";
import { IBook } from "../interfaces/IBook";

class BookController {

  static async create(req: Request, res: Response) {
    try {

      const createBookDto = plainToInstance(BookDTO, req.body);

      const book = await BookService.createBook(createBookDto);
      
      const response = {
        id: book._id,
        title: book.title,
        autor: book.author,
      }

      res
        .status(201)
        .json(SuccessResponse(response, "Livro criado com sucesso!", 201));
    } 
    catch (error) {
      logger.error("Erro ao criar livro", error);
      res
        .status(400)
        .json(ErrorResponse("Erro ao criar livro", 400));
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const book = await BookService.getBookById(req.params.id);

      if (!book) {
        res
          .status(404)
          .json(ErrorResponse("Livro não encontrado", 404));

        return;
      }

      const response = {
        id: book._id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        quantityAvailable: book.quantityAvailable,
        description: book.description,
        category: book.category,
        linkPdf: book.linkPdf
      }

      res
        .status(200)
        .json(SuccessResponse(response, "Livro encontrado", 200));
    } 
    catch (error) {
      logger.error("Erro ao buscar livro", error);

      res
        .status(500)
        .json(ErrorResponse("Erro ao buscar livro", 500));
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const books = await BookService.getAllBooks();

      if(!books || books.length === 0) {
        res
          .status(404)
          .json(ErrorResponse("Nenhum livro encontrado", 404));
        return;
      }

      const response = books.map((book) => ({
        id: book._id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        quantityAvailable: book.quantityAvailable,
        description: book.description,
        category: book.category,
        linkPdf: book.linkPdf,
      }));

      res
        .status(200)
        .json(SuccessResponse(response, "Lista de livros", 200));
    } 
    catch (error) {
      logger.error("Erro ao listar livros", error);

      res
        .status(500)
        .json(ErrorResponse("Erro ao listar livros", 500));
    }
  }
  static async update(req: Request, res: Response) {
    try {
      const idBook = req.params.id;
      const createBookDto = plainToInstance(BookDTO, req.body);
  
      const updatedBook = await BookService.updateBook(idBook, createBookDto);
  
      if (!updatedBook) {
        res
          .status(404)
          .json(ErrorResponse("Livro não encontrado", 404));
        return;
      }
  
      const response = {
        id: updatedBook._id,
        title: updatedBook.title,
        author: updatedBook.author,
        isbn: updatedBook.isbn,
        quantityAvailable: updatedBook.quantityAvailable,
        description: updatedBook.description,
        category: updatedBook.category,
        linkPdf: updatedBook.linkPdf
      };
  
      res
        .status(200)
        .json(SuccessResponse(response, "Livro atualizado com sucesso", 200));
    } catch (error) {
      logger.error("Erro ao atualizar livro", error);
      res
        .status(500)
        .json(ErrorResponse("Erro ao atualizar livro", 500));
    }
  }
  

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deleted = await BookService.deleteBook(id);

      if (!deleted) { 
        res
        .status(404)
        .json(ErrorResponse("Livro não encontrado", 404));
        return;
      }

      res
        .status(200)
        .json(SuccessResponse(null, "Livro excluído com sucesso", 200));
    } 
    catch (error) {
      logger.error("Erro ao deletar livro", error);

      res
        .status(500)
        .json(ErrorResponse("Erro ao deletar livro", 500));
    }
  }

  static async store(req: Request, res: Response) {
    if (!req.file) {
      res.status(400).json(ErrorResponse("Nenhum arquivo enviado.", 400));
      return;
    }

    //TODO: Salvar no banco de dados

    res
      .status(200)
      .json(SuccessResponse(null, "Arquivo enviado com sucesso!", 200));
  }
}

export default BookController;
