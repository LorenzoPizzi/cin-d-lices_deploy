import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/user.model.js";
import { Role } from "../models/role.model.js";

export function authenticate(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Token manquant" });
  }

  try {
    const dataDecoded = jwt.verify(token, process.env.JWT_SECRET);
    req.id_user = dataDecoded.user_id;

    next();
  } catch (error) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Token invalide ou expiré" });
  }
}

export function checkRole(requiredRole) {
  return async (req, res, next) => {
    try {
      const user = await User.findByPk(req.id_user, {
        include: { model: Role, as: "roles" },
      });

      if (!user) {
        res.status(StatusCodes.FORBIDDEN).json({ error: "Accès refusé" });
      }

      if (user.role.roleName === "admin") {
        return next();
      } else if (user.role.roleName === requiredRole) {
        // TODO : ajouter toutes les actions faisables par l'utilisateur
      } else {
        res.status(StatusCodes.FORBIDDEN).json("Accès refusé");
      }
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Erreur interne" });
    }
  };
}
