import { Router } from "express";
import VerifyToken from "../middlewares/Auth";
import JsonRequiredMiddleware from "../middlewares/JsonRequired";
import { ValidateRequest } from "../middlewares/ValidateRequest";
import imageBookUpload from "../config/MulterBook";
import BookController from "../controllers/BookController";
import { BookDTO } from "../dtos/BookDTO";
import { ValidateRoles } from "../middlewares/Roles";
import { Roles } from "../enums/User/UserRole";


const router = Router();

router.get("/",
  BookController.getAll);

router.post("/",
  JsonRequiredMiddleware,
  ValidateRequest(BookDTO), 
  BookController.create);

router.put("/:id",
  JsonRequiredMiddleware,
  ValidateRequest(BookDTO),
  BookController.update);

router.delete("/:id",
  BookController.delete);

router.get("/:id",
  BookController.getById);

router.post(
  "/imagem",
  VerifyToken,
  ValidateRoles(Roles.ADMIN),
  imageBookUpload.single("image"),
  BookController.store
);

export default router;
