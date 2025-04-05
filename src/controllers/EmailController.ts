import { Request, Response } from "express";
import { SuccessResponse } from "../@types/Responses/SuccessResponse";
import { ErrorResponse } from "../@types/Responses/ErrorResponse";
import logger from "../config/Logger";
import { IErrorDetail } from "../interfaces/IErrorDetail";
import { EmailService } from "../services/EmailService";

export class EmailController {
    static async sendEmail(req: Request, res: Response) {
        try {
            const { to, subject, text, html } = req.body;

            if (!to || !subject || !text) {
                const errorDetails: IErrorDetail[] = [
                    { field: "to", message: "O campo 'to' é obrigatório." },
                    { field: "subject", message: "O campo 'subject' é obrigatório." },
                    { field: "text", message: "O campo 'text' é obrigatório." }
                ];

                res
                  .status(400)
                  .json(ErrorResponse("Campos obrigatórios ausentes.", 400, errorDetails));
                
                return
            }

            await EmailService.sendEmail(to, subject, text, html);

            logger.info(`E-mail enviado para ${to} - Assunto: ${subject}`);

                res
                  .status(200)
                  .json(SuccessResponse(SuccessResponse(null, "Email enviado com sucesso", 200)));
                    
        } catch (error) {
            logger.info('Erro ao enviar e-mail', error);

                res
                  .status(500)
                  .json(ErrorResponse("Erro ao enviar e-mail", 500));
        }
    }
}