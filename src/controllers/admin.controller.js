import User from "../models/user.model.js";
import Category from "../models/category.model.js";
import Recipe from "../models/recipe.model.js";

const adminController = {
  showAdminPage: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: { exclude: ["password", "token"] },
        include: [{ model: Recipe, as: "recipes", attributes: ["id_recipe"] }],
      });
     
      

      const categories = await Category.findAll();
      const recipes = await Recipe.findAll({
        include: [
          {
            model: User,
            as: "author",  
            attributes: ["nickname"]
          }
        ]
      });
      
    res.locals.style = 'admin';
      res.render("admin", { users, categories, recipes });
    } catch (error) {
      console.error("Erreur dans adminController:", error);
      res.status(500).send("Erreur serveur");
    }
  }
};

export default adminController;

