import { Request } from "express";

export interface MulterRequest extends Request {
  newFilename?: string;
}
