import { Router } from "express";
import JsonRequiredMiddleware from "../middlewares/JsonRequired";
import { ValidateRequest } from "../middlewares/ValidateRequest";
import { LoanDTO } from "../dtos/LoanDTO";
import LoanController from "../controllers/LoanController";
import { ValidateRoles } from "../middlewares/Roles";
import { Roles } from "../enums/User/UserRole";

const router = Router();

router.post(
  "/",
  JsonRequiredMiddleware,
  ValidateRequest(LoanDTO),
  LoanController.requestLoan
);

router.put(
  "/aprovar/:id",
  ValidateRoles(Roles.ADMIN),
  LoanController.approveLoan
);

router.put(
  "/rejeitar/:id",
  ValidateRoles(Roles.ADMIN),
  LoanController.rejectLoan
);

router.get(
  "/",
  ValidateRoles(Roles.ADMIN),
  LoanController.getAllLoans
);

router.get(
  "/id/:id",
  ValidateRoles(Roles.ADMIN),
  LoanController.getLoanById
);

router.put("/retornar/:id", ValidateRoles(Roles.ADMIN), LoanController.returnBook);

router.get("/pendentes", LoanController.getPendingLoans);

router.get("/meus-emprestimos", LoanController.getLoansByLoggedUser);

router.get("/usuario/:userId", LoanController.getLoanByUser);

router.get("/livro/:bookId", LoanController.getLoanByBook);

export default router;
