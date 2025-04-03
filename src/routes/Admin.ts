import { Router } from "express";
import AdminController from "../controllers/AdminController";
import VerifyToken from "../middlewares/Auth";

const router = Router();

router.get("/usuarios", VerifyToken, AdminController.getUsers);

router.put(
  "/alterar",
  VerifyToken,
  AdminController.changeUserAccess
);

export default router;