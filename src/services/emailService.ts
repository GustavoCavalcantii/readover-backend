import nodemailer from "nodemailer";
import { emailConfig } from "../config/email";

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
            console.log(`📧 E-mail enviado para ${to}: ${info.messageId}`);
        } catch (error) {
            console.error("❌ Erro ao enviar e-mail:", error);
            throw new Error("Falha no envio de e-mail");
        }
    }
}