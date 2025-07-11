import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import Recipe from "../models/recipe.model.js";

export function authenticate(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).render("error", {
            message: "Accès refusé : veuillez vous connecter.",
            isSuccess: false,
            style: "error",

        });
    }

    try {
        const dataDecoded = jwt.verify(token, process.env.JWT_SECRET);
        req.id_user = dataDecoded.id_user;

        next();
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).render("error", {
            message: "Session expirée ou invalide, merci de vous reconnecter.",
            isSuccess: false,
            style: "error",

        });
    }
}

export function checkRole(requiredRole) {
    return async (req, res, next) => {
        try {
            const user = await User.findByPk(req.id_user, {
                include: { model: Role, as: "role" },
            });

            if (!user) {
                return res.status(StatusCodes.FORBIDDEN).render("error", {
                    message: "Accès refusé. Utilisateur non trouvé.",
                    isSuccess: false,
                    style: "error",

                });
            }

            if (user.role.roleName === "admin") {
                return next();
            } else if (user.role.roleName === requiredRole) {
                const method = req.method;
                const path = req.path;

                if (method === "PATCH" && path.startsWith("/profile")) {
                    return next();
                }

                if (method === "POST" && path.startsWith("/recipes")) {
                    return next();
                }

                if (
                    method === "PATCH" &&
                    path.startsWith("/recipes") &&
                    req.params.id
                ) {
                    const recipe = await Recipe.findByPk(req.params.id);
                    if (recipe && recipe.id_user === user.id_user) {
                        return next();
                    } else {
                        return res
                            .status(StatusCodes.FORBIDDEN)
                            .render("error", {
                                message:
                                    "Vous ne pouvez modifier que vos propres recettes.",
                                isSuccess: false,
                                style: "error",
                            });
                    }
                }

                if (
                    method === "DELETE" &&
                    path.startsWith("/recipes") &&
                    req.params.id
                ) {
                    const recipe = await Recipe.findByPk(req.params.id);
                    if (recipe && recipe.id_user === user.id_user) {
                        return next();
                    } else {
                        return res
                            .status(StatusCodes.FORBIDDEN)
                            .render("error", {
                                message:
                                    "Vous ne pouvez supprimer que vos propres recettes.",
                                isSuccess: false,
                                style: "error",

                            });
                    }
                }
                return res.status(StatusCodes.FORBIDDEN).render("error", {
                    message: "Accès refusé. Action non autorisée.",
                    isSuccess: false,
                    style: "error",
                });
            }
            return res.status(StatusCodes.FORBIDDEN).render("error", {
                message: "Accès refusé. Vous n'avez pas le rôle requis.",
                isSuccess: false,
                style: "error",

            });
        } catch (error) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .render("error", {
                    message: "Erreur interne.",
                    isSuccess: false,
                    style: "error",

                });
        }
    };
}

export async function attachUser(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        res.locals.user = null;
        return next();
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id_user, {
            include: { model: Role, as: "role" },
        });
        res.locals.user = user || null;
    } catch {
        res.locals.user = null;
    }
    next();
}
