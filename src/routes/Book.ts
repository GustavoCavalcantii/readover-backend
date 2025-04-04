import { Router } from "express";
import VerifyToken from "../middlewares/Auth";
import imageBookUpload from "../config/MulterBook";
import { ValidateFileSender } from "../middlewares/ValidateFileSend";

const router = Router();

router.post(
  "/enviar-livro",
  VerifyToken,
  imageBookUpload.single("image"),
  ValidateFileSender
);

export default router;
