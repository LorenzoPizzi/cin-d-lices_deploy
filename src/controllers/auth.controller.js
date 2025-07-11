import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import User from "../models/user.model.js";
import { scrypt } from "../utils/scrypt.js";
import { StatusCodes } from "http-status-codes";
import Role from "../models/role.model.js";
import { sendEmail } from "../utils/sendMail.js";
import { Op } from "sequelize";

export async function register(req, res) {
    const { nickname, email, password, confirmedPassword } = req.body;
    if (!nickname || !email || !password || !confirmedPassword) {
        return res.status(StatusCodes.BAD_REQUEST).render("register", {
            errorMessage: "Tous les champs sont obligatoires.",
            style: "register",
            nickname,
            email,
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(StatusCodes.BAD_REQUEST).render("register", {
            errorMessage: "Format d'email invalide.",
            style: "register",
            nickname,
        });
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[^\s]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(StatusCodes.BAD_REQUEST).render("register", {
            errorMessage:
                "Le mot de passe doit contenir au moins 8 caractères, une lettre et un chiffre.",
            style: "register",
            nickname,
            email,
        });
    }

    let user = await User.findOne({
        where: {
            [Op.or]: [{ email: email }, { nickname: nickname }],
        },
    });
    if (user) {
        return res.status(StatusCodes.BAD_REQUEST).render("register", {
            errorMessage: "Cet utilisateur existe deja",
            style: "register",
            email,
        });
    }
    if (password !== confirmedPassword) {
        return res.status(StatusCodes.BAD_REQUEST).render("register", {
            errorMessage: "Veuillez saisir deux fois le même mot de passe.",
            style: "register",
            nickname,
            email,
        });
    }
    try {
        const hashedPassword = scrypt.hash(password);
        const userRole = await Role.findOne({ where: { roleName: "user" } });
        const token = crypto.randomBytes(32).toString("hex");
        const newUser = await User.create({
            nickname,
            email,
            password: hashedPassword,
            id_role: userRole.id_role,
            token: token,
            email_verified: false,
        });
        const link = `${process.env.BASE_URL}/profiles/confirm/${token}`;
        await sendEmail(
            newUser.email,
            "Vérification de l'adresse e-mail",
            `Clique sur ce lien pour valider ton compte : ${link}`
        );
        return res.status(StatusCodes.CREATED).render("error", {
            message:
                "Compte créé ! Un e-mail de vérification a été envoyé. Merci de vérifier ta boîte de réception.",
            isSuccess: true,
            style: "error",
        });
    } catch (error) {
        console.error("Erreur lors du register:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render("error", {
            message: "Merci de réessayer ultérieurement.",
            isSuccess: false,
            style: "error",
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
                return res.status(StatusCodes.FORBIDDEN).render("error", {
                    message:
                        "Veuillez valider votre adresse e-mail avant de vous connecter.",
                    isSuccess: false,
                    style: "error",
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
                return res.redirect("/profiles/myprofile/" + user.id_user);
            } else {
                return res.status(StatusCodes.BAD_REQUEST).render("login", {
                    errorMessage: "Adresse mail et/ou mot de passe incorrect",
                    style: "login",
                });
            }
        } else {
            return res.status(StatusCodes.BAD_REQUEST).render("login", {
                errorMessage: "Adresse mail et/ou mot de passe incorrect",
                style: "login",
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render("error", {
            message: "Merci de réessayer ultérieurement.",
            isSuccess: false,
            style: "error",
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
            return res.status(StatusCodes.BAD_REQUEST).render("error", {
                message: "Lien de confirmation invalide ou expiré",
                isSuccess: false,
                style: "error",
            });
        }
        user.email_verified = true;
        user.token = null;
        await user.save();
        return res.render("error", {
            message: "Adresse e-mail confirmée avec succès !",
            isSuccess: true,
            style: "error",
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render("error", {
            message: "Erreur lors de la validation",
            isSuccess: false,
            style: "error",
        });
    }
}
