import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import Recipe from "../models/recipe.model.js";
import { StatusCodes } from "http-status-codes";

const profileController = {
    getAllProfiles: async (req, res) => {
        try {
            const profiles = await User.findAll({
                attributes: { exclude: ["password", "token"] },
            });
            res.status(StatusCodes.OK).json(profiles);
        } catch (error) {
            console.error("Erreur getAllProfiles:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Erreur serveur",
            });
        }
    },

    showProfile: async (req, res) => {
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
                            "id_user",
                            "name",
                            "image_url",
                            "id_movie",
                        ],
                    },
                ],
            });
            if (!user) {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .send("Profil non trouvée");
            }
            res.locals.style = "profile";
            res.render("profile", { user });
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
                "Erreur lors de la récupération du profil"
            );
        }
    },

    updateProfile: async (req, res) => {
        try {
            const { id } = req.params;
            const { nickname, email, picture_url, description } = req.body;

            const profile = await User.findByPk(id);
            if (!profile) {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({ message: "Profil non trouvé" });
            }

            if (nickname) profile.nickname = nickname;
            if (email) profile.email = email;
            if (picture_url) profile.picture_url = picture_url;
            if (description) profile.description = description;

            await profile.save();

            const {
                password: _,
                token: __,
                ...updatedProfile
            } = profile.toJSON();
            res.status(StatusCodes.OK).json(updatedProfile);
        } catch (error) {
            console.error("Erreur updateProfile:", error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Erreur serveur",
            });
        }
    },

    deleteProfile: async (req, res) => {
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
    },
};

export default profileController;
