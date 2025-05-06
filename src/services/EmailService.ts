import nodemailer from "nodemailer";
import { emailConfig } from "../config/Email";
import Logger from "../config/Logger";
import fs from "fs";
import path from "path";

const unsubscribeLink = (email: string) =>
  `https://readover.techgonz.com.br/unsubscribe?email=${encodeURIComponent(
    email
  )}`;

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

  private static setToHTML(text: string, email: string): string {
    const filePath = path.resolve(
      __dirname,
      "../utils/email/email-template.html"
    );
    let htmlTemplate = fs.readFileSync(filePath, "utf8");
    return htmlTemplate
      .replace("{{content}}", text)
      .replace("{{unsubscribeLink}}", unsubscribeLink(email));
  }

  static async sendEmail(
    to: string | string[],
    subject: string,
    text: string,
    html?: string,
    headers?: {}
  ): Promise<void> {
    try {
      const email = Array.isArray(to) ? to[0] : to;

      const htmlWithTemplate = html ? this.setToHTML(html, email) : undefined;

      const updatedHeaders = {
        "X-Google-Original-From": emailConfig.auth.user,
        "X-Google-Original-Subject": subject,
        "X-Mailer": "ReadoverMailer",
        "X-MimeOLE": "1.0",
        "List-Unsubscribe": `<${unsubscribeLink(email)}>`,
        ...headers,
      };

      const mailOptions = {
        from: emailConfig.auth.user,
        to: Array.isArray(to) ? to.join(",") : to,
        subject,
        text,
        html: htmlWithTemplate,
        headers: updatedHeaders,
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
    const html = `<p><strong>${name}</strong>,</p>
          <p>Clique no link abaixo para redefinir sua senha:</p>
          <a href="${link}">${link}</a>
          <p>Se você não solicitou isso, ignore este e-mail.</p>`;

    const headers = {
      "X-Priority": "1",
      "X-MSMail-Priority": "High",
      Importance: "High",
    };

    await this.sendEmail(to, subject, text, html, headers);
  }

  static async sendEmailResetEmail(to: string, name: string, link: string) {
    const subject = "Redefinição de email - Readover";
    const text = `Olá ${name}, aqui está o link para redefinir seu email: ${link}`;
    const html = `<p><strong>${name}</strong>,</p>
          <p>Clique no link abaixo para redefinir seu email:</p>
          <a href="${link}">${link}</a>
          <p>Se você não solicitou isso, ignore este e-mail.</p>`;

    const headers = {
      "X-Priority": "1",
      "X-MSMail-Priority": "High",
      Importance: "High",
    };

    await this.sendEmail(to, subject, text, html, headers);
  }

  static async sendLateLoanEmail(
    to: string,
    name: string,
    bookTitle: string,
    expectedReturnDate: string
  ) {
    const subject = "🔔 Empréstimo de Livro Atrasado - Readover";
    const text = `Olá ${name}, o prazo de devolução do livro "${bookTitle}" expirou em ${expectedReturnDate}. Por favor, devolva-o o quanto antes para evitar penalidades.`;

    const html = `
          <p><strong>${name}</strong>,</p>
          <p>Este é um lembrete de que o prazo para devolução do livro <strong>"${bookTitle}"</strong> expirou em <strong>${expectedReturnDate}</strong>.</p>
          <p>Por favor, devolva o livro o quanto antes para evitar possíveis penalidades.</p>
          <p>Se você já devolveu, desconsidere esta mensagem.</p>
        `;

    const headers = {
      "X-Priority": "1",
      "X-MSMail-Priority": "High",
      Importance: "High",
    };

    await this.sendEmail(to, subject, text, html, headers);
  }
}
