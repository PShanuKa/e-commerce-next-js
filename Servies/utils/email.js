"use strict";

import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || "smtp.gmail.com",
      port: parseInt(process.env.MAIL_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    this.templatesDir = path.join(__dirname, "..", "templates", "emails");
    this.companyInfo = {
      companyName: process.env.MAIL_FROM_NAME || "Sellora",
      companyAddress: "Colombo, Sri Lanka",
      year: new Date().getFullYear(),
      accentColor: "#6366f1",
      headerGradientStart: "#6366f1",
      headerGradientEnd: "#4f46e5",
    };
  }

  async buildEmail(templateName, variables, theme = {}) {
    const baseHtmlPath = path.join(this.templatesDir, "layouts", "base.html");
    const contentHtmlPath = path.join(
      this.templatesDir,
      `${templateName}.html`,
    );

    let baseHtml = await fs.readFile(baseHtmlPath, "utf-8");
    let contentHtml = await fs.readFile(contentHtmlPath, "utf-8");

    // Merge theme and company info
    const fullTheme = { ...this.companyInfo, ...theme };

    // Replace variables in content
    for (const [key, value] of Object.entries(variables)) {
      contentHtml = contentHtml.replace(new RegExp(`{{${key}}}`, "g"), value);
    }
    // Content can also use theme stuff
    for (const [key, value] of Object.entries(fullTheme)) {
      contentHtml = contentHtml.replace(new RegExp(`{{${key}}}`, "g"), value);
    }

    // Inject content into base
    baseHtml = baseHtml.replace(/{{emailBody}}/g, contentHtml);

    // Replace variables in base (header icon, title, colors, etc.)
    const allVariables = { ...fullTheme, ...variables };
    for (const [key, value] of Object.entries(allVariables)) {
      baseHtml = baseHtml.replace(new RegExp(`{{${key}}}`, "g"), value);
    }

    return baseHtml;
  }

  async sendEmail(to, subject, html) {
    const info = await this.transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to,
      subject,
      html,
    });
    return info;
  }

  async sendWelcomeEmail(email, userName) {
    const html = await this.buildEmail(
      "welcome",
      {
        userName,
        shopUrl: "http://localhost:5173/products",
        accountUrl: "http://localhost:5173/account",
        wishlistUrl: "http://localhost:5173/wishlist",
      },
      {
        headerIcon: "🚀",
        headerTitle: "Welcome Aboard!",
        headerGradientStart: "#10b981",
        headerGradientEnd: "#059669",
        accentColor: "#10b981",
      },
    );
    return await this.sendEmail(email, "Welcome to Sellora!", html);
  }

  async sendPasswordResetEmail(email, userName, resetUrl) {
    const html = await this.buildEmail(
      "password-reset",
      {
        userName,
        resetUrl,
      },
      {
        headerIcon: "🔒",
        headerTitle: "Password Reset Request",
        headerGradientStart: "#f43f5e",
        headerGradientEnd: "#e11d48",
        accentColor: "#f43f5e",
      },
    );
    return await this.sendEmail(email, "Password Reset - Sellora", html);
  }
}

export default new EmailService();
