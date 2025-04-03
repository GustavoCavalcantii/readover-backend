import { Router } from "express";
import { EmailController } from "../controllers/emailController";

const router = Router();


router.post(
  "/enviar-email",
  EmailController.sendEmail
);


export default router;