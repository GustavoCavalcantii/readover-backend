import { Document } from "mongoose";

export interface IBook extends Document {
    id: number;
    title: string;
    author: string;
    isbn: string;
    quantityAvailable: number;
    description: string;
    category: string;
    linkPdf: string;
    image: string;
  }
  