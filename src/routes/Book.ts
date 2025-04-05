import { Router } from "express";
import VerifyToken from "../middlewares/Auth";
import imageBookUpload from "../config/MulterBook";
import BookController from "../controllers/BookController";

const router = Router();

router.post(
  "/imagem",
  VerifyToken,
  imageBookUpload.single("image"),
  BookController.store
);

export default router;
