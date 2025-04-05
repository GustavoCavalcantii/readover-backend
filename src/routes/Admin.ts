import { Router } from "express";
import AdminController from "../controllers/AdminController";

const router = Router();

router.get("/usuarios", AdminController.getUsers);

router.put(
  "/alterar",
  AdminController.changeUserAccess
);


export default router;