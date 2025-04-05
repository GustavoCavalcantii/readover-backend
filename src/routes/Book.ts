import { Router } from "express";
import VerifyToken from "../middlewares/Auth";
import imageBookUpload from "../config/MulterBook";
import BookController from "../controllers/BookController";

const router = Router();

router.get("/", BookController.getAll);
router.post("/", BookController.create);
router.put("/:id", BookController.update);
router.delete("/:id", BookController.delete);
router.post(
  "/imagem",
  VerifyToken,
  imageBookUpload.single("image"),
  BookController.store
);

export default router;
