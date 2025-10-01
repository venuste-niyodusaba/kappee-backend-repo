"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.APP_NAME,
        pass: process.env.APP_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    },
});
const sendMailSender = async (to, subject, htmlContent) => {
    try {
        const mailOptions = {
            from: process.env.APP_NAME,
            to,
            subject,
            html: htmlContent,
        };
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
        return true;
    }
    catch (error) {
        console.error("Error sending email:", error.message);
        return false;
    }
};
exports.default = sendMailSender;
