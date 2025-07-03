import { Recipe } from "../models/index.js";

const recipeController = {
  showAllRecipes: async (req, res) => {
    try {
      const recipes = await Recipe.findAll();
      res.send(recipes); // envoie directement les données brutes pour test
    } catch (error) {
      res.status(500).send("Erreur lors de la récupération des recettes");
    }
  },

  showRecipeDetail: async (req, res) => {
    try {
      const recipe = await Recipe.findByPk(req.params.id);
      if (!recipe) return res.status(404).send("Recette non trouvée");
      res.send(recipe); 
    } catch (error) {
      res.status(500).send("Erreur lors de la récupération de la recette");
    }
  },

  showAddRecipeForm: (req, res) => {
    res.send("Affichage formulaire ajout recette (non implémenté)");
  },

  addRecipe: async (req, res) => {
    try {
      const { name, instructions, ingredients, image_url } = req.body;
      const newRecipe = await Recipe.create({ name, instructions, ingredients, image_url });
      res.send(newRecipe);
    } catch (error) {
      res.status(500).send("Erreur lors de l'ajout de la recette");
    }
  },

  showEditRecipeForm: async (req, res) => {
    try {
      const recipe = await Recipe.findByPk(req.params.id);
      if (!recipe) return res.status(404).send("Recette non trouvée");
      res.send(recipe); 
    } catch (error) {
      res.status(500).send("Erreur lors de la récupération de la recette");
    }
  },

  editRecipe: async (req, res) => {
    try {
      const { name, instructions, ingredients, image_url } = req.body;
      const recipe = await Recipe.findByPk(req.params.id);
      if (!recipe) return res.status(404).send("Recette non trouvée");
      await recipe.update({ name, instructions, ingredients, image_url });
      res.send(recipe); // envoie recette mise à jour
    } catch (error) {
      res.status(500).send("Erreur lors de la modification de la recette");
    }
  },

  deleteRecipe: async (req, res) => {
    try {
      const recipe = await Recipe.findByPk(req.params.id);
      if (!recipe) return res.status(404).send("Recette non trouvée");
      await recipe.destroy();
      res.send("Recette supprimée");
    } catch (error) {
      res.status(500).send("Erreur lors de la suppression de la recette");
    }
  },
};

export default recipeController;
