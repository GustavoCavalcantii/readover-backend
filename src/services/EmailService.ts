import nodemailer from "nodemailer";
import { emailConfig } from "../config/Email";
import Logger from "../config/Logger";

export class EmailService {
    private static transporter = nodemailer.createTransport({
        host: emailConfig.host,
        port: emailConfig.port,
        secure: emailConfig.secure,
        auth: {
            user: emailConfig.auth.user,
            pass: emailConfig.auth.pass,
        },
    });

    static async sendEmail(to: string | string[], subject: string, text: string, html?: string): Promise<void> {
        try {
            const mailOptions = {
                from: emailConfig.auth.user,
                to: Array.isArray(to) ? to.join(", ") : to,
                subject,
                text,
                html,
            };

            const info = await this.transporter.sendMail(mailOptions);
            Logger.info(`📧 E-mail enviado para ${to}: ${info.messageId}`);
        } catch (error) {
            Logger.error("❌ Erro ao enviar e-mail:", error);
            throw new Error("Falha no envio de e-mail");
        }
    }

    static async sendPasswordResetEmail(to: string, name: string, link: string) {
        const subject = "Redefinição de senha - Readover";
        const text = `Olá ${name}, aqui está o link para redefinir sua senha: ${link}`;
        const html = 
         `<p>Olá <strong>${name}</strong>,</p>
          <p>Clique no link abaixo para redefinir sua senha:</p>
          <a href="${link}">${link}</a>
          <p>Se você não solicitou isso, ignore este e-mail.</p>`;
    
        await this.sendEmail(to, subject, text, html);
      }
}