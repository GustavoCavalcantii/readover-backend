import { Router } from "express";
import JsonRequiredMiddleware from "../middlewares/JsonRequired";
import { ValidateRequest } from "../middlewares/ValidateRequest";
import AuthController from "../controllers/AuthController";
import { UserDTO } from "../dtos/UserDTO";
import { ResetTypes } from "../enums/User/ResetTypes";
import VerifyToken from "../middlewares/Auth";

const router = Router();

router.post("/refresh", AuthController.refresh);
router.post("/sair", AuthController.logout);

router.post(
  "/entrar",
  JsonRequiredMiddleware,
  ValidateRequest(UserDTO, ["login"]),
  AuthController.login
);

router.put(
  "/redefinir-email",
  JsonRequiredMiddleware,
  ValidateRequest(UserDTO, ["resetEmail"]),
  (req, res) => AuthController.resetUserInfo(ResetTypes.EMAIL, req, res)
);

router.post(
  "/solicita-email",
  JsonRequiredMiddleware,
  VerifyToken,
  ValidateRequest(UserDTO, ["requestReset"]),
  (req, res) => AuthController.requestResetInfo(ResetTypes.EMAIL, req, res)
);

router.put(
  "/redefinir-senha",
  JsonRequiredMiddleware,
  ValidateRequest(UserDTO, ["resetPass"]),
  (req, res) => AuthController.resetUserInfo(ResetTypes.PASSWORD, req, res)
);

router.post(
  "/solicita-senha",
  JsonRequiredMiddleware,
  ValidateRequest(UserDTO, ["requestReset"]),
  (req, res) => AuthController.requestResetInfo(ResetTypes.PASSWORD, req, res)
);

export default router;
