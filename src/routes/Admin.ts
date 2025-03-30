import { Router } from "express";
import AdminController from "../controllers/AdminController";
import VerifyToken from "../middlewares/Auth";
import { ValidateRoles } from "../middlewares/Roles";
import { Roles } from "../enums/User/UserRole";

const router = Router();

router.get("/usuarios", VerifyToken, ValidateRoles(Roles.ADMIN), AdminController.getUsers);

export default router;