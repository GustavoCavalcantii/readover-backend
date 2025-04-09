import { Router } from "express";
import JsonRequiredMiddleware from "../middlewares/JsonRequired";
import { ValidateRequest } from "../middlewares/ValidateRequest";
import imageBookUpload from "../config/MulterBook";
import BookController from "../controllers/BookController";
import { BookDTO } from "../dtos/BookDTO";


const router = Router();

router.get("/filtrar", (req, res) => BookController.getAll(req, res));

router.get("/filtrar/:filter", (req, res) => BookController.getAll(req, res));

router.get("/categoria/:filter", (req, res) =>
  BookController.getAll(req, res, true)
);

router.post(
  "/",
  JsonRequiredMiddleware,
  ValidateRequest(BookDTO),
  BookController.create
);

router.put(
  "/:id",
  JsonRequiredMiddleware,
  ValidateRequest(BookDTO),
  BookController.update
);

router.delete("/:id", BookController.delete);

router.get("/:id", BookController.getById);

router.post(
  "/imagem/:id",
  imageBookUpload.single("image"),
  BookController.store
);

router.get("/imagem/:id", BookController.getBookImage);

export default router;
