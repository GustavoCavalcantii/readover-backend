import { Router } from "express";
import StatusController from "../controllers/StatusController";
import UserController from "../controllers/UserController";
import { ValidateRequest } from "../middlewares/ValidateRequest";
import { UserDTO } from "../dtos/UserDTO";
import VerifyToken from "../middlewares/Auth";

const router = Router();

router.get("/", StatusController.getStatus);

router.post(
  "/refresh",
  UserController.refresh
);

router.post("/sair", UserController.logout);

router.post(
  "/editar-conta",
  VerifyToken,
  ValidateRequest(UserDTO, ["update"]),
  UserController.edit
);

router.post(
  "/entrar",
  ValidateRequest(UserDTO, ["login"]),
  UserController.login
);

router.post(
  "/cadastrar",
  ValidateRequest(UserDTO, ['create']),
  UserController.register
);

export default router;
