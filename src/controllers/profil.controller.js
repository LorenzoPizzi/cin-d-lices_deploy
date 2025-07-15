import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import Recipe from "../models/recipe.model.js";
import Movie from "../models/movie.model.js";
import { StatusCodes } from "http-status-codes";

export async function getAllProfiles(req, res) {
    try {
        const profiles = await User.findAll({
            attributes: { exclude: ["password", "token"] },
            include: [{ model: Role, as: "role", attributes: ["roleName"] }],
        });
        res.status(StatusCodes.OK).json(profiles);
    } catch (error) {
        console.error("Erreur getAllProfiles:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Erreur serveur",
        });
    }
}

export async function showProfile(req, res) {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: [
                "id_user",
                "nickname",
                "email",
                "picture_url",
                "description",
            ],
            include: [
                { model: Role, as: "role", attributes: ["roleName"] },
                {
                    model: Recipe,
                    as: "recipes",
                    attributes: [
                        "id_recipe",
                        "id_user",
                        "name",
                        "image_url",
                        "id_movie",
                    ],
                    include: [
                        {
                            model: Movie,
                            as: "movie",
                            attributes: ["title"],
                        },
                    ],
                },
            ],
        });

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).send("Profil non trouvé");
        }

        res.locals.style = "profile";
        res.render("profile", { user });
    } catch (error) {
        console.error("Erreur showProfile:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
            "Erreur lors de la récupération du profil"
        );
    }
}

export async function updateProfile(req, res) {
    try {
        const { id } = req.params;
        const { nickname, email, picture_url, description } = req.body;

        const profile = await User.findByPk(id);
        if (!profile) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "Profil non trouvé" });
        }

        if (nickname !== undefined) profile.nickname = nickname;
        if (email !== undefined) profile.email = email;
        if (picture_url !== undefined) profile.picture_url = picture_url;
        if (description !== undefined) profile.description = description;

        await profile.save();

        // Exclure password et token dans la réponse
        const { password, token, ...updatedProfile } = profile.toJSON();

        res.status(StatusCodes.OK).json(updatedProfile);
    } catch (error) {
        console.error("Erreur updateProfile:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Erreur serveur",
        });
    }
}

export async function deleteProfile(req, res) {
    try {
        const { id } = req.params;
        const redirectTo = req.query.redirectTo || "";

        const profile = await User.findByPk(id);
        if (!profile) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "Profil non trouvé" });
        }

        await profile.destroy();

        return res.redirect(`/${redirectTo}`);
    } catch (error) {
        console.error("Erreur deleteProfile:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Erreur serveur",
        });
    }

}

export async function uploadPicture(req, res) {
    try {
        const { id } = req.params;
        const file = req.file;

        if (!file) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .send("Aucun fichier reçu");
        }


        const profile = await User.findByPk(id);
        if (!profile) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .send("Utilisateur non trouvé");
        }

        profile.picture_url = `/uploads/${file.filename}`;
        await profile.save();

        res.redirect(`/profiles/myprofile/${id}`);
    } catch (error) {
        console.error("Erreur uploadPicture:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
            "Erreur lors de l'envoi de l'image"
        );
    }
}
