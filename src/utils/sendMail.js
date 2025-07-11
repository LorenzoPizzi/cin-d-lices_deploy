import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    auth: {
        user: process.env.MAILTRAP_,
        pass: process.env.MAILTRAP_PASSWORD,
    },
});

export async function sendEmail(to, subject, text) {
    const mailOptions = {
        from: '"Ciné Délices" <noreply@demomailtrap.co>',
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
