import nodemailer, { Transporter, SendMailOptions } from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter: Transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendMailSender = async (
  to: string,
  subject: string,
  htmlContent: string
): Promise<boolean> => {
  try {
    const mailOptions: SendMailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    return true;
  } catch (error: any) {
    console.error("Error sending email:", error.message);
    return false;
  }
};

export default sendMailSender;
