import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/user.model.js"
import { Role } from "../models/role.model.js"

export function authenticate( req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(StatusCodes.UNAUTHORIZED).json({error: "Token manquant"})
    }

    const token = authHeader.split(' ')[1];

    try {
        const dataDecoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userID = dataDecoded.user_id;

        next();
    }
    catch (error) {
        res.status(StatusCodes.UNAUTHORIZED).json({ error: "Token invalide ou expiré"});
    }
}

export function checkRole(requiredRole) {
    return async (req, res, next) => {
        try {
            const user = await User.findByPk(req.id_user, {
                include: { model: Role, as: "roles"}
            })

            if (!user){
                res.status(StatusCodes.FORBIDDEN).json({ error : "Accès refusé"})
            }

            if (user.role.name === "admin") {
                return next();
            }

            else if (user.role.name === requiredRole) {
                // TODO : ajouter toutes les actions faisables par l'utilisateur 
            }

            else  {
                res.status(StatusCodes.FORBIDDEN).json( "Accès refusé")
            }
        }
        catch (error){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error : "Erreur interne"})
        }
    }
}