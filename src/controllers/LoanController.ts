import { Request, Response } from "express";
import { ErrorResponse } from "../@types/Responses/ErrorResponse";
import { SuccessResponse } from "../@types/Responses/SuccessResponse";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { LoanDTO } from "../dtos/LoanDTO";
import LoanService from "../services/LoanService";
import logger from "../config/Logger";
import { link } from "fs";
import { IBook } from "../interfaces/IBook";
import Loan from "../models/Loan";

class LoanController {

    async requestLoan(req: Request, res: Response) {
        try{
            const requestLoanDto = plainToInstance(LoanDTO, req.body);
            const loan = await LoanService.requestLoan(requestLoanDto);

            const response = {
                id: loan._id,
                userId: loan.userId,
                bookId: loan.bookId,
                status: loan.status,
                loanDate: loan.loanDate,
                expectedReturnDate: loan.expectedReturnDate,
                actualReturnDate: loan.actualReturnDate
            }

            res
                .status(201)
                .json(SuccessResponse(response, "Empréstimo solicitado com sucesso!", 201));
        }
        catch (error) {
            logger.error("Erro ao solicitar empréstimo", error);
            res
                .status(400)
                .json(ErrorResponse("Erro ao solicitar empréstimo", 400));
        }
    }

    async approveLoan(req: Request, res: Response) {
        try {
            const loan = await LoanService.approveLoan(req.params.id);

            const response = {
                id: loan._id,
                userId: loan.userId,
                bookId: loan.bookId,
                status: loan.status,
                loanDate: loan.loanDate,
                expectedReturnDate: loan.expectedReturnDate,
                actualReturnDate: loan.actualReturnDate
            }

            res
                .status(200)
                .json(SuccessResponse(response, "Empréstimo aprovado com sucesso!", 200));
        }
        catch (error) {
            logger.error("Erro ao aprovar empréstimo", error);
            res
                .status(400)
                .json(ErrorResponse("Erro ao aprovar empréstimo", 400));
        }
    }

    async rejectLoan(req: Request, res: Response) {
        try {
            const loan = await LoanService.rejectLoan(req.params.id);

            const response = {
                id: loan._id,
                userId: loan.userId,
                bookId: loan.bookId,
                status: loan.status,
                loanDate: loan.loanDate,
                expectedReturnDate: loan.expectedReturnDate,
                actualReturnDate: loan.actualReturnDate
            };

            res
                .status(200)
                .json(SuccessResponse(response, "Solicitação de empréstimo rejeitada com sucesso!", 200));
        } catch (error) {
            logger.error("Erro ao rejeitar empréstimo", error);
            res
                .status(400)
                .json(ErrorResponse("Erro ao rejeitar empréstimo", 400));
        }
    }

    async getPendingLoans(req: Request, res: Response) {
        try {
            const loans = await LoanService.getPendingLoans();

            const response = loans.map(loan => ({
                id: loan._id,
                userId: loan.userId,
                bookId: loan.bookId,
                status: loan.status,
                loanDate: loan.loanDate,
                expectedReturnDate: loan.expectedReturnDate,
                actualReturnDate: loan.actualReturnDate
            }));

            if(response.length === 0) {
                res.status(204).json(ErrorResponse("Nenhum empréstimo pendente encontrado", 204)); 

                return;
            } 

            res
                .status(200)
                .json(SuccessResponse(response, "Empréstimos pendentes recuperados com sucesso!", 200));
        } catch (error) {
            logger.error("Erro ao obter empréstimos pendentes", error);
            res
                .status(400)
                .json(ErrorResponse("Erro ao obter empréstimos pendentes", 400));
        }
    }

    async getLoanByUser(req: Request, res: Response) {
        try {
            const loan = await LoanService.getLoanByUser(req.params.userId);

            if (!loan) {
                res.status(404).json(ErrorResponse("Empréstimo não encontrado para este usuário", 404));

                return;
            }

            const response = {
                id: loan._id,
                userId: loan.userId,
                bookId: loan.bookId,
                status: loan.status,
                loanDate: loan.loanDate,
                expectedReturnDate: loan.expectedReturnDate,
                actualReturnDate: loan.actualReturnDate
            };

            res
                .status(200)
                .json(SuccessResponse(response, "Empréstimo encontrado!", 200));
        } catch (error) {
            logger.error("Erro ao buscar empréstimo por usuário", error);
            res
                .status(400)
                .json(ErrorResponse("Erro ao buscar empréstimo por usuário", 400));
        }
    }

    async getLoanByBook(req: Request, res: Response) {
        try {
            const loan = await LoanService.getLoanByBook(req.params.bookId);

            if (!loan) {
                res.status(404).json(ErrorResponse("Empréstimo não encontrado para este livro", 404));

                return;     
            }

            const response = {
                id: loan._id,
                userId: loan.userId,
                bookId: loan.bookId,
                status: loan.status,
                loanDate: loan.loanDate,
                expectedReturnDate: loan.expectedReturnDate,
                actualReturnDate: loan.actualReturnDate
            };

            res
                .status(200)
                .json(SuccessResponse(response, "Empréstimo encontrado!", 200));
        } catch (error) {
            logger.error("Erro ao buscar empréstimo por livro", error);
            res
                .status(400)
                .json(ErrorResponse("Erro ao buscar empréstimo por livro", 400));
        }
    }

    async returnBook(req: Request, res: Response) {
        try {
            const loan = await LoanService.returnBook(req.params.id);

            const response = {
                id: loan._id,
                userId: loan.userId,
                bookId: loan.bookId,
                status: loan.status,
                loanDate: loan.loanDate,
                expectedReturnDate: loan.expectedReturnDate,
                actualReturnDate: loan.actualReturnDate
            };

            res
                .status(200)
                .json(SuccessResponse(response, "Livro devolvido com sucesso!", 200));
        } catch (error) {
            logger.error("Erro ao devolver livro", error);
            res
                .status(400)
                .json(ErrorResponse("Erro ao devolver livro", 400));
        }
    }
}

export default new LoanController();
