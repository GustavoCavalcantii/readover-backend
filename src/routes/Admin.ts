import { Router } from "express";
import AdminController from "../controllers/AdminController";
import VerifyToken from "../middlewares/Auth";
import imageBookUpload from "../config/MulterBook";

const router = Router();

router.get("/usuarios", AdminController.getUsers);

router.put(
  "/alterar",
  AdminController.changeUserAccess
);


export default router;