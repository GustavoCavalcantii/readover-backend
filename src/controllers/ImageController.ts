import { Request, Response } from "express";
import { ErrorResponse } from "../@types/Responses/ErrorResponse";
import { SuccessResponse } from "../@types/Responses/SuccessResponse";

class ImageController {
  static async store(req: Request, res: Response) {
    if (!req.file) {
      res.status(400).json(ErrorResponse("Nenhum arquivo enviado.", 400));
      return;
    }

    res
      .status(200)
      .json(SuccessResponse(null, "Arquivo enviado com sucesso!", 200));
  }
}

export default ImageController;
