import { Router } from "express";
import StatusController from "../controllers/StatusController";
import UserController from "../controllers/UserController";
import { ValidateRequest } from "../middlewares/ValidateRequest";
import { UserDTO } from "../dtos/UserDTO";
import VerifyToken from "../middlewares/Auth";
import JsonRequiredMiddleware from "../middlewares/JsonRequired";
import imageProfileUpload from "../config/MulterProfile";

const router = Router();

router.get("/", StatusController.getStatus);

router.delete("/usuario/deletar", VerifyToken, UserController.deleteUser);

router.put(
  "/usuario/editar",
  VerifyToken,
  JsonRequiredMiddleware,
  ValidateRequest(UserDTO, ["update"]),
  UserController.edit
);

router.post(
  "/usuario/enviar-perfil",
  VerifyToken,
  imageProfileUpload.single("image"),
  UserController.setProfileImage
);

router.get(
  "/usuario/notificacoes",
  VerifyToken,
  UserController.getNotification
);

router.get(
  "/usuario/perfil/:imageId",
  VerifyToken,
  UserController.getProfileImage
);

router.get("/usuario/minha-conta", VerifyToken, UserController.getInfo);

router.post(
  "/cadastrar",
  JsonRequiredMiddleware,
  ValidateRequest(UserDTO, ["create"]),
  UserController.register
);

export default router;
