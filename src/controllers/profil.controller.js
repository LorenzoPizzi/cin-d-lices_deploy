import User from "../models/user.model.js";
import Role from "../models/role.model.js";

const profileController = {
  getAllProfiles: async (req, res) => {
    try {
      const profiles = await User.findAll({
        attributes: { exclude: ["password", "token"] },
      });
      res.status(200).json(profiles);
    } catch (error) {
      console.error("Erreur getAllProfiles:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  },

  myProfile: async (req, res) => {
    try {
      const userId = 3;
      const user = await User.findByPk(req.id_user, {
        attributes: [
          "id_user",
          "nickname",
          "email",
          "picture_url",
          "description",
        ],
        include: {
          model: Role,
          as: "role",
          attributes: ["roleName"],
        },
      });
      console.log(userId);
      if (!userId) {
        return res.render("errorpage", {
          message: "Utilisateur non trouvé",
        });
      }

      return res.render("profile", {
        user: user,
        title: "Mon Profil",
      });
    } catch (error) {
      console.error("Erreur dans myProfile:", error);
      return res.render("errorpage", {
        message: "Une erreur est survenue",
      });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const { id } = req.params;
      const { nickname, email, picture_url, description } = req.body;

      const profile = await User.findByPk(id);
      if (!profile) {
        return res.status(404).json({ message: "Profil non trouvé" });
      }

      if (nickname) profile.nickname = nickname;
      if (email) profile.email = email;
      if (picture_url) profile.picture_url = picture_url;
      if (description) profile.description = description;

      await profile.save();

      const { password: _, token: __, ...updatedProfile } = profile.toJSON();
      res.status(200).json(updatedProfile);
    } catch (error) {
      console.error("Erreur updateProfile:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  },

  deleteProfile: async (req, res) => {
    try {
      const { id } = req.params;
      const profile = await User.findByPk(id);
      if (!profile) {
        return res.status(404).json({ message: "Profil non trouvé" });
      }

      await profile.destroy();
      res.status(204).send();
    } catch (error) {
      console.error("Erreur deleteProfile:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
};

export default profileController;
