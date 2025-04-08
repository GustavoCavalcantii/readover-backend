import { Router } from "express";
import VerifyToken from "../middlewares/Auth";
import imageBookUpload from "../config/MulterBook";
import BookController from "../controllers/BookController";
import { ValidateRoles } from "../middlewares/Roles";
import { Roles } from "../enums/User/UserRole";

const router = Router();

router.get("/", BookController.getAll);
router.post("/", BookController.create);
router.put("/:id", BookController.update);
router.delete("/:id", BookController.delete);
router.post(
  "/imagem",
  VerifyToken,
  ValidateRoles(Roles.ADMIN),
  imageBookUpload.single("image"),
  BookController.store
);

export default router;
