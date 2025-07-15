import { StatusCodes } from "http-status-codes";
import { sendEmail } from "../utils/sendMail.js";

export async function handleContactForm(req, res) {
    const { name, email, message } = req.body;
    res.locals.style = "error";

    if (!name || !email || !message) {
        return res.status(StatusCodes.BAD_REQUEST).render("errorpage", {
            message: "Tous les champs sont obligatoires.",
            isSuccess: false,
        });
    }

    try {
        const subject = `Nouveau message de contact de ${name}`;
        const text = `
Nom : ${name}
Email : ${email}
Message :
${message}
        `;

        await sendEmail("contact@demomailtrap.co", subject, text);

        return res.status(StatusCodes.OK).render("error", {
            message:
                "Merci pour votre message ! Nous reviendrons vers vous rapidement.",
            isSuccess: true,
            style: "error",
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render("error", {
            message:
                "Erreur lors de l'envoi du message. Merci de réessayer plus tard.",
            isSuccess: false,
            style: "error",
        });
    }
}
