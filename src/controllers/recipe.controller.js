import { Category, Recipe } from "../models/index.js";

const recipeController = {
  showAllRecipes: async (req, res) => {
    try {
      const recipes = await Recipe.findAll({
        include: [
          {
            association: "movie",
            attributes: ["title"]
          },
          {
            model: User,
            as: "author", 
            attributes: ["nickname"]
          },
        ]
      });
      res.render("home", { recipes});
    } catch (error) {
      res.status(500).send("Erreur lors de la récupération des recettes");
    }
  },

  showRecipeDetail: async (req, res) => {
    try {
      const recipe = await Recipe.findByPk(req.params.id, {
        include: [
          {
            model: Category,
            as: "categories"
          },
          {
            association: "movie",
            attributes: ["title"]
          }
        ]
      });
      console.log("Recette trouvée :", req.params.id);
      if (!recipe) { return res.status(404).send("Recette non trouvée");
      }
      res.render("recipeDetail", { recipe });
    } catch (error) {
      res.status(500).send("Erreur lors de la récupération de la recette");
    }
  },

  showAddRecipeForm: (req, res) => {
    res.render("addrecipe", { recipe: {}}); 
  },

  addRecipe: async (req, res) => {
    try {
      const { name, instructions, ingredients, image_url } = req.body;
      const newRecipe = await Recipe.create({ name, instructions, ingredients, image_url });
      res.render("addrecipe");
    } catch (error) {
      res.status(500).send("Erreur lors de l'ajout de la recette");
    }
  },

  showEditRecipeForm: async (req, res) => {
    try {
      const recipe = await Recipe.findByPk(req.params.id);
      if (!recipe) return res.status(404).send("Recette non trouvée");
      res.render("addrecipe", { recipe });
    } catch (error) {
      res.status(500).send("Erreur lors de la récupération de la recette");
    }
  },

  editRecipe: async (req, res) => {
    try {
      console.log("ID de la recette reçue :", req.params.id);
      console.log("Données du formulaire reçues :", req.body);
  
      const { name, instructions, ingredients, image_url } = req.body;
  
      const recipe = await Recipe.findByPk(req.params.id);
      if (!recipe) {
        console.log("Recette non trouvée avec cet id");
        return res.status(404).send("Recette non trouvée");
      }
  
      await recipe.update({ name, instructions, ingredients, image_url });
      console.log("Recette modifiée avec succès");
      res.redirect("/admin");
    } catch (error) {
      console.error("Erreur lors de la modification :", error);
      res.status(500).send("Erreur lors de la modification de la recette");
    }
  },
  

  deleteRecipe: async (req, res) => {
    try {
      const recipe = await Recipe.findByPk(req.params.id);
      if (!recipe) return res.status(404).send("Recette non trouvée");
      await recipe.destroy();
      res.redirect("/admin");
    } catch (error) {
      res.status(500).send("Erreur lors de la suppression de la recette");
    }
  }
};

export default recipeController;
