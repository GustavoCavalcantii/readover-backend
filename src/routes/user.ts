import { Router } from "express";
import StatusController from "../controllers/StatusController";
import UserController from "../controllers/UserController";
import { ValidateRequest } from "../middlewares/ValidateRequest";
import { UserDTO } from "../dtos/UserDTO";

const router = Router();

router.get("/", StatusController.getStatus);

router.post(
  "/login",
  ValidateRequest(UserDTO, ["update"]),
  UserController.login
);

router.post(
  "/register",
  ValidateRequest(UserDTO, ['create']),
  UserController.register
);

export default router;
