import { Router } from "express";
import StatusController from "../controllers/StatusController";
import UserController from "../controllers/UserController";
import { ValidateRequest } from "../middlewares/ValidateRequest";
import { UserDTO } from "../dtos/UserDTO";
import VerifyToken from "../middlewares/Auth";
import JsonRequiredMiddleware from "../middlewares/JsonRequired";
import imageProfileUpload from "../config/MulterProfile";
import { ValidateFileSender } from "../middlewares/ValidateFileSend";

const router = Router();

router.get("/", StatusController.getStatus);

router.delete("/deletar", VerifyToken, UserController.deleteUser);

router.put(
  "/editar-conta",
  VerifyToken,
  JsonRequiredMiddleware,
  ValidateRequest(UserDTO, ["update"]),
  UserController.edit
);

router.post(
  "/enviar-perfil",
  VerifyToken,
  imageProfileUpload.single("image"),
  ValidateFileSender,
  UserController.setProfileImage
);

router.get(
  "/imagem-perfil/:imageId",
  VerifyToken,
  UserController.getProfileImage
);

router.get(
  "/meu-perfil",
  VerifyToken,
  UserController.getInfo
);

router.post(
  "/cadastrar",
  JsonRequiredMiddleware,
  ValidateRequest(UserDTO, ["create"]),
  UserController.register
);

export default router;
