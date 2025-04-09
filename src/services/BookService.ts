import mongoose, { isValidObjectId } from "mongoose";
import { BookDTO } from "../dtos/BookDTO";
import { IBook } from "../interfaces/IBook";
import Book from "../models/Book";
import { MongoServerError, ObjectId } from "mongodb";

export class BookService {
  async createBook(createBook: BookDTO): Promise<IBook> {
    const book = new Book({
      title: createBook.title,
      author: createBook.author,
      isbn: createBook.isbn,
      category: createBook.category,
      description: createBook.description,
      linkPdf: createBook.linkPdf,
      quantityAvailable: createBook.quantityAvailable,
      image: createBook.image,
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const book = await Book.findById(id);
    return book;
  }

  async getAllBooks(
    filter: string,
    isCategory: boolean = false
  ): Promise<IBook[]> {
    if (!filter) {
      return await Book.find();
    }

    const regex = new RegExp(filter, "i");

    if (!isCategory) {
      return await Book.find({
        $or: [{ author: regex }, { title: regex }],
      });
    }

    return await Book.find({ category: filter });
  }

  async setImageOfBook(id: string, image: string): Promise<IBook | null> {
    if (!ObjectId.isValid(id)) {
      throw new Error("ID inválido.");
    }

    const existingBook = await Book.findById(id);
    if (!existingBook) {
      throw new Error("Livro não encontrado.");
    }
  
    if (existingBook.profileImage === image) {
      throw new Error("A nova imagem é igual à atual.");
    }

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { image },
      { new: true }
    );

    return updatedBook;
  }

  async getImageOfBook(id: string): Promise<string | null> {
    const book = await Book.findById(id);
    if (!book) throw new Error("Livro não encontrado.");
  
    return book.profileImage || null;
  }

  async updateBook(id: string, bookData: BookDTO): Promise<IBook | null> {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const existingBook = await Book.findById(id);
    if (!existingBook) {
      return null;
    }

    const allowedFields = [
      "title",
      "author",
      "isbn",
      "category",
      "description",
      "linkPdf",
      "quantityAvailable",
      "image",
    ];

    const filteredBookData = Object.fromEntries(
      Object.entries(bookData).filter(
        ([key, value]) => allowedFields.includes(key) && value !== undefined
      )
    ) as Partial<BookDTO>;

    if (Object.keys(filteredBookData).length === 0) {
      throw new Error("Nenhuma alteração válida detectada.");
    }

    const isDataEqual = Object.keys(filteredBookData).every(
      (key) =>
        filteredBookData[key as keyof BookDTO] ===
        existingBook[key as keyof IBook]
    );

    if (isDataEqual) {
      throw new Error("Nenhuma alteração detectada. Os dados são iguais.");
    }

    const updatedBook = await Book.findByIdAndUpdate(id, filteredBookData, {
      new: true,
    });

    return updatedBook;
  }

  async deleteBook(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) {
      throw new Error("ID inválido.");
    }

    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      throw new Error("Livro não encontrado.");
    }

    return true;
  }
}

export default new BookService();
