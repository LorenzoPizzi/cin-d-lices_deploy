import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import User  from "../models/user.model.js";
import { scrypt } from "../utils/scrypt.js";
import { StatusCodes } from "http-status-codes";
import Role  from "../models/role.model.js";
import { sendEmail } from "../utils/sendMail.js";

export async function register(req, res) {
    //console.log(req.body);
    const { nickname, email, password, confirmedPassword } = req.body;
    if (!nickname || !email || !password || !confirmedPassword) {
        return res.status(StatusCodes.BAD_REQUEST).render("errorpage", {
            message: "Tous les champs sont obligatoires.",
            isSuccess: false,
        });
    }
    let user = await User.findOne({ where: { email } });
    if (user) {
        return res.status(StatusCodes.BAD_REQUEST).render("errorpage", {
            message: "Cet utilisateur existe déjà.",
            isSuccess: false,
        });
    }
    if (password !== confirmedPassword) {
        return res.status(StatusCodes.BAD_REQUEST).render("errorpage", {
            message: "Veuillez saisir deux fois le même mot de passe.",
            isSuccess: false,
        });
    }
    try {
        // const hashedPassword = await scrypt.hash(password);
        const userRole = await Role.findOne({ where: { roleName: "user" } });
        const token = crypto.randomBytes(32).toString("hex");
        const newUser = await User.create({
            nickname,
            email,
            password,
            id_role: userRole.id_role,
            token: token,
            email_verified: false,
        });
        const link = `${process.env.BASE_URL}/profile/confirm/${token}`;
        await sendEmail(
            newUser.email,
            "Vérification de l'adresse e-mail",
            `Clique sur ce lien pour valider ton compte : ${link}`
        );
        return res.status(StatusCodes.CREATED).render("errorpage", {
            message:
                "Compte créé ! Un e-mail de vérification a été envoyé. Merci de vérifier ta boîte de réception.",
            isSuccess: true,
        });
    } catch (error) {
        console.error("Erreur lors du register:", error)
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .render("errorpage", {
                message: "Merci de réessayer ultérieurement.",
                isSuccess: false,
            });
    }
}

export async function login(req, res) {
    const emailFromRequest = req.body.email;
    const passwordFromRequest = req.body.password;

    try {
        const user = await User.findOne({ where: { email: emailFromRequest } });

        if (user) {
            if (!user.email_verified) {
                return res.status(StatusCodes.FORBIDDEN).render("errorpage", {
                    message:
                        "Veuillez valider votre adresse e-mail avant de vous connecter.",
                    isSuccess: false,
                });
            }
            if (await scrypt.compare(passwordFromRequest, user.password)) {
                const token = jwt.sign(
                    { id_user: user.id_user },
                    process.env.JWT_SECRET,
                    { expiresIn: "1h" }
                );
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 3600000,
                });
                return res.redirect("/profile");
            } else {
                return res.status(StatusCodes.BAD_REQUEST).render("errorpage", {
                    message: "Couple login / mot de passe incorrect.",
                    isSuccess: false,
                });
            }
        } else {
            return res.status(StatusCodes.BAD_REQUEST).render("errorpage", {
                message: "Couple login / mot de passe incorrect.",
                isSuccess: false,
            });
        }
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .render("errorpage", {
                message: "Merci de réessayer ultérieurement.",
                isSuccess: false,
            });
    }
}

export function logout(req, res) {
    res.clearCookie("token");
    return res.redirect("/");
}

export async function confirmEmail(req, res) {
    const token = req.params.token;
    try {
        const user = await User.findOne({ where: { token } });
        if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).render("errorpage", {
                message: "Lien de confirmation invalide ou expiré",
                isSuccess: false,
            });
        }
        user.email_verified = true;
        user.token = null;
        await user.save();
        return res.render("errorpage", {
            message: "Adresse e-mail confirmée avec succès !",
            isSuccess: true,
        });
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .render("errorpage", {
                message: "Erreur lors de la validation",
                isSuccess: false,
            });
    }
}
