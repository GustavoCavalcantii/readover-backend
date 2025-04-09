import mongoose, { Schema } from "mongoose";
import { IBook } from "../interfaces/IBook";

const bookSchema = new Schema<IBook>({
    title: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String, required: true, unique: true },
    quantityAvailable: { type: Number, default: 1 },
    description: { type: String },
    category: { type: String, required: true },
    linkPdf: { type: String, unique: true },
    profileImage: { type: String },
    quantityLoaned: { type: Number, default: 0 },
  }, {
    timestamps: true
  });

const Book = mongoose.model<IBook>("Book", bookSchema);

export default Book;