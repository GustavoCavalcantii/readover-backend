import { Request, Response } from "express";
import { ErrorResponse } from "../@types/Responses/ErrorResponse";
import { SuccessResponse } from "../@types/Responses/SuccessResponse";
import { plainToInstance } from "class-transformer";
import { BookDTO } from "../dtos/BookDTO";
import BookService from "../services/BookService";
import logger from "../config/Logger";
import path from "path";
import ImageService from "../services/ImageService";
import { ImageTypes } from "../enums/Image/ImageTypes";

class BookController {
  static async create(req: Request, res: Response) {
    try {
      const createBookDto = plainToInstance(BookDTO, req.body);

      const alredyExists = await BookService.getBookByIsbn(createBookDto.isbn);

      if (alredyExists) {
        res
          .status(400)
          .json(ErrorResponse("Este livro já foi cadastrado", 400));
        return;
      }

      const book = await BookService.createBook(createBookDto);

      const response = {
        id: book._id,
        title: book.title,
        autor: book.author,
      };

      res
        .status(201)
        .json(SuccessResponse(response, "Livro criado com sucesso!", 201));
    } catch (error) {
      logger.error("Erro ao criar livro", error);
      res.status(500).json(ErrorResponse("Erro ao criar livro", 500));
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const book = await BookService.getBookById(req.params.id);

      if (!book) {
        res.status(404).json(ErrorResponse("Livro não encontrado", 404));

        return;
      }

      const response = {
        id: book._id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        quantityAvailable: book.quantityAvailable,
        quantityLoaned: book.quantityLoaned,
        description: book.description,
        category: book.category,
        linkPdf: book.linkPdf,
        image: book.profileImage,
      };

      res.status(200).json(SuccessResponse(response, "Livro encontrado", 200));
    } catch (error) {
      logger.error("Erro ao buscar livro", error);

      res.status(500).json(ErrorResponse("Erro ao buscar livro", 500));
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      let { filter, category } = req.query;

      if (typeof filter !== "string") filter = undefined;
      if (typeof category !== "string") category = undefined;

      if (filter) filter = decodeURIComponent(filter);
      if (category) category = decodeURIComponent(category);

      const books = await BookService.getAllBooks(filter, category);

      if (!books || books.length === 0) {
        res.status(400).json(ErrorResponse("Nenhum livro encontrado", 400));
        return;
      }

      const response = books.map((book) => ({
        id: book._id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        quantityAvailable: book.quantityAvailable,
        quantityLoaned: book.quantityLoaned,
        description: book.description,
        category: book.category,
        linkPdf: book.linkPdf,
        image: book.profileImage,
      }));

      res.status(200).json(SuccessResponse(response, "Lista de livros", 200));
    } catch (error) {
      logger.error("Erro ao listar livros", error);

      res.status(500).json(ErrorResponse("Erro ao listar livros", 500));
    }
  }

  static async getAllCategory(req: Request, res: Response) {
    try {
      const books = await BookService.getAllBooks("", "");

      if (!books || books.length === 0) {
        res.status(404).json(ErrorResponse("Nenhum livro encontrado", 404));
        return;
      }

      const categories = [
        ...new Set(books.map((book) => book.category).flat()),
      ];

      res
        .status(200)
        .json(SuccessResponse(categories, "Lista de categorias", 200));
    } catch (error) {
      logger.error("Erro ao listar categorias", error);

      res.status(500).json(ErrorResponse("Erro ao listar categorias", 500));
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const idBook = req.params.id;
      const createBookDto = plainToInstance(BookDTO, req.body);

      const updatedBook = await BookService.updateBook(idBook, createBookDto);

      if (!updatedBook) {
        res.status(404).json(ErrorResponse("Livro não encontrado", 404));
        return;
      }

      const response = {
        id: updatedBook._id,
        title: updatedBook.title,
        author: updatedBook.author,
        isbn: updatedBook.isbn,
        quantityAvailable: updatedBook.quantityAvailable,
        quantityLoaned: updatedBook.quantityLoaned,
        description: updatedBook.description,
        category: updatedBook.category,
        linkPdf: updatedBook.linkPdf,
        image: updatedBook.profileImage,
      };

      res
        .status(200)
        .json(SuccessResponse(response, "Livro atualizado com sucesso", 200));
    } catch (error) {
      logger.error("Erro ao atualizar livro", error);
      res.status(500).json(ErrorResponse("Erro ao atualizar livro", 500));
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deleted = await BookService.deleteBook(id);

      if (!deleted) {
        res.status(404).json(ErrorResponse("Livro não encontrado", 404));
        return;
      }

      res
        .status(200)
        .json(SuccessResponse(null, "Livro excluído com sucesso", 200));
    } catch (error) {
      logger.error("Erro ao deletar livro", error);

      res.status(500).json(ErrorResponse("Erro ao deletar livro", 500));
    }
  }

  static async store(req: Request, res: Response) {
    if (!req.file) {
      res.status(400).json(ErrorResponse("Nenhum arquivo enviado.", 400));
      return;
    }

    const { id } = req.params;

    const imageName = req.newFilename;

    if (!imageName) {
      res.status(500).json(ErrorResponse("Não foi possível salvar o arquivo", 500));
      return;
    }

    try {
      await BookService.setImageOfBook(id, imageName);

      res
        .status(200)
        .json(SuccessResponse(null, "Arquivo enviado com sucesso!", 200));
    } catch (error: any) {
      logger.error("Erro ao salvar imagem:", error);
      res
        .status(400)
        .json(ErrorResponse(error.message || "Erro ao salvar imagem", 400));
    }
  }

  static async getBookImage(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const route = await ImageService.getImage(
        id,
        ImageTypes.BOOK
      );

      if (!route) {
        res.status(404).json(ErrorResponse("Imagem não encontrada", 404));
        return;
      }

      res.status(200).sendFile(route);
    } catch (error) {
      logger.error("Erro ao obter imagem do livro:", error);

      res.status(500).json(ErrorResponse("Erro Interno no Servidor.", 500));
    }
  }
}

export default BookController;
