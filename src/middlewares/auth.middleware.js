import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import Recipe from "../models/recipe.model.js";

/* ------------------------- helpers réutilisables ------------------------- */

function getUserIdFromReq(req) {
  // compat : token pouvant contenir id_user ou id
  return Number(req?.user?.id_user ?? req?.user?.id);
}

function isRequestingJson(req) {
  return req.accepts && req.accepts("json");
}

function isAdminFromReq(req) {
  // 1) depuis le token JWT
  if (req?.user?.role === "admin") return true;
  if (req?.user?.isAdmin === true || req?.user?.is_admin === true) return true;

  // 2) depuis res.locals.user (attachUser) si disponible
  const roleName = req?.res?.locals?.user?.role?.roleName;
  if (roleName === "admin") return true;

  return false;
}

function renderForbidden(req, res, message) {
  if (isRequestingJson(req)) {
    return res.status(StatusCodes.FORBIDDEN).json({ error: message });
  }
  return res.status(StatusCodes.FORBIDDEN).render("error", {
    message,
    isSuccess: false,
    style: "error",
  });
}

function renderUnauthorized(req, res, message) {
  if (isRequestingJson(req)) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: message });
  }
  return res.status(StatusCodes.UNAUTHORIZED).render("error", {
    message,
    isSuccess: false,
    style: "error",
  });
}

function renderServerError(req, res, message = "Erreur interne.") {
  if (isRequestingJson(req)) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: message });
  }
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render("error", {
    message,
    isSuccess: false,
    style: "error",
  });
}

/* ----------------------------- middlewares ------------------------------ */

export function authenticate(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return renderUnauthorized(req, res, "Accès refusé : veuillez vous connecter.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ⚠️ doit contenir id_user ou id
    return next();
  } catch (_err) {
    return renderUnauthorized(
      req,
      res,
      "Session expirée ou invalide, merci de vous reconnecter."
    );
  }
}

/**
 * Vérifie le rôle requis. Bypass si admin.
 * Usage: router.post('/recipes', authenticate, checkRole('user'), ctrl.create)
 */
export function checkRole(requiredRole) {
  return async (req, res, next) => {
    try {
      const userId = getUserIdFromReq(req);
      if (!userId) {
        return renderForbidden(req, res, "Accès refusé. Utilisateur non identifié.");
      }

      const user = await User.findByPk(userId, {
        include: { model: Role, as: "role" },
      });

      if (!user) {
        return renderForbidden(req, res, "Accès refusé. Utilisateur non trouvé.");
      }

      // ✅ Admin : accès total
      if (user.role?.roleName === "admin") {
        return next();
      }

      // Si le rôle correspond exactement au rôle requis → autorisations contextualisées
      if (user.role?.roleName === requiredRole) {
        const method = req.method.toUpperCase();
        const path = req.path;

        // Exemple d'autorisations spécifiques
        if (method === "PATCH" && path.startsWith("/profile")) {
          return next();
        }

        if (method === "POST" && path.startsWith("/recipes")) {
          return next();
        }

        // PATCH /recipes/:id (propriétaire uniquement)
        if (method === "PATCH" && path.startsWith("/recipes") && req.params.id) {
          const recipe = await Recipe.findByPk(req.params.id);
          if (recipe && Number(recipe.id_user) === Number(user.id_user)) {
            return next();
          }
          return renderForbidden(
            req,
            res,
            "Vous ne pouvez modifier que vos propres recettes."
          );
        }

        // DELETE /recipes/:id (propriétaire uniquement)
        if (method === "DELETE" && path.startsWith("/recipes") && req.params.id) {
          const recipe = await Recipe.findByPk(req.params.id);
          if (recipe && Number(recipe.id_user) === Number(user.id_user)) {
            return next();
          }
          return renderForbidden(
            req,
            res,
            "Vous ne pouvez supprimer que vos propres recettes."
          );
        }

        // Rôle ok mais action non prévue
        return renderForbidden(req, res, "Accès refusé. Action non autorisée.");
      }

      // Rôle non autorisé
      return renderForbidden(
        req,
        res,
        "Accès refusé. Vous n'avez pas le rôle requis."
      );
    } catch (error) {
      // console.error("[checkRole] error:", error);
      return renderServerError(req, res);
    }
  };
}

/**
 * Attache l'utilisateur (avec son rôle) à res.locals.user pour les vues EJS
 * Ne bloque jamais; met juste `null` en cas d'échec.
 */
export async function attachUser(req, res, next) {
  const token = req.cookies?.token;
  if (!token) {
    res.locals.user = null;
    return next();
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id_user ?? decoded.id, {
      include: { model: Role, as: "role" },
    });
    res.locals.user = user || null;
  } catch {
    res.locals.user = null;
  }
  return next();
}

/**
 * Vérifie que l'utilisateur est propriétaire du profil demandé,
 * avec bypass si admin.
 * Usage: router.get('/profiles/:id', authenticate, checkOwner, ctrl.showProfile)
 */
export function checkOwner(req, res, next) {
  const requestedId = Number(req.params.id);
  const loggedUserId = getUserIdFromReq(req);

  // ✅ bypass si admin
  if (isAdminFromReq(req)) {
    return next();
  }

  if (Number.isNaN(requestedId) || Number.isNaN(loggedUserId)) {
    return renderForbidden(req, res, "Accès interdit : utilisateur invalide.");
  }

  if (requestedId !== loggedUserId) {
    return renderForbidden(
      req,
      res,
      "Accès interdit : ce profil ne vous appartient pas."
    );
  }

  return next();
}
