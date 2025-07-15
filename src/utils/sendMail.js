import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

export async function sendEmail(to, subject, text) {
    const mailOptions = {
        from: `"Ciné Délices" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email envoyé : " + info.response);
        return info;
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'email :", error);
        throw error;
    }
}
