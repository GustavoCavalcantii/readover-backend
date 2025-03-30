import { Router } from "express";
import StatusController from "../controllers/StatusController";
import UserController from "../controllers/UserController";
import { ValidateRequest } from "../middlewares/ValidateRequest";
import { UserDTO } from "../dtos/UserDTO";
import VerifyToken from "../middlewares/Auth";
import JsonRequiredMiddleware from "../middlewares/JsonRequired";

const router = Router();

router.get("/", StatusController.getStatus);

router.post("/refresh", UserController.refresh);

router.delete("/deletar", VerifyToken, UserController.deleteUser);

router.post("/sair", UserController.logout);

router.put(
  "/editar-conta",
  VerifyToken,
  JsonRequiredMiddleware,
  ValidateRequest(UserDTO, ["update"]),
  UserController.edit
);

router.post(
  "/entrar",
  JsonRequiredMiddleware,
  ValidateRequest(UserDTO, ["login"]),
  UserController.login
);

router.post(
  "/cadastrar",
  JsonRequiredMiddleware,
  ValidateRequest(UserDTO, ["create"]),
  UserController.register
);

export default router;
