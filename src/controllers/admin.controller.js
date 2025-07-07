import User from "../models/user.model.js";
import Category from "../models/category.model.js";
import Recipe from "../models/recipe.model.js";

const adminController = {
  showAdminPage: async (req, res) => {
    try {
      const users = await User.findAll();
      const categories = await Category.findAll();
      const recipes = await Recipe.findAll();
      res.render("adminpage", { users, categories, recipes });
    } catch (error) {
      console.error("Erreur dans adminController:", error);
      res.status(500).send("Erreur serveur");
    }
  }
};

export default adminController;
