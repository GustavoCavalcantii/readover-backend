import { IBook } from "../interfaces/IBook";
import Book from "../models/Book";
import { MongoServerError } from "mongodb";

export class BookService {
  async createBook(
    title: string,
    author: string,
    isbn: string,
    category: string,
    description?: string,
    linkPdf?: string,
    quantityAvailable: number = 1
  ): Promise<IBook> {
    const book = new Book({
      title,
      author,
      isbn,
      category,
      description,
      linkPdf,
      quantityAvailable,
    });
  
    try {
      await book.save();
      return book;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error("Este ISBN ou já está cadastrado.");
      }
      throw new Error("Erro ao criar o livro.");
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

  async getAllBooks(): Promise<IBook[]> {
    return await Book.find();
  }
  
  async updateBook(id: string, data: Partial<IBook>): Promise<IBook | null> {
    return await Book.findByIdAndUpdate(id, data, { new: true });
  }
  
  async deleteBook(id: string): Promise<boolean> {
    const result = await Book.findByIdAndDelete(id);
    return !!result;
  }
}

export default new BookService();