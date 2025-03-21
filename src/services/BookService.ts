import { IBook } from "../interfaces/IBook";
import Book from "../models/Book";
import { MongoServerError } from "mongodb";

export class BookService {
  async createBook(
    title: string,
    author: string,
    isbn: string,
    category: string
  ): Promise<IBook> {
    const book = new Book({
      title,
      author,
      isbn,
      category
    });

    try {
      await book.save();
      return book;
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        throw new Error("Este isbn já está cadastrado. Tente outro.");
      }

      throw new Error("Ocorreu um erro desconhecido.");
    }
  }

  async getBookByIsbn(isbn: string): Promise<IBook | null> {
    const book = await Book.findOne({ isbn });
    return book;
  }

  async getBookByTitle(title: string): Promise<IBook | null> {
    const book = await Book.findOne({ title });
    return book;
  }

  async getBookByAuthor(author: string): Promise<IBook | null> {
    const book = await Book.findOne({ author });
    return book;
  }

  async getBookByCategory(category: string): Promise<IBook | null> {
    const book = await Book.findOne({ category });
    return book;
  }

  async getBookById(id: string): Promise<IBook | null> {
    const book = await Book.findById(id);
    return book;
  }
}