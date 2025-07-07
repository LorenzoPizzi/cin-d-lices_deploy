import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/user.model.js";
import { Role } from "../models/role.model.js";
import { Recipe } from "../models/recipe.model.js";

export function authenticate(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).render("errorpage", {
            message: "Accès refusé : veuillez vous connecter.",
            isSuccess: false,
        });
    }

    try {
        const dataDecoded = jwt.verify(token, process.env.JWT_SECRET);
        req.id_user = dataDecoded.id_user;

        next();
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).render("errorpage", {
            message: "Session expirée ou invalide, merci de vous reconnecter.",
            isSuccess: false,
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
                return res.status(StatusCodes.FORBIDDEN).render("errorpage", {
                    message: "Accès refusé. Utilisateur non trouvé.",
                    isSuccess: false,
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
                            .render("errorpage", {
                                message:
                                    "Vous ne pouvez modifier que vos propres recettes.",
                                isSuccess: false,
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
                            .render("errorpage", {
                                message:
                                    "Vous ne pouvez supprimer que vos propres recettes.",
                                isSuccess: false,
                            });
                    }
                }
                return res.status(StatusCodes.FORBIDDEN).render("errorpage", {
                    message: "Accès refusé. Action non autorisée.",
                    isSuccess: false,
                });
            }
            return res.status(StatusCodes.FORBIDDEN).render("errorpage", {
                message: "Accès refusé. Vous n'avez pas le rôle requis.",
                isSuccess: false,
            });
        } catch (error) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .render("errorpage", {
                    message: "Erreur interne.",
                    isSuccess: false,
                });
        }
    };
}
