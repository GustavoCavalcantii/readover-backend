import { Router } from "express";
import StatusController from "../controllers/statusController";
import UserController from "../controllers/userController";

const router = Router();

router.get("/", StatusController.getStatus);
router.post("/login", UserController.login);
router.post("/register", UserController.register);

export default router;