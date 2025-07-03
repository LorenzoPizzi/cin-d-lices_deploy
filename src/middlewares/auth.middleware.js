import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/user.model.js";
import { Role } from "../models/role.model.js";
import { Recipe } from "../models/recipe.model.js";

export function authenticate(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ error: "Token manquant" });
    }

    try {
        const dataDecoded = jwt.verify(token, process.env.JWT_SECRET);
        req.id_user = dataDecoded.id_user;

        next();
    } catch (error) {
        res.status(StatusCodes.UNAUTHORIZED).json({
            error: "Token invalide ou expiré",
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
                return res
                    .status(StatusCodes.FORBIDDEN)
                    .json({ error: "Accès refusé" });
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
                        return res.status(StatusCodes.FORBIDDEN).json({
                            error: "Vous ne pouvez modifier que vos propres recettes.",
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
                        return res.status(StatusCodes.FORBIDDEN).json({
                            error: "Vous ne pouvez supprimer que vos propres recettes.",
                        });
                    }
                }
                return res
                    .status(StatusCodes.FORBIDDEN)
                    .json({ error: "Accès refusé" });
            }
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ error: "Accès refusé" });
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: "Erreur interne",
            });
        }
    };
}
